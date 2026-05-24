const Joi = require("joi");

const PRODUCT_TYPES = ['clothing_top', 'clothing_bottom', 'shoes', 'slippers', 'eyewear', 'bag', 'perfume'];
const GENDERS = ['nam', 'nu', 'unisex'];

const productSchema = Joi.object({
  productId: Joi.number().integer().optional(),
  name: Joi.string().min(2).max(200).required(),
  categoryId: Joi.number().integer().allow(null, "").empty(""),
  categoryIds: Joi.array().items(Joi.number().integer()).optional(),
  productType: Joi.string().valid(...PRODUCT_TYPES).default("clothing_top"),
  gender: Joi.string().valid(...GENDERS).default("unisex"),
  brandId: Joi.number().integer().allow(null, "").empty(""),
  basePrice: Joi.number().min(0).required(),
  skuBase: Joi.string().max(50).required(),
  stock: Joi.number().integer().min(0).default(0),
  description: Joi.string().allow(null, ""),
  material: Joi.string().max(100).allow(null, ""),
  careInstructions: Joi.string().allow(null, ""),
  status: Joi.string().valid("active", "inactive", "archived").default("active"),
  slug: Joi.string().max(255).allow(null, ""),
  specifications: Joi.any().optional(),

  // Cho phép các trường meta (tránh lỗi khi cập nhật)
  createdAt: Joi.any().optional(),
  updatedAt: Joi.any().optional(),
  deletedAt: Joi.any().optional(),
  category: Joi.any().optional(),
  brand: Joi.any().optional(),
  productImages: Joi.any().optional(),
  productVariants: Joi.any().optional(),

  // Mảng ảnh
  images: Joi.array()
    .items(
      Joi.object({
        imageId: Joi.number().optional(),
        productId: Joi.number().optional(),
        imageUrl: Joi.string().uri().required(),
        isPrimary: Joi.boolean().default(false),
        isHover: Joi.boolean().default(false),
        createdAt: Joi.any().optional(),
        updatedAt: Joi.any().optional(),
        deletedAt: Joi.any().optional(),
      })
    )
    .optional(),

  // Mảng biến thể
  variants: Joi.array()
    .items(
      Joi.object({
        variantId: Joi.number().optional(),
        productId: Joi.number().optional(),
        skuVariant: Joi.string().required(),
        sizeName: Joi.string().allow(null, ""),
        colorName: Joi.string().allow(null, ""),
        colorCode: Joi.string().allow(null, ""),
        stockQuantity: Joi.number().integer().min(0).default(0),
        priceAdjustment: Joi.number().default(0),
        createdAt: Joi.any().optional(),
        updatedAt: Joi.any().optional(),
        deletedAt: Joi.any().optional(),
      })
    )
    .optional(),
}).options({ allowUnknown: true });

const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  categoryId: Joi.number().integer().allow(null, ""),
  productType: Joi.string().valid(...PRODUCT_TYPES, "").allow(null, ""),
  gender: Joi.string().valid(...GENDERS, "").allow(null, ""),
  brandId: Joi.number().integer().allow(null, ""),
  status: Joi.string().valid("active", "inactive", "archived", "all").allow(null, ""),
  search: Joi.string().max(100).allow(null, ""),
  sort: Joi.string().valid("newest", "oldest", "price_asc", "price_desc", "name_asc").default("newest"),
}).options({ allowUnknown: true });

module.exports = {
  productSchema,
  productQuerySchema,
};
