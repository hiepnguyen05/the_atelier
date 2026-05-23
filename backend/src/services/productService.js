const { models, sequelize } = require("../config/db");
const { Op } = require("sequelize");
const { generateSlug, generateSKU } = require("../utils/slugifyUtils");
const { deleteImage, extractPublicId } = require("../utils/cloudinaryUtils");

/**
 * Lấy danh sách sản phẩm với bộ lọc và phân trang
 */
const getProducts = async (query) => {
  const {
    page = 1,
    limit = 10,
    categoryId,
    productType,
    gender,
    brandId,
    status,
    search,
    sort = "newest",
  } = query;

  const offset = (page - 1) * limit;
  const whereClause = {};

  if (status && status !== "all") {
    whereClause.status = status;
  } else if (!status) {
    whereClause.status = "active";
  }

  if (categoryId) {
    whereClause.productId = {
      [Op.in]: sequelize.literal(`(SELECT product_id FROM product_categories WHERE category_id = ${parseInt(categoryId)})`)
    };
  }
  if (productType) whereClause.productType = productType;
  if (gender) whereClause.gender = gender;
  if (brandId) whereClause.brandId = brandId;

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { skuBase: { [Op.like]: `%${search}%` } },
    ];
  }

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
      { model: models.categories, as: "category", attributes: ["categoryId", "name", "slug"] },
      { model: models.categories, as: "categories", attributes: ["categoryId", "name", "slug"], through: { attributes: [] } },
      { model: models.brands, as: "brand", attributes: ["brandId", "name"] },
    ],
    order,
    distinct: true,
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    products: rows,
  };
};

/**
 * Lấy chi tiết sản phẩm theo slug
 */
const getProductBySlug = async (slug) => {
  return await models.products.findOne({
    where: { slug, status: "active" },
    include: [
      { model: models.product_images, as: "productImages" },
      { model: models.product_variants, as: "productVariants" },
      { model: models.categories, as: "category" },
      { model: models.categories, as: "categories", through: { attributes: [] } },
      { model: models.brands, as: "brand" },
    ],
  });
};

/**
 * Tạo sản phẩm mới kèm ảnh và biến thể
 */
const createProduct = async (productData) => {
  const { images, variants, categoryIds, ...mainData } = productData;

  // Set primary category_id for backwards compatibility
  if (categoryIds && categoryIds.length > 0) {
    mainData.categoryId = categoryIds[0];
  }

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

    // 2. Tạo ảnh sản phẩm
    if (images && images.length > 0) {
      const imageData = images.map((img) => ({ ...img, productId: product.productId }));
      await models.product_images.bulkCreate(imageData, { transaction });
    }

    // 3. Tạo biến thể sản phẩm
    if (variants && variants.length > 0) {
      const variantData = variants.map((v) => ({ ...v, productId: product.productId }));
      await models.product_variants.bulkCreate(variantData, { transaction });
    }

    // 4. Save category relations
    if (categoryIds && categoryIds.length > 0) {
      await product.setCategories(categoryIds, { transaction });
    }

    await transaction.commit();
    return await getProductBySlug(product.slug);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Cập nhật sản phẩm kèm ảnh và biến thể
 */
const updateProduct = async (id, productData) => {
  const product = await models.products.findByPk(id);
  if (!product) return null;

  const { images, variants, categoryIds, ...mainData } = productData;

  if (categoryIds !== undefined) {
    mainData.categoryId = (categoryIds && categoryIds.length > 0) ? categoryIds[0] : null;
  }

  if (mainData.name && (!mainData.slug || mainData.slug.trim() === "")) {
    mainData.slug = generateSlug(mainData.name, mainData.skuBase || product.skuBase);
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Cập nhật thông tin chính
    await product.update(mainData, { transaction });

    // 2. Cập nhật ảnh
    let imagesToDelete = [];
    if (images) {
      const oldImages = await models.product_images.findAll({
        where: { productId: id },
        transaction,
      });
      const newUrls = new Set(images.map((img) => img.imageUrl));
      imagesToDelete = oldImages.filter((oldImg) => !newUrls.has(oldImg.imageUrl));

      await models.product_images.destroy({ where: { productId: id }, transaction });
      const imageData = images.map((img) => {
        const { imageId, createdAt, updatedAt, deletedAt, ...cleanImg } = img;
        return { ...cleanImg, productId: id };
      });
      await models.product_images.bulkCreate(imageData, { transaction });
    }

    // 3. Cập nhật biến thể
    if (variants) {
      const existingVariants = await models.product_variants.findAll({
        where: { productId: id },
        paranoid: false,
        transaction,
      });

      const existingById = new Map();
      const existingBySku = new Map();
      existingVariants.forEach((ev) => {
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
          if (matchedVariant.deletedAt) {
            await matchedVariant.restore({ transaction });
          }
          await matchedVariant.update(cleanVariant, { transaction });
          activeVariantIds.add(matchedVariant.variantId);
        } else {
          const newVar = await models.product_variants.create(
            { ...cleanVariant, productId: id },
            { transaction }
          );
          activeVariantIds.add(newVar.variantId);
        }
      }

      // Xóa mềm biến thể không còn trong danh sách
      for (const ev of existingVariants) {
        if (!ev.deletedAt && !activeVariantIds.has(ev.variantId)) {
          await ev.destroy({ transaction });
        }
      }
    }

    // Update category relations
    if (categoryIds !== undefined) {
      await product.setCategories(categoryIds || [], { transaction });
    }

    await transaction.commit();

    // Xóa ảnh trên Cloudinary sau khi commit thành công
    if (imagesToDelete.length > 0) {
      for (const deletedImg of imagesToDelete) {
        const publicId = extractPublicId(deletedImg.imageUrl);
        if (publicId) {
          try {
            await deleteImage(publicId);
          } catch (err) {
            console.error("Lỗi xóa ảnh cũ từ Cloudinary:", err);
          }
        }
      }
    }

    return await getProductBySlug(product.slug);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Xóa mềm sản phẩm
 */
const deleteProduct = async (id) => {
  const product = await models.products.findByPk(id);
  if (!product) return false;

  // Giải phóng slug và skuBase để có thể dùng lại
  await product.update({
    slug: `${product.slug}-deleted-${Date.now()}`,
    skuBase: `${product.skuBase}-deleted-${Date.now()}`,
  });

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
