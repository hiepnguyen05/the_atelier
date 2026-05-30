const orderService = require("../services/orderService");

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const orderData = req.body;
    
    // Extract client IP for VNPay (required parameter)
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
      || req.socket?.remoteAddress 
      || '127.0.0.1';
    
    const order = await orderService.createOrder(userId, { ...orderData, ipAddress });
    
    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user orders
 * @route   GET /api/orders
 * @access  Private
 */
const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const order = await orderService.getOrderById(orderId, userId, userRole);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Admin only)
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders for Admin
 * @route   GET /api/orders/admin
 * @access  Private (Admin only)
 */
const getAllOrders = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel user order (with optional refund info for paid orders)
 * @route   PUT /api/orders/:id/cancel
 * @access  Private (User only)
 */
const cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.userId;
    const cancelData = {
      cancelReason: req.body.cancelReason,
      refundBankName: req.body.refundBankName,
      refundAccountNumber: req.body.refundAccountNumber,
      refundAccountName: req.body.refundAccountName
    };
    
    const order = await orderService.cancelOrder(orderId, userId, cancelData);
    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve refund for a cancelled order (Admin action)
 * @route   PUT /api/orders/:id/approve-refund
 * @access  Private (Admin only)
 */
const approveRefund = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.approveRefund(orderId);
    res.status(200).json({ message: "Refund approved successfully", order });
  } catch (error) {
    next(error);
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
