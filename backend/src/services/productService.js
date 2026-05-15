const { models, sequelize } = require("../config/db");
const { Op } = require("sequelize");
const { generateSlug, generateSKU } = require("../utils/slugifyUtils");

const getProducts = async (query) => {
  const { page = 1, limit = 10, categoryId, collectionId, search } = query;
  const offset = (page - 1) * limit;

  const whereClause = { status: "active" };
  if (categoryId) whereClause.categoryId = categoryId;
  if (collectionId) whereClause.collectionId = collectionId;
  if (search) {
    whereClause.name = { [Op.like]: `%${search}%` };
  }

  const { count, rows } = await models.products.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [
      { model: models.product_images, as: "productImages", limit: 1 },
    ],
    order: [["productId", "DESC"]],
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
      { model: models.product_images, as: "productImages" },
      { model: models.product_variants, as: "productVariants" },
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

  // Tự động tạo SKU nếu chưa có
  if (!mainData.skuBase || mainData.skuBase.trim() === "") {
    let categoryName = "GEN";
    if (mainData.categoryId) {
      const cat = await models.categories.findByPk(mainData.categoryId);
      if (cat) categoryName = cat.name;
    }
    mainData.skuBase = generateSKU(categoryName);
  }

  // Tự động tạo slug
  if (!mainData.slug || mainData.slug.trim() === "") {
    mainData.slug = generateSlug(mainData.name, mainData.skuBase);
  }

  // Kiểm tra trùng Slug hoặc SKU trong các bản ghi đã xóa mềm
  const conflictingProduct = await models.products.findOne({
    where: {
      [Op.or]: [
        { slug: mainData.slug },
        { skuBase: mainData.skuBase }
      ]
    },
    paranoid: false
  });

  if (conflictingProduct) {
    if (!conflictingProduct.deletedAt) {
      throw new Error("Sản phẩm với Slug hoặc SKU này đã tồn tại và đang hoạt động");
    } else {
      // Xóa vĩnh viễn bản ghi cũ đã bị xóa mềm để tạo mới
      await conflictingProduct.destroy({ force: true });
    }
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Tạo sản phẩm chính
    const product = await models.products.create(mainData, { transaction });

    // 2. Tạo ảnh sản phẩm (nếu có)
    if (images && images.length > 0) {
      const imageData = images.map(img => ({
        ...img,
        productId: product.productId
      }));
      await models.product_images.bulkCreate(imageData, { transaction });
    }

    // 3. Tạo biến thể sản phẩm (nếu có)
    if (variants && variants.length > 0) {
      const variantData = variants.map(v => ({
        ...v,
        productId: product.productId
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
    mainData.slug = generateSlug(mainData.name, mainData.skuBase || product.skuBase);
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Cập nhật thông tin chính
    await product.update(mainData, { transaction });

    // 2. Cập nhật ảnh (Xóa cũ thêm mới - Cách đơn giản nhất)
    if (images) {
      await models.product_images.destroy({ where: { productId: id }, transaction });
      const imageData = images.map(img => ({ ...img, productId: id }));
      await models.product_images.bulkCreate(imageData, { transaction });
    }

    // 3. Cập nhật biến thể (Xóa cũ thêm mới)
    if (variants) {
      await models.product_variants.destroy({ where: { productId: id }, transaction });
      const variantData = variants.map(v => ({ ...v, productId: id }));
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
  
  // Giải phóng slug và skuBase để có thể dùng lại cho sản phẩm mới
  await product.update({ 
    slug: `${product.slug}-deleted-${Date.now()}`,
    skuBase: `${product.skuBase}-deleted-${Date.now()}`
  });

  // Use soft delete (paranoid: true)
  await product.destroy(); 
  return true;
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
