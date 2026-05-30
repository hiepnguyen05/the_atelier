const categoryService = require("../services/categoryService");
const { NotFoundError } = require("../utils/errors");

const getAllCategories = async (req, res, next) => {
  try {
    const { parentId } = req.query;
    const categories = await categoryService.getAllCategories(parentId);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// Smart handler for both ID and Slug
const getCategory = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let category;

    // If identifier is a number, try ID first
    if (!isNaN(identifier)) {
      category = await categoryService.getCategoryById(identifier);
    }

    // If not found by ID (or not a number), try Slug
    if (!category) {
      category = await categoryService.getCategoryBySlug(identifier);
    }

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const success = await categoryService.deleteCategory(req.params.id);
    if (!success) {
      throw new NotFoundError("Category not found");
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
