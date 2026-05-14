const { models, sequelize } = require("../config/db");
const { Op } = require("sequelize");
const { generateSlug } = require("../utils/slugifyUtils");

const getProducts = async (query) => {
  const { page = 1, limit = 10, category_id, collection_id, search } = query;
  const offset = (page - 1) * limit;

  const whereClause = { status: "active" };
  if (category_id) whereClause.category_id = category_id;
  if (collection_id) whereClause.collection_id = collection_id;
  if (search) {
    whereClause.name = { [Op.like]: `%${search}%` };
  }

  const { count, rows } = await models.products.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [
      { model: models.product_images, as: "product_images", limit: 1 },
    ],
    order: [["product_id", "DESC"]],
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    products: rows,
  };
};

const getProductBySlug = async (slug) => {
  const product = await models.products.findOne({
    where: { slug, status: "active" },
    include: [
      { model: models.product_images, as: "product_images" },
      { model: models.product_variants, as: "product_variants" },
      { model: models.categories, as: "category" },
      { model: models.collections, as: "collection" },
    ],
  });
  return product;
};

/**
 * Tạo sản phẩm hoàn chỉnh kèm Ảnh và Biến thể trong một Transaction
 */
const createProduct = async (productData) => {
  const { images, variants, ...mainData } = productData;

  // Tự động tạo slug
  if (!mainData.slug || mainData.slug.trim() === "") {
    mainData.slug = generateSlug(mainData.name, mainData.sku_base);
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Tạo sản phẩm chính
    const product = await models.products.create(mainData, { transaction });

    // 2. Tạo ảnh sản phẩm (nếu có)
    if (images && images.length > 0) {
      const imageData = images.map(img => ({
        ...img,
        product_id: product.product_id
      }));
      await models.product_images.bulkCreate(imageData, { transaction });
    }

    // 3. Tạo biến thể sản phẩm (nếu có)
    if (variants && variants.length > 0) {
      const variantData = variants.map(v => ({
        ...v,
        product_id: product.product_id
      }));
      await models.product_variants.bulkCreate(variantData, { transaction });
    }

    await transaction.commit();
    
    // Trả về sản phẩm đầy đủ sau khi tạo
    return await getProductBySlug(product.slug);

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateProduct = async (id, productData) => {
  const product = await models.products.findByPk(id);
  if (!product) return null;

  const { images, variants, ...mainData } = productData;

  if (mainData.name && (!mainData.slug || mainData.slug.trim() === "")) {
    mainData.slug = generateSlug(mainData.name, mainData.sku_base || product.sku_base);
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Cập nhật thông tin chính
    await product.update(mainData, { transaction });

    // 2. Cập nhật ảnh (Xóa cũ thêm mới - Cách đơn giản nhất)
    if (images) {
      await models.product_images.destroy({ where: { product_id: id }, transaction });
      const imageData = images.map(img => ({ ...img, product_id: id }));
      await models.product_images.bulkCreate(imageData, { transaction });
    }

    // 3. Cập nhật biến thể (Xóa cũ thêm mới)
    if (variants) {
      await models.product_variants.destroy({ where: { product_id: id }, transaction });
      const variantData = variants.map(v => ({ ...v, product_id: id }));
      await models.product_variants.bulkCreate(variantData, { transaction });
    }

    await transaction.commit();
    return await getProductBySlug(product.slug);

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteProduct = async (id) => {
  const product = await models.products.findByPk(id);
  if (!product) return false;
  
  await product.update({ status: "inactive" });
  return true;
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
