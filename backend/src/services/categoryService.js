const { models } = require("../config/db");
const { generateSlug } = require("../utils/slugifyUtils");
const Sequelize = require("sequelize");
const { NotFoundError, BadRequestError } = require("../utils/errors");

/**
 * Get all categories (supports filtering by parentId)
 */
const getAllCategories = async (parentId) => {
  const where = parentId ? { parentId } : {};
  return await models.categories.findAll({
    where,
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM products AS p
            WHERE p.category_id = categories.category_id
            AND p.deleted_at IS NULL
          )`),
          "productCount",
        ],
      ],
    },
    include: [
      {
        model: models.categories,
        as: "subCategories",
      },
    ],
  });
};

/**
 * Get category by ID
 */
const getCategoryById = async (id) => {
  return await models.categories.findByPk(id, {
    include: [
      {
        model: models.categories,
        as: "subCategories",
      },
    ],
  });
};

/**
 * Create a new category
 */
const createCategory = async (data) => {
  // Check parent category if provided
  let parentSlug = "";
  if (data.parentId) {
    const parent = await models.categories.findByPk(data.parentId);
    if (!parent) {
      throw new NotFoundError("Parent category not found");
    }
    parentSlug = parent.slug;
  }

  // Check for duplicates in the same level (including soft-deleted ones)
  const existingCategory = await models.categories.findOne({
    where: {
      name: data.name,
      parentId: data.parentId || null,
    },
    paranoid: false,
  });

  if (existingCategory) {
    if (!existingCategory.deletedAt) {
      throw new BadRequestError("Danh mục này đã tồn tại trong cùng cấp");
    } else {
      await existingCategory.destroy({ force: true });
    }
  }

  // Auto-generate slug
  if (!data.slug || data.slug.trim() === "") {
    data.slug = generateSlug(data.name, parentSlug);
  }

  // Check for duplicate slugs
  const existingSlug = await models.categories.findOne({
    where: { slug: data.slug },
    paranoid: false,
  });
  if (existingSlug && existingSlug.deletedAt) {
    await existingSlug.destroy({ force: true });
  }

  return await models.categories.create(data);
};

/**
 * Update category
 */
const updateCategory = async (id, data) => {
  const category = await models.categories.findByPk(id);
  if (!category) return null;

  if (data.name && (!data.slug || data.slug.trim() === "")) {
    data.slug = generateSlug(data.name);
  }

  return await category.update(data);
};

/**
 * Soft delete category
 */
const deleteCategory = async (id) => {
  const category = await models.categories.findByPk(id);
  if (!category) return false;

  // Check for sub-categories
  const subCategoriesCount = await models.categories.count({ where: { parentId: id } });
  if (subCategoriesCount > 0) {
    throw new BadRequestError("Cannot delete category with sub-categories");
  }

  // Update slug/name to avoid conflicts upon recreation
  await category.update({
    slug: `${category.slug}-deleted-${Date.now()}`,
    name: `${category.name} (Deleted-${Date.now()})`,
  });

  await category.destroy();
  return true;
};

/**
 * Get category by slug
 */
const getCategoryBySlug = async (slug) => {
  return await models.categories.findOne({
    where: { slug },
    include: [
      {
        model: models.categories,
        as: "subCategories",
      },
    ],
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
