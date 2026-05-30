const { models, sequelize } = require("../config/db");
const { Op } = require("sequelize");
const paymentService = require("./paymentService");
const { BadRequestError, NotFoundError, ForbiddenError } = require("../utils/errors");

// Helper to generate a unique order code
const generateOrderCode = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Create a new order
 */
const createOrder = async (userId, data) => {
  const { items, shippingAddress, couponId, paymentMethod, ipAddress } = data;

  if (!items || items.length === 0) {
    throw new BadRequestError("No order items");
  }

  const transaction = await sequelize.transaction();
  try {
    let addressIdToUse = null;
    if (shippingAddress) {
      const newAddress = await models.addresses.create({
        userId,
        recipientName: shippingAddress.recipientName,
        phoneNumber: shippingAddress.phoneNumber,
        addressLine: shippingAddress.addressLine,
        city: shippingAddress.city
      }, { transaction });
      addressIdToUse = newAddress.addressId;
    }

    let totalAmount = 0;
    const orderItemsData = [];
    const variantIdsToUpdate = [];

    // 1. Verify items and calculate total amount
    for (const item of items) {
      const variant = await models.product_variants.findByPk(item.variantId, { transaction });
      if (!variant) {
        throw new NotFoundError(`Variant ${item.variantId} not found`);
      }

      let actualPrice = variant.price;
      if (!actualPrice) {
          const product = await models.products.findByPk(variant.productId, { transaction });
          actualPrice = product.basePrice;
      }

      const itemTotal = Number(actualPrice) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        variantId: item.variantId,
        quantity: item.quantity,
        priceAtTime: actualPrice
      });
      variantIdsToUpdate.push(item.variantId);
    }

    // 2. Calculate shipping and final amount
    const shippingFee = 0; // Free shipping as requested
    let finalAmount = totalAmount + shippingFee;

    // 3. Create the order
    const order = await models.orders.create({
      orderCode: generateOrderCode(),
      userId,
      couponId: couponId || null,
      totalAmount,
      shippingFee,
      finalAmount,
      shippingAddressId: addressIdToUse,
      paymentMethod: paymentMethod || 'COD',
      status: 'pending'
    }, { transaction });

    // 4. Create order items
    const orderItemsToCreate = orderItemsData.map(item => ({
      orderId: order.orderId,
      ...item
    }));
    await models.order_items.bulkCreate(orderItemsToCreate, { transaction });

    // 5. Remove purchased items from the user's cart (Only for COD. Online payments clear after successful IPN)
    if (!paymentMethod || paymentMethod === 'COD') {
      const cart = await models.cart.findOne({ where: { userId }, transaction });
      if (cart) {
        await models.cart_items.destroy({
          where: {
            cartId: cart.cartId,
            variantId: {
              [Op.in]: variantIdsToUpdate
            }
          },
          transaction,
          force: true
        });
      }
    }

    // 6. Handle MoMo payment flow
    let payUrl = null;
    if (paymentMethod === 'MOMO') {
      // Create a pending payment record
      await models.payments.create({
        orderId: order.orderId,
        paymentMethod: 'e_wallet',
        amount: finalAmount,
        status: 'pending'
      }, { transaction });

      // Commit transaction before calling external MoMo API
      await transaction.commit();

      // Call MoMo API to create payment (outside transaction)
      try {
        const momoResult = await paymentService.createMoMoPayment(order);
        payUrl = momoResult.payUrl;
      } catch (momoError) {
        console.error("❌ MoMo API call failed:", momoError.message);
        throw new BadRequestError(`Không thể tạo thanh toán MoMo: ${momoError.message}`);
      }

      return { ...order.toJSON(), payUrl };
    }

    // 7. Handle VNPay payment flow
    if (paymentMethod === 'VNPAY') {
      // Create a pending payment record
      await models.payments.create({
        orderId: order.orderId,
        paymentMethod: 'bank_transfer',
        amount: finalAmount,
        status: 'pending'
      }, { transaction });

      // Commit transaction before generating VNPay URL
      await transaction.commit();

      // Generate VNPay payment URL (outside transaction)
      try {
        const vnpayResult = await paymentService.createVNPayPayment(order, ipAddress);
        payUrl = vnpayResult.payUrl;
      } catch (vnpayError) {
        console.error("❌ VNPay URL generation failed:", vnpayError.message);
        throw new BadRequestError(`Không thể tạo thanh toán VNPay: ${vnpayError.message}`);
      }

      return { ...order.toJSON(), payUrl };
    }

    await transaction.commit();
    return order;
  } catch (error) {
    // Only rollback if transaction hasn't been committed yet
    if (!error.message?.startsWith('Không thể tạo thanh toán MoMo') && !error.message?.startsWith('Không thể tạo thanh toán VNPay')) {
      try { await transaction.rollback(); } catch (e) { /* already committed */ }
    }
    throw error;
  }
};

/**
 * Get user orders
 */
const getUserOrders = async (userId) => {
  return await models.orders.findAll({
    where: { 
      userId,
      [Op.not]: {
        status: 'pending',
        paymentMethod: { [Op.in]: ['MOMO', 'VNPAY'] }
      }
    },
    include: [
      {
        model: models.payments,
        as: 'payment',
        attributes: ['paymentId', 'paymentMethod', 'transactionId', 'amount', 'status', 'paymentDate']
      },
      {
        model: models.order_items,
        as: 'orderItems',
        include: [
          {
            model: models.product_variants,
            as: 'variant',
            include: [
              {
                model: models.products,
                as: 'product',
                attributes: ['productId', 'name', 'slug'],
                include: [
                  {
                    model: models.product_images,
                    as: 'productImages',
                    attributes: ['imageUrl', 'isPrimary']
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

/**
 * Get order by ID
 */
const getOrderById = async (orderId, userId, userRole) => {
  const order = await models.orders.findByPk(orderId, {
    include: [
      {
        model: models.addresses,
        as: 'shippingAddress',
        attributes: ['recipientName', 'phoneNumber', 'addressLine', 'city']
      },
      {
        model: models.order_items,
        as: 'orderItems',
        include: [
          {
            model: models.product_variants,
            as: 'variant',
            include: [
              {
                model: models.products,
                as: 'product',
                attributes: ['productId', 'name', 'slug'],
                include: [
                  {
                    model: models.product_images,
                    as: 'productImages',
                    attributes: ['imageUrl', 'isPrimary']
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (userRole !== 'admin' && order.userId !== userId) {
    throw new ForbiddenError("Not authorized to view this order");
  }

  return order;
};

/**
 * Update order status
 */
const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new BadRequestError("Invalid status");
  }

  const order = await models.orders.findByPk(orderId);
  if (!order) {
    throw new NotFoundError("Order not found");
  }

  order.status = status;
  await order.save();
  return order;
};

/**
 * Get all orders for Admin with pagination, filtering, and search
 */
const getAllOrders = async (query) => {
  const { page = 1, limit = 10, status, search } = query;
  const offset = (page - 1) * limit;

  const whereClause = {
    [Op.not]: {
      status: 'pending',
      paymentMethod: { [Op.in]: ['MOMO', 'VNPAY'] }
    }
  };
  
  if (status) {
    if (status === 'refund_pending') {
      // Special case: filter by payment status, not order status
      whereClause['$payment.status$'] = 'refund_pending';
    } else {
      whereClause.status = status;
    }
  }

  const userIncludeClause = {
    model: models.users,
    as: 'user',
    attributes: ['userId', 'fullName', 'email', 'phone']
  };

  if (search) {
    whereClause[Op.or] = [
      { orderCode: { [Op.like]: `%${search}%` } },
      { '$user.full_name$': { [Op.like]: `%${search}%` } },
      { '$user.email$': { [Op.like]: `%${search}%` } }
    ];
  }

  const { count, rows } = await models.orders.findAndCountAll({
    where: whereClause,
    include: [
      userIncludeClause,
      {
        model: models.addresses,
        as: 'shippingAddress',
        attributes: ['recipientName', 'phoneNumber', 'addressLine', 'city']
      },
      {
        model: models.payments,
        as: 'payment',
        attributes: ['paymentId', 'paymentMethod', 'transactionId', 'amount', 'status', 'paymentDate']
      },
      {
        model: models.order_items,
        as: 'orderItems',
        include: [
          {
            model: models.product_variants,
            as: 'variant',
            include: [
              {
                model: models.products,
                as: 'product',
                attributes: ['productId', 'name', 'slug'],
                include: [
                  {
                    model: models.product_images,
                    as: 'productImages'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    subQuery: false // Required when filtering by included model's attributes in where clause
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
    orders: rows
  };
};

/**
 * Cancel an order by ID (User action)
 * - If payment was completed (paid online): set payment to refund_pending, save refund info
 * - If payment was NOT completed (COD or unpaid): just cancel directly
 */
const cancelOrder = async (orderId, userId, cancelData = {}) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await models.orders.findByPk(orderId, { include: ['payment'], transaction });
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    
    // Check ownership
    if (order.userId !== userId) {
      throw new ForbiddenError('Not authorized to cancel this order');
    }

    // Check status — only pending or processing can be cancelled
    if (order.status !== 'pending' && order.status !== 'processing') {
      throw new BadRequestError(`Cannot cancel order in '${order.status}' status`);
    }

    // Save cancel reason
    if (cancelData.cancelReason) {
      order.cancelReason = cancelData.cancelReason;
    }

    // Check if payment was already completed (online payment success)
    const payment = order.payment;
    const isPaid = payment && payment.status === 'completed';

    if (isPaid) {
      // Payment was successful — need refund process
      // Require refund bank info
      if (!cancelData.refundBankName || !cancelData.refundAccountNumber || !cancelData.refundAccountName) {
        throw new BadRequestError('Vui lòng cung cấp thông tin tài khoản nhận hoàn tiền');
      }

      order.refundBankName = cancelData.refundBankName;
      order.refundAccountNumber = cancelData.refundAccountNumber;
      order.refundAccountName = cancelData.refundAccountName;
      order.status = 'cancelled';
      await order.save({ transaction });

      // Mark payment as awaiting refund
      payment.status = 'refund_pending';
      await payment.save({ transaction });

      console.log(`⏳ Order #${order.orderCode} cancelled — refund pending (paid via ${order.paymentMethod})`);
    } else {
      // Payment was NOT completed (COD or unpaid online) — just cancel
      order.status = 'cancelled';
      await order.save({ transaction });

      if (payment) {
        payment.status = 'failed';
        await payment.save({ transaction });
      }

      console.log(`❌ Order #${order.orderCode} cancelled directly (no refund needed)`);
    }

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Approve refund for a cancelled order (Admin action)
 * Sets payment status from 'refund_pending' to 'refunded'
 */
const approveRefund = async (orderId) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await models.orders.findByPk(orderId, {
      include: [{ model: models.payments, as: 'payment' }],
      transaction
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.status !== 'cancelled') {
      throw new BadRequestError('Order is not cancelled');
    }

    const payment = order.payment;
    if (!payment || payment.status !== 'refund_pending') {
      throw new BadRequestError('No pending refund for this order');
    }

    payment.status = 'refunded';
    payment.paymentDate = new Date(); // Record refund date
    await payment.save({ transaction });

    console.log(`✅ Refund approved for order #${order.orderCode}`);

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  approveRefund
};

