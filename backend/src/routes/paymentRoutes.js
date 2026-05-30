const express = require("express");
const router = express.Router();
const { 
  handleMoMoIPN, 
  verifyMoMoPayment,
  handleVNPayIPN,
  verifyVNPayPayment
} = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

// ===== MoMo Routes =====
// PUBLIC route — MoMo servers call this directly (no JWT auth)
router.post("/momo-ipn", handleMoMoIPN);

// PRIVATE route — Frontend verifies payment after MoMo redirect
router.post("/momo-verify", protect, verifyMoMoPayment);

// ===== VNPay Routes =====
// PUBLIC route — VNPay servers call this via GET (no JWT auth)
router.get("/vnpay-ipn", handleVNPayIPN);

// PRIVATE route — Frontend verifies payment after VNPay redirect
router.post("/vnpay-verify", protect, verifyVNPayPayment);

module.exports = router;
