const productService = require("../services/productService");
const asyncHandler = require("../utils/asyncHandler");

const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);
  res.json(result);
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const success = await productService.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json({ message: "Product deleted (inactivated) successfully" });
});

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
