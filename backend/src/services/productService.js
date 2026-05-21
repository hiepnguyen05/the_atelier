const { models, sequelize } = require("../config/db");
const { Op } = require("sequelize");
const { generateSlug, generateSKU } = require("../utils/slugifyUtils");

const getProducts = async (query) => {
  const { 
    page = 1, 
    limit = 10, 
    categoryId, 
    collectionId, 
    brandId, 
    status, 
    search,
    sort = "newest"
  } = query;
  
  const offset = (page - 1) * limit;

  const whereClause = {};
  
  if (status && status !== "all") {
    whereClause.status = status;
  } else if (!status) {
    whereClause.status = "active";
  }

  if (collectionId) whereClause.collectionId = collectionId;
  if (brandId) whereClause.brandId = brandId;
  
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { skuBase: { [Op.like]: `%${search}%` } }
    ];
  }

  // Lọc theo danh mục bằng subquery để đảm bảo tính chính xác với many-to-many
  if (categoryId && categoryId !== "") {
    whereClause.productId = {
      [Op.in]: sequelize.literal(`(
        SELECT product_id FROM product_categories 
        WHERE category_id = ${parseInt(categoryId)} 
      )`)
    };
  }

  // Include categories để hiển thị thông tin
  const categoryInclude = { 
    model: models.categories, 
    as: "categories", 
    attributes: ["categoryId", "name"],
    through: { attributes: [] } // Không lấy dữ liệu bảng trung gian
  };

  // Cấu hình sắp xếp
  let order = [["productId", "DESC"]];
  if (sort === "price_asc") order = [["basePrice", "ASC"]];
  if (sort === "price_desc") order = [["basePrice", "DESC"]];
  if (sort === "name_asc") order = [["name", "ASC"]];
  if (sort === "oldest") order = [["productId", "ASC"]];

  const { count, rows } = await models.products.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [
      { model: models.product_images, as: "productImages" },
      { model: models.product_variants, as: "productVariants" },
      categoryInclude,
      { model: models.brands, as: "brand", attributes: ["name"] }
    ],
    order: order,
    distinct: true
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
      { model: models.categories, as: "categories" },
      { model: models.collections, as: "collection" },
      { model: models.brands, as: "brand" }
    ],
  });
  return product;
};

/**
 * Tạo sản phẩm hoàn chỉnh kèm Ảnh, Biến thể và Nhiều danh mục
 */
const createProduct = async (productData) => {
  const { images, variants, categoryIds, ...mainData } = productData;

  // Tự động tạo SKU nếu chưa có
  if (!mainData.skuBase || mainData.skuBase.trim() === "") {
    mainData.skuBase = generateSKU("GEN");
  }

  // Tự động tạo slug
  if (!mainData.slug || mainData.slug.trim() === "") {
    mainData.slug = generateSlug(mainData.name, mainData.skuBase);
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Tạo sản phẩm chính
    const product = await models.products.create(mainData, { transaction });

    // 2. Gắn các danh mục
    if (categoryIds && categoryIds.length > 0) {
      await product.setCategories(categoryIds, { transaction });
    }

    // 3. Tạo ảnh sản phẩm
    if (images && images.length > 0) {
      const imageData = images.map(img => ({ ...img, productId: product.productId }));
      await models.product_images.bulkCreate(imageData, { transaction });
    }

    // 4. Tạo biến thể sản phẩm
    if (variants && variants.length > 0) {
      const variantData = variants.map(v => ({ ...v, productId: product.productId }));
      await models.product_variants.bulkCreate(variantData, { transaction });
    }

    await transaction.commit();
    return await getProductBySlug(product.slug);

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateProduct = async (id, productData) => {
  const product = await models.products.findByPk(id);
  if (!product) return null;

  const { images, variants, categoryIds, ...mainData } = productData;

  if (mainData.name && (!mainData.slug || mainData.slug.trim() === "")) {
    mainData.slug = generateSlug(mainData.name, mainData.skuBase || product.skuBase);
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Cập nhật thông tin chính
    await product.update(mainData, { transaction });

    // 2. Cập nhật danh mục
    if (categoryIds) {
      await product.setCategories(categoryIds, { transaction });
    }

    // 3. Cập nhật ảnh
    if (images) {
      await models.product_images.destroy({ where: { productId: id }, transaction });
      const imageData = images.map(img => {
        const { imageId, createdAt, updatedAt, deletedAt, ...cleanImg } = img;
        return { ...cleanImg, productId: id };
      });
      await models.product_images.bulkCreate(imageData, { transaction });
    }

    // 4. Cập nhật biến thể
    if (variants) {
      // Lấy tất cả biến thể hiện tại của sản phẩm (bao gồm cả các bản ghi đã xóa mềm)
      const existingVariants = await models.product_variants.findAll({
        where: { productId: id },
        paranoid: false,
        transaction
      });

      // Tạo map để tra cứu nhanh bản ghi cũ
      const existingById = new Map();
      const existingBySku = new Map();
      existingVariants.forEach(ev => {
        if (ev.variantId) existingById.set(ev.variantId, ev);
        if (ev.skuVariant) existingBySku.set(ev.skuVariant, ev);
      });

      const activeVariantIds = new Set();

      for (const v of variants) {
        const { variantId, createdAt, updatedAt, deletedAt, ...cleanVariant } = v;
        
        let matchedVariant = null;
        if (variantId && existingById.has(variantId)) {
          matchedVariant = existingById.get(variantId);
        } else if (cleanVariant.skuVariant && existingBySku.has(cleanVariant.skuVariant)) {
          matchedVariant = existingBySku.get(cleanVariant.skuVariant);
        }

        if (matchedVariant) {
          // Khôi phục nếu đang bị xóa mềm
          if (matchedVariant.deletedAt) {
            await matchedVariant.restore({ transaction });
          }
          // Cập nhật thông tin mới
          await matchedVariant.update(cleanVariant, { transaction });
          activeVariantIds.add(matchedVariant.variantId);
        } else {
          // Tạo mới hoàn toàn
          const newVar = await models.product_variants.create({
            ...cleanVariant,
            productId: id
          }, { transaction });
          activeVariantIds.add(newVar.variantId);
        }
      }

      // Xóa mềm các biến thể trước đây của sản phẩm nhưng không có trong danh sách gửi lên
      for (const ev of existingVariants) {
        if (!ev.deletedAt && !activeVariantIds.has(ev.variantId)) {
          await ev.destroy({ transaction });
        }
      }
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
