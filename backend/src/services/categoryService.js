const { models, sequelize } = require("../config/db");
const { generateSlug } = require("../utils/slugifyUtils");
const Sequelize = require("sequelize");

const getAllCategories = async (parentId) => {
  const where = parentId ? { parentId: parentId } : {};
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
          "productCount"
        ]
      ]
    },
    include: [
      {
        model: models.categories,
        as: "subCategories",
      },
    ],
  });
};

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

const createCategory = async (data) => {
  // 1. Nếu có parentId, kiểm tra xem danh mục cha có tồn tại không
  let parentSlug = "";
  if (data.parentId) {
    const parent = await models.categories.findByPk(data.parentId);
    if (!parent) {
      throw new Error("Parent category not found");
    }
    parentSlug = parent.slug;
  }

  // 2. Kiểm tra xem danh mục cùng tên có tồn tại trong cùng một cha chưa (bao gồm cả bản ghi đã xóa)
  const existingCategory = await models.categories.findOne({
    where: {
      name: data.name,
      parentId: data.parentId || null,
    },
    paranoid: false
  });

  if (existingCategory) {
    if (!existingCategory.deletedAt) {
      throw new Error("Danh mục này đã tồn tại trong cùng cấp");
    } else {
      // Nếu đã bị xóa mềm trước đó, xóa vĩnh viễn để nhường chỗ cho bản ghi mới
      await existingCategory.destroy({ force: true });
    }
  }

  // 3. Tự động tạo slug thông minh
  if (!data.slug || data.slug.trim() === "") {
    data.slug = generateSlug(data.name, parentSlug);
  }

  // Kiểm tra trùng slug (bao gồm cả bản ghi đã xóa)
  const existingSlug = await models.categories.findOne({
    where: { slug: data.slug },
    paranoid: false
  });
  if (existingSlug && existingSlug.deletedAt) {
    await existingSlug.destroy({ force: true });
  }
  
  return await models.categories.create(data);
};

const updateCategory = async (id, data) => {
  const category = await models.categories.findByPk(id);
  if (!category) return null;

  if (data.name && (!data.slug || data.slug.trim() === "")) {
    data.slug = generateSlug(data.name);
  }

  return await category.update(data);
};

const deleteCategory = async (id) => {
  const category = await models.categories.findByPk(id);
  if (!category) return false;
  
  // Kiểm tra xem có danh mục con không
  const subCategoriesCount = await models.categories.count({ where: { parentId: id } });
  if (subCategoriesCount > 0) {
    throw new Error("Cannot delete category with sub-categories");
  }

  // Cập nhật slug và name để tránh trùng lặp khi tạo mới (do soft delete vẫn giữ bản ghi)
  await category.update({ 
    slug: `${category.slug}-deleted-${Date.now()}`,
    name: `${category.name} (Deleted-${Date.now()})`
  });

  await category.destroy();
  return true;
};

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
