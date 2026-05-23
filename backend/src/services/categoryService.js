const { models } = require("../config/db");
const { generateSlug } = require("../utils/slugifyUtils");
const Sequelize = require("sequelize");

/**
 * Lấy tất cả danh mục (hỗ trợ filter theo parentId)
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
 * Lấy danh mục theo ID
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
 * Tạo danh mục mới
 */
const createCategory = async (data) => {
  // Kiểm tra danh mục cha nếu có
  let parentSlug = "";
  if (data.parentId) {
    const parent = await models.categories.findByPk(data.parentId);
    if (!parent) {
      throw new Error("Parent category not found");
    }
    parentSlug = parent.slug;
  }

  // Kiểm tra trùng tên trong cùng cấp (bao gồm bản ghi đã xóa mềm)
  const existingCategory = await models.categories.findOne({
    where: {
      name: data.name,
      parentId: data.parentId || null,
    },
    paranoid: false,
  });

  if (existingCategory) {
    if (!existingCategory.deletedAt) {
      throw new Error("Danh mục này đã tồn tại trong cùng cấp");
    } else {
      await existingCategory.destroy({ force: true });
    }
  }

  // Tự động tạo slug
  if (!data.slug || data.slug.trim() === "") {
    data.slug = generateSlug(data.name, parentSlug);
  }

  // Kiểm tra trùng slug
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
 * Cập nhật danh mục
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
 * Xóa danh mục (soft delete)
 */
const deleteCategory = async (id) => {
  const category = await models.categories.findByPk(id);
  if (!category) return false;

  // Kiểm tra danh mục con
  const subCategoriesCount = await models.categories.count({ where: { parentId: id } });
  if (subCategoriesCount > 0) {
    throw new Error("Cannot delete category with sub-categories");
  }

  // Cập nhật slug/name để tránh trùng lặp khi tạo mới
  await category.update({
    slug: `${category.slug}-deleted-${Date.now()}`,
    name: `${category.name} (Deleted-${Date.now()})`,
  });

  await category.destroy();
  return true;
};

/**
 * Lấy danh mục theo slug
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
