const { models } = require("../config/db");
const { generateSlug } = require("../utils/slugifyUtils");

const getAllCategories = async () => {
  return await models.categories.findAll({
    where: { parent_id: null },
    include: [
      {
        model: models.categories,
        as: "sub_categories",
      },
    ],
  });
};

const getCategoryById = async (id) => {
  return await models.categories.findByPk(id, {
    include: [
      {
        model: models.categories,
        as: "sub_categories",
      },
    ],
  });
};

const createCategory = async (data) => {
  // 1. Nếu có parent_id, kiểm tra xem danh mục cha có tồn tại không
  let parentSlug = "";
  if (data.parent_id) {
    const parent = await models.categories.findByPk(data.parent_id);
    if (!parent) {
      throw new Error("Parent category not found");
    }
    parentSlug = parent.slug;
  }

  // 2. Kiểm tra xem danh mục cùng tên có tồn tại trong cùng một cha chưa
  const existingCategory = await models.categories.findOne({
    where: {
      name: data.name,
      parent_id: data.parent_id || null,
    },
  });

  if (existingCategory) {
    throw new Error("Danh mục này đã tồn tại trong cùng cấp");
  }

  // 3. Tự động tạo slug thông minh (Ghép slug cha nếu là danh mục con)
  if (!data.slug || data.slug.trim() === "") {
    data.slug = generateSlug(data.name, parentSlug);
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
  const subCategories = await models.categories.count({ where: { parent_id: id } });
  if (subCategories > 0) {
    throw new Error("Cannot delete category with sub-categories");
  }

  await category.destroy();
  return true;
};

const getCategoryBySlug = async (slug) => {
  return await models.categories.findOne({
    where: { slug },
    include: [
      {
        model: models.categories,
        as: "sub_categories",
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
