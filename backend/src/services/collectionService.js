const { models, sequelize } = require("../config/db");
const { Op } = require("sequelize");
const { generateSlug } = require("../utils/slugifyUtils");

const getAllCollections = async (query = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    status, 
    isFeatured,
    sort = "newest"
  } = query;

  const offset = (page - 1) * limit;
  const whereClause = {};

  if (status && status !== "all") {
    whereClause.isActive = status === "active";
  }

  if (isFeatured !== undefined) {
    whereClause.isFeatured = isFeatured === "true" || isFeatured === true;
  }

  if (search) {
    whereClause.name = { [Op.like]: `%${search}%` };
  }

  // Cấu hình sắp xếp
  let order = [["createdAt", "DESC"]];
  if (sort === "year_desc") order = [["year", "DESC"], ["createdAt", "DESC"]];
  if (sort === "name_asc") order = [["name", "ASC"]];

  const { count, rows } = await models.collections.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM products AS p
            WHERE p.collection_id = collections.collection_id
          )`),
          "productCount"
        ]
      ]
    },
    order: order,
    distinct: true
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    collections: rows,
  };
};

const getCollectionBySlug = async (slug) => {
  return await models.collections.findOne({
    where: { slug },
    include: [
      {
        model: models.products,
        as: "products",
        where: { status: "active" },
        required: false,
        include: [{ model: models.product_images, as: "productImages", limit: 1 }]
      }
    ]
  });
};

const createCollection = async (data) => {
  if (!data.slug || data.slug.trim() === "") {
    data.slug = generateSlug(data.name);
  }
  return await models.collections.create(data);
};

const updateCollection = async (id, data) => {
  const collection = await models.collections.findByPk(id);
  if (!collection) return null;
  
  if (data.name && (!data.slug || data.slug.trim() === "")) {
    data.slug = generateSlug(data.name);
  }
  
  return await collection.update(data);
};

const deleteCollection = async (id) => {
  const collection = await models.collections.findByPk(id);
  if (!collection) return false;
  
  // Kiểm tra xem có sản phẩm nào đang thuộc bộ sưu tập này không
  const productCount = await models.products.count({ where: { collectionId: id } });
  if (productCount > 0) {
    throw new Error("Không thể xóa bộ sưu tập đang có sản phẩm. Hãy chuyển sản phẩm sang bộ sưu tập khác trước.");
  }

  await collection.destroy();
  return true;
};

module.exports = {
  getAllCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
};
