const categoryService = require("../services/categoryService");
const asyncHandler = require("../utils/asyncHandler");

const getAllCategories = asyncHandler(async (req, res) => {
  const { parentId } = req.query;
  const categories = await categoryService.getAllCategories(parentId);
  res.json(categories);
});

// Hàm thông minh xử lý cả ID và Slug
const getCategory = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  let category;

  // Nếu identifier là số, thử tìm theo ID trước
  if (!isNaN(identifier)) {
    category = await categoryService.getCategoryById(identifier);
  }

  // Nếu không tìm thấy bằng ID (hoặc không phải số), tìm theo Slug
  if (!category) {
    category = await categoryService.getCategoryBySlug(identifier);
  }

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json(category);
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json(category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const success = await categoryService.deleteCategory(req.params.id);
  if (!success) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json({ message: "Category deleted successfully" });
});

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
