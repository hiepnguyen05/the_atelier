const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  approveRefund
} = require("../controllers/orderController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// All order routes require authentication
router.use(protect);

router.post("/", createOrder);
router.get("/", getUserOrders);

// Admin only routes
router.get("/admin", authorize("admin"), getAllOrders);

router.get("/:id", getOrderById);

// User cancel order
router.put("/:id/cancel", cancelOrder);

// Admin: approve refund
router.put("/:id/approve-refund", authorize("admin"), approveRefund);

// Update status requires admin privileges
router.put("/:id/status", authorize("admin"), updateOrderStatus);

module.exports = router;
