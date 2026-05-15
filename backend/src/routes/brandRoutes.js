const express = require("express");
const router = express.Router();
const brandService = require("../services/brandService");
const asyncHandler = require("../utils/asyncHandler");

router.get("/", asyncHandler(async (req, res) => {
  const brands = await brandService.getAllBrands();
  res.json(brands);
}));

router.post("/", asyncHandler(async (req, res) => {
  const brand = await brandService.createBrand(req.body);
  res.status(201).json(brand);
}));

module.exports = router;
