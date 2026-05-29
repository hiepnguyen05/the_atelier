const orderService = require("../services/orderService");

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderData = req.body;
    
    const order = await orderService.createOrder(userId, orderData);
    
    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    console.error("Error creating order:", error);
    const statusCode = error.message === "No order items" ? 400 : 500;
    res.status(statusCode).json({ message: error.message || "Failed to create order" });
  }
};

/**
 * @desc    Get user orders
 * @route   GET /api/orders
 * @access  Private
 */
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const order = await orderService.getOrderById(orderId, userId, userRole);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    if (error.message === "Order not found") return res.status(404).json({ message: error.message });
    if (error.message === "Not authorized to view this order") return res.status(403).json({ message: error.message });
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Admin only)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    if (error.message === "Invalid status") return res.status(400).json({ message: error.message });
    if (error.message === "Order not found") return res.status(404).json({ message: error.message });
    res.status(500).json({ message: "Failed to update order status" });
  }
};

/**
 * @desc    Get all orders for Admin
 * @route   GET /api/orders/admin
 * @access  Private (Admin only)
 */
const getAllOrders = async (req, res) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};
