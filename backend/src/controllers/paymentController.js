const paymentService = require("../services/paymentService");

/**
 * @desc    Handle MoMo IPN (Instant Payment Notification) callback
 * @route   POST /api/payments/momo-ipn
 * @access  Public (called directly by MoMo servers)
 */
const handleMoMoIPN = async (req, res) => {
  console.log("📨 MoMo IPN received:", JSON.stringify(req.body, null, 2));

  try {
    const isValid = paymentService.verifyMoMoSignature(req.body);
    if (!isValid) {
      console.error("❌ MoMo IPN signature verification failed!");
      return res.status(400).json({ message: "Invalid signature" });
    }

    await paymentService.processIPN(req.body);
    return res.status(204).send();
  } catch (error) {
    console.error("❌ Error processing MoMo IPN:", error.message);
    // Always return 200 to webhook providers so they don't retry unnecessarily
    return res.status(200).json({ message: "IPN processed with error" });
  }
};

/**
 * @desc    Verify MoMo payment from return URL params and confirm order
 * @route   POST /api/payments/momo-verify
 * @access  Private
 */
const verifyMoMoPayment = async (req, res, next) => {
  try {
    const { resultCode, orderId, transId, message } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await paymentService.verifyMoMoPayment(
      userId,
      userRole,
      resultCode,
      orderId,
      transId,
      message
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Handle VNPay IPN (Instant Payment Notification) callback
 * @route   GET /api/payments/vnpay-ipn
 * @access  Public (called directly by VNPay servers via GET)
 */
const handleVNPayIPN = async (req, res) => {
  console.log("📨 VNPay IPN received:", JSON.stringify(req.query, null, 2));

  try {
    const isValid = paymentService.verifyVNPaySignature(req.query);
    if (!isValid) {
      console.error("❌ VNPay IPN signature verification failed!");
      return res.status(200).json({ RspCode: "97", Message: "Invalid checksum" });
    }

    const result = await paymentService.processVNPayIPN(req.query);
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error processing VNPay IPN:", error.message);
    return res.status(200).json({ RspCode: "99", Message: "Unknown error" });
  }
};

/**
 * @desc    Verify VNPay payment from return URL params and confirm order
 * @route   POST /api/payments/vnpay-verify
 * @access  Private
 */
const verifyVNPayPayment = async (req, res, next) => {
  try {
    const vnpParams = req.body; // All vnp_* params from the return URL
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await paymentService.verifyVNPayPayment(userId, userRole, vnpParams);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleMoMoIPN,
  verifyMoMoPayment,
  handleVNPayIPN,
  verifyVNPayPayment
};
