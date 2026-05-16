const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const validate = require("../middlewares/validate");
const { categorySchema } = require("../validations/categoryValidation");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", categoryController.getAllCategories);
router.get("/:identifier", categoryController.getCategory);

// Admin only routes
router.post("/", protect, authorize('admin'), validate(categorySchema), categoryController.createCategory);
router.put("/:id", protect, authorize('admin'), validate(categorySchema), categoryController.updateCategory);
router.delete("/:id", protect, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
