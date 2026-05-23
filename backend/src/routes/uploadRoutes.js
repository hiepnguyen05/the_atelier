const express = require("express");
const router = express.Router();
const { uploadImage, deleteImage, extractPublicId } = require("../utils/cloudinaryUtils");
const asyncHandler = require("../utils/asyncHandler");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Admin only routes
router.post("/", protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { image, folder } = req.body;
  
  if (!image) {
    return res.status(400).json({ message: "No image data provided" });
  }

  const result = await uploadImage(image, folder || "products");
  res.json(result);
}));

router.delete("/", protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { url, publicId } = req.body;
  let targetPublicId = publicId;

  if (url && !targetPublicId) {
    targetPublicId = extractPublicId(url);
  }

  if (!targetPublicId) {
    return res.status(400).json({ message: "No publicId or url provided" });
  }

  await deleteImage(targetPublicId);
  res.json({ message: "Image deleted from Cloudinary successfully" });
}));

module.exports = router;
