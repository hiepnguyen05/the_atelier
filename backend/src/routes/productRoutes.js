const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const validate = require("../middlewares/validate");
const { productSchema } = require("../validations/productValidation");

router.get("/", productController.getProducts);
router.get("/:slug", productController.getProductBySlug);
router.post("/", validate(productSchema), productController.createProduct);
router.put("/:id", validate(productSchema), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
