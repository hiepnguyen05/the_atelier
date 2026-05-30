const crypto = require("crypto");
const https = require("https");
const { models, sequelize } = require("../config/db");
const { Op } = require("sequelize");
const { BadRequestError, NotFoundError, ForbiddenError } = require("../utils/errors");

/**
 * Create a MoMo payment request and return the payUrl for redirection
 * @param {Object} order - The order object from database
 * @returns {Object} { payUrl, requestId, orderId }
 */
const createMoMoPayment = async (order) => {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const backendPublicUrl = process.env.BACKEND_PUBLIC_URL;
  const frontendUrl = process.env.FRONTEND_URL;

  const requestId = partnerCode + new Date().getTime();
  const orderId = `${order.orderCode}_${Date.now()}`;
  const orderInfo = `THE ATELIER - Thanh toán đơn hàng #${order.orderCode}`;
  const redirectUrl = `${frontendUrl}/payment/momo-return`;
  const ipnUrl = `${backendPublicUrl}/api/payments/momo-ipn`;
  const amount = String(Math.round(Number(order.finalAmount)));
  const requestType = "captureWallet";
  const extraData = Buffer.from(JSON.stringify({ 
    internalOrderId: order.orderId 
  })).toString("base64");

  // Build raw signature string in exact order required by MoMo
  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${amount}`,
    `extraData=${extraData}`,
    `ipnUrl=${ipnUrl}`,
    `orderId=${orderId}`,
    `orderInfo=${orderInfo}`,
    `partnerCode=${partnerCode}`,
    `redirectUrl=${redirectUrl}`,
    `requestId=${requestId}`,
    `requestType=${requestType}`
  ].join("&");

  // Create HMAC SHA256 signature
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: "vi"
  });

  console.log("🔐 MoMo Raw Signature:", rawSignature);
  console.log("📤 MoMo Request Body:", requestBody);

  // Send request to MoMo API
  const momoResponse = await new Promise((resolve, reject) => {
    const url = new URL(process.env.MOMO_API_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          console.log("📥 MoMo Response:", JSON.stringify(parsed, null, 2));
          resolve(parsed);
        } catch (e) {
          reject(new Error("Failed to parse MoMo response"));
        }
      });
    });

    req.on("error", (e) => {
      console.error("❌ MoMo request error:", e.message);
      reject(new Error(`MoMo API error: ${e.message}`));
    });

    req.write(requestBody);
    req.end();
  });

  if (momoResponse.resultCode !== 0) {
    throw new Error(
      `MoMo payment creation failed: ${momoResponse.message || "Unknown error"} (code: ${momoResponse.resultCode})`
    );
  }

  return {
    payUrl: momoResponse.payUrl,
    requestId: momoResponse.requestId,
    momoOrderId: orderId
  };
};

/**
 * Verify the HMAC SHA256 signature from MoMo IPN callback
 * @param {Object} body - The IPN request body from MoMo
 * @returns {boolean} Whether the signature is valid
 */
const verifyMoMoSignature = (body) => {
  const secretKey = process.env.MOMO_SECRET_KEY;
  const accessKey = process.env.MOMO_ACCESS_KEY;

  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${body.amount}`,
    `extraData=${body.extraData}`,
    `message=${body.message}`,
    `orderId=${body.orderId}`,
    `orderInfo=${body.orderInfo}`,
    `orderType=${body.orderType}`,
    `partnerCode=${body.partnerCode}`,
    `payType=${body.payType}`,
    `requestId=${body.requestId}`,
    `responseTime=${body.responseTime}`,
    `resultCode=${body.resultCode}`,
    `transId=${body.transId}`
  ].join("&");

  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  console.log("🔍 IPN Signature Verification:");
  console.log("   Received:", body.signature);
  console.log("   Expected:", expectedSignature);
  console.log("   Match:", expectedSignature === body.signature);

  return expectedSignature === body.signature;
};

/**
 * Process IPN callback from MoMo — update payment and order status
 * @param {Object} ipnBody - The IPN request body from MoMo
 */
const processIPN = async (ipnBody) => {
  const transaction = await sequelize.transaction();

  try {
    // Decode extraData to get internal order ID
    let internalOrderId;
    try {
      const decoded = JSON.parse(
        Buffer.from(ipnBody.extraData, "base64").toString("utf8")
      );
      internalOrderId = decoded.internalOrderId;
    } catch (e) {
      console.error("❌ Failed to decode extraData:", e.message);
      throw new Error("Invalid extraData in IPN");
    }

    // Find the payment record
    const payment = await models.payments.findOne({
      where: { orderId: internalOrderId },
      transaction
    });

    if (!payment) {
      throw new Error(`Payment not found for order ID: ${internalOrderId}`);
    }

    // Find the order
    const order = await models.orders.findByPk(internalOrderId, { transaction });
    if (!order) {
      throw new Error(`Order not found: ${internalOrderId}`);
    }

    if (ipnBody.resultCode === 0) {
      // Payment successful
      payment.status = "completed";
      payment.transactionId = String(ipnBody.transId);
      payment.paymentDate = new Date();
      await payment.save({ transaction });

      order.status = "processing";
      await order.save({ transaction });

      // Clear the user's cart for the purchased items
      const cart = await models.cart.findOne({ where: { userId: order.userId }, transaction });
      if (cart) {
        const orderItems = await models.order_items.findAll({ where: { orderId: order.orderId }, transaction });
        const variantIds = orderItems.map(item => item.variantId);
        if (variantIds.length > 0) {
          await models.cart_items.destroy({
            where: {
              cartId: cart.cartId,
              variantId: { [require('sequelize').Op.in]: variantIds }
            },
            transaction,
            force: true
          });
        }
      }

      console.log(`✅ Payment completed for order #${order.orderCode} (transId: ${ipnBody.transId})`);
    } else {
      // Payment failed/cancelled
      payment.status = "failed";
      payment.transactionId = ipnBody.transId ? String(ipnBody.transId) : null;
      await payment.save({ transaction });

      order.status = "cancelled";
      await order.save({ transaction });

      console.log(`❌ Payment failed for order #${order.orderCode}: ${ipnBody.message} (code: ${ipnBody.resultCode})`);
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// ===========================
// VNPay Payment Integration
// ===========================

/**
 * Sort object keys alphabetically and encode correctly (required by VNPay)
 */
const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};

/**
 * Format date as VNPay requires: yyyyMMddHHmmss
 */
const formatVNPayDate = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};

/**
 * Create a VNPay payment URL for redirection
 * @param {Object} order - The order object from database
 * @param {string} ipAddress - The client IP address
 * @returns {Object} { payUrl }
 */
const createVNPayPayment = async (order, ipAddress) => {
  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_API_URL;
  const frontendUrl = process.env.FRONTEND_URL;
  const backendPublicUrl = process.env.BACKEND_PUBLIC_URL;

  const createDate = formatVNPayDate(new Date());
  const txnRef = `${order.orderCode}_${Date.now()}`;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: `Thanh toan don hang ${order.orderCode}`,
    vnp_OrderType: "other",
    vnp_Amount: Math.round(Number(order.finalAmount)) * 100, // VNPay requires amount * 100
    vnp_ReturnUrl: `${frontendUrl}/payment/vnpay-return`,
    vnp_IpAddr: ipAddress || "127.0.0.1",
    vnp_CreateDate: createDate,
  };

  // Sort and encode params (VNPay requirement)
  vnp_Params = sortObject(vnp_Params);

  // Build query string for signing (values are already encoded in sortObject)
  const signData = Object.keys(vnp_Params)
    .map((key) => `${key}=${vnp_Params[key]}`)
    .join("&");

  // Create HMAC SHA512 signature
  const hmac = crypto.createHmac("sha512", secretKey);
  const secureHash = hmac
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  // Build final URL 
  const payUrl = `${vnpUrl}?${signData}&vnp_SecureHash=${secureHash}`;

  console.log("🔐 VNPay Params:", JSON.stringify(vnp_Params, null, 2));
  console.log("🔐 VNPay Sign Data:", signData);
  console.log("🔐 VNPay Secure Hash:", secureHash);
  console.log("📤 VNPay Pay URL:", payUrl);

  return { payUrl, txnRef };
};

/**
 * Verify the HMAC SHA512 signature from VNPay IPN/Return callback
 * @param {Object} queryParams - The query params from VNPay callback
 * @returns {boolean} Whether the signature is valid
 */
const verifyVNPaySignature = (queryParams) => {
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnp_SecureHash = queryParams.vnp_SecureHash;

  // Remove hash params before verifying
  const verifyParams = { ...queryParams };
  delete verifyParams.vnp_SecureHash;
  delete verifyParams.vnp_SecureHashType;

  // Sort and build sign data
  const sorted = sortObject(verifyParams);
  const signData = Object.keys(sorted)
    .map((key) => `${key}=${sorted[key]}`)
    .join("&");

  const hmac = crypto.createHmac("sha512", secretKey);
  const expectedHash = hmac
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  console.log("🔍 VNPay IPN Signature Verification:");
  console.log("   Received:", vnp_SecureHash);
  console.log("   Expected:", expectedHash);
  console.log("   Match:", expectedHash === vnp_SecureHash);

  return expectedHash === vnp_SecureHash;
};

/**
 * Process IPN callback from VNPay — update payment and order status
 * @param {Object} queryParams - The IPN query params from VNPay
 * @returns {Object} { RspCode, Message }
 */
const processVNPayIPN = async (queryParams) => {
  const transaction = await sequelize.transaction();

  try {
    const txnRef = queryParams.vnp_TxnRef;
    // Extract internal orderCode from txnRef format: "ORD-xxx_timestamp"
    const orderCode = txnRef ? txnRef.split("_")[0] : null;

    if (!orderCode) {
      throw new Error("Invalid vnp_TxnRef format");
    }

    // Find the order by orderCode
    const order = await models.orders.findOne({
      where: { orderCode },
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return { RspCode: "01", Message: "Order not found" };
    }

    // Find the payment record
    const payment = await models.payments.findOne({
      where: { orderId: order.orderId },
      transaction,
    });

    if (!payment) {
      await transaction.rollback();
      return { RspCode: "01", Message: "Payment not found" };
    }

    // Check if this payment was already processed
    if (payment.status === "completed") {
      await transaction.rollback();
      return { RspCode: "02", Message: "Order already confirmed" };
    }

    // Verify the amount matches
    const vnpAmount = parseInt(queryParams.vnp_Amount, 10) / 100; // VNPay sends amount * 100
    if (vnpAmount !== Math.round(Number(payment.amount))) {
      await transaction.rollback();
      return { RspCode: "04", Message: "Invalid amount" };
    }

    const responseCode = queryParams.vnp_ResponseCode;

    if (responseCode === "00") {
      // Payment successful
      payment.status = "completed";
      payment.transactionId = queryParams.vnp_TransactionNo || null;
      payment.paymentDate = new Date();
      await payment.save({ transaction });

      order.status = "processing";
      await order.save({ transaction });

      // Clear the user's cart for the purchased items
      const cart = await models.cart.findOne({ where: { userId: order.userId }, transaction });
      if (cart) {
        const orderItems = await models.order_items.findAll({ where: { orderId: order.orderId }, transaction });
        const variantIds = orderItems.map(item => item.variantId);
        if (variantIds.length > 0) {
          await models.cart_items.destroy({
            where: {
              cartId: cart.cartId,
              variantId: { [require('sequelize').Op.in]: variantIds }
            },
            transaction,
            force: true
          });
        }
      }

      console.log(
        `✅ VNPay payment completed for order #${order.orderCode} (transNo: ${queryParams.vnp_TransactionNo})`
      );
    } else {
      // Payment failed/cancelled
      payment.status = "failed";
      payment.transactionId = queryParams.vnp_TransactionNo || null;
      await payment.save({ transaction });

      order.status = "cancelled";
      await order.save({ transaction });

      console.log(
        `❌ VNPay payment failed for order #${order.orderCode}: ResponseCode=${responseCode}`
      );
    }

    await transaction.commit();
    return { RspCode: "00", Message: "Confirm success" };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Verify MoMo payment from return URL params and confirm order
 */
const verifyMoMoPayment = async (userId, userRole, resultCode, orderId, transId, message) => {
  // Extract internal orderCode from MoMo's orderId format: "ORD-xxx_timestamp"
  const orderCode = orderId ? orderId.split("_")[0] : null;

  if (!orderCode) {
    throw new BadRequestError("Invalid orderId format");
  }

  const order = await models.orders.findOne({
    where: { orderCode },
    include: [
      {
        model: models.payments,
        as: "payment",
        attributes: ["paymentId", "paymentMethod", "transactionId", "amount", "status", "paymentDate"]
      }
    ]
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (order.userId !== userId && userRole !== "admin") {
    throw new ForbiddenError("Not authorized");
  }

  // If order is already processed, just return current status
  if (order.status !== "pending") {
    return {
      orderCode: order.orderCode,
      orderStatus: order.status,
      payment: order.payment || null
    };
  }

  // Process the result from MoMo return URL
  const transaction = await sequelize.transaction();
  try {
    const payment = await models.payments.findOne({
      where: { orderId: order.orderId },
      transaction
    });

    if (Number(resultCode) === 0) {
      // Payment successful
      if (payment) {
        payment.status = "completed";
        payment.transactionId = transId ? String(transId) : null;
        payment.paymentDate = new Date();
        await payment.save({ transaction });
      }

      order.status = "processing";
      await order.save({ transaction });

      // Clear the user's cart for the purchased items
      const cart = await models.cart.findOne({ where: { userId: order.userId }, transaction });
      if (cart) {
        const orderItems = await models.order_items.findAll({ where: { orderId: order.orderId }, transaction });
        const variantIds = orderItems.map(item => item.variantId);
        if (variantIds.length > 0) {
          await models.cart_items.destroy({
            where: {
              cartId: cart.cartId,
              variantId: { [Op.in]: variantIds }
            },
            transaction,
            force: true
          });
        }
      }

      console.log(`✅ MoMo payment verified for order #${order.orderCode} (transId: ${transId})`);
    } else {
      // Payment failed/cancelled
      if (payment) {
        payment.status = "failed";
        await payment.save({ transaction });
      }
      order.status = "cancelled";
      await order.save({ transaction });

      console.log(`❌ MoMo payment failed for order #${order.orderCode}: ${message} (code: ${resultCode})`);
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }

  // Re-fetch updated order
  const updatedOrder = await models.orders.findOne({
    where: { orderCode },
    include: [
      {
        model: models.payments,
        as: "payment",
        attributes: ["paymentId", "paymentMethod", "transactionId", "amount", "status", "paymentDate"]
      }
    ]
  });

  return {
    orderCode: updatedOrder.orderCode,
    orderStatus: updatedOrder.status,
    payment: updatedOrder.payment || null
  };
};

/**
 * Verify VNPay payment from return URL params and confirm order
 */
const verifyVNPayPayment = async (userId, userRole, vnpParams) => {
  // 1. Verify signature
  const isValid = verifyVNPaySignature(vnpParams);
  if (!isValid) {
    throw new BadRequestError("Invalid VNPay signature");
  }

  const txnRef = vnpParams.vnp_TxnRef;
  const orderCode = txnRef ? txnRef.split("_")[0] : null;

  if (!orderCode) {
    throw new BadRequestError("Invalid vnp_TxnRef format");
  }

  const order = await models.orders.findOne({
    where: { orderCode },
    include: [
      {
        model: models.payments,
        as: "payment",
        attributes: ["paymentId", "paymentMethod", "transactionId", "amount", "status", "paymentDate"]
      }
    ]
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (order.userId !== userId && userRole !== "admin") {
    throw new ForbiddenError("Not authorized");
  }

  // If order is already processed, just return current status
  if (order.status !== "pending") {
    return {
      orderCode: order.orderCode,
      orderStatus: order.status,
      payment: order.payment || null
    };
  }

  // Process the result
  const responseCode = vnpParams.vnp_ResponseCode;
  const transaction = await sequelize.transaction();
  try {
    const payment = await models.payments.findOne({
      where: { orderId: order.orderId },
      transaction
    });

    if (responseCode === "00") {
      // Payment successful
      if (payment) {
        payment.status = "completed";
        payment.transactionId = vnpParams.vnp_TransactionNo || null;
        payment.paymentDate = new Date();
        await payment.save({ transaction });
      }

      order.status = "processing";
      await order.save({ transaction });

      // Clear the user's cart for the purchased items
      const cart = await models.cart.findOne({ where: { userId: order.userId }, transaction });
      if (cart) {
        const orderItems = await models.order_items.findAll({ where: { orderId: order.orderId }, transaction });
        const variantIds = orderItems.map(item => item.variantId);
        if (variantIds.length > 0) {
          await models.cart_items.destroy({
            where: {
              cartId: cart.cartId,
              variantId: { [Op.in]: variantIds }
            },
            transaction,
            force: true
          });
        }
      }

      console.log(`✅ VNPay payment verified for order #${order.orderCode} (transNo: ${vnpParams.vnp_TransactionNo})`);
    } else {
      // Payment failed/cancelled
      if (payment) {
        payment.status = "failed";
        payment.transactionId = vnpParams.vnp_TransactionNo || null;
        await payment.save({ transaction });
      }
      order.status = "cancelled";
      await order.save({ transaction });

      console.log(`❌ VNPay payment failed for order #${order.orderCode}: ResponseCode=${responseCode}`);
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }

  // Re-fetch updated order
  const updatedOrder = await models.orders.findOne({
    where: { orderCode },
    include: [
      {
        model: models.payments,
        as: "payment",
        attributes: ["paymentId", "paymentMethod", "transactionId", "amount", "status", "paymentDate"]
      }
    ]
  });

  return {
    orderCode: updatedOrder.orderCode,
    orderStatus: updatedOrder.status,
    payment: updatedOrder.payment || null
  };
};

module.exports = {
  createMoMoPayment,
  verifyMoMoSignature,
  processIPN,
  createVNPayPayment,
  verifyVNPaySignature,
  processVNPayIPN,
  verifyMoMoPayment,
  verifyVNPayPayment
};
