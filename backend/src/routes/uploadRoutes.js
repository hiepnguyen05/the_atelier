const express = require("express");
const router = express.Router();
const { uploadImage } = require("../utils/cloudinaryUtils");
const asyncHandler = require("../utils/asyncHandler");

// Sử dụng body-parser với giới hạn lớn để nhận Base64
router.post("/", asyncHandler(async (req, res) => {
  const { image, folder } = req.body;
  
  if (!image) {
    return res.status(400).json({ message: "No image data provided" });
  }

  const result = await uploadImage(image, folder || "products");
  res.json(result);
}));

module.exports = router;
