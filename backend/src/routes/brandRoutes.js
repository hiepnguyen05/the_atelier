const express = require("express");
const router = express.Router();
const brandService = require("../services/brandService");
const asyncHandler = require("../utils/asyncHandler");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", asyncHandler(async (req, res) => {
  const brands = await brandService.getAllBrands();
  res.json(brands);
}));

// Admin only routes
router.post("/", protect, authorize('admin'), asyncHandler(async (req, res) => {
  const brand = await brandService.createBrand(req.body);
  res.status(201).json(brand);
}));

module.exports = router;
