const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const validate = require("../middlewares/validate");
const { productSchema, productQuerySchema } = require("../validations/productValidation");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", validate(productQuerySchema, 'query'), productController.getProducts);
router.get("/:slug", productController.getProductBySlug);

// Admin only routes
router.post("/", protect, authorize('admin'), validate(productSchema), productController.createProduct);
router.put("/:id", protect, authorize('admin'), validate(productSchema), productController.updateProduct);
router.delete("/:id", protect, authorize('admin'), productController.deleteProduct);

module.exports = router;
