const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  categoryId: Joi.number().integer().required(),
  collectionId: Joi.number().integer().allow(null, "").empty(""),
  brandId: Joi.number().integer().allow(null, "").empty(""),
  basePrice: Joi.number().min(0).required(),
  skuBase: Joi.string().max(50).required(),
  stock: Joi.number().integer().min(0).default(0),
  description: Joi.string().allow(null, ""),
  material: Joi.string().max(100).allow(null, ""),
  careInstructions: Joi.string().allow(null, ""),
  status: Joi.string().valid("active", "inactive", "archived").default("active"),
  slug: Joi.string().max(255).allow(null, ""),
  
  // Thêm mảng ảnh
  images: Joi.array().items(
    Joi.object({
      imageUrl: Joi.string().uri().required(),
      isPrimary: Joi.boolean().default(false)
    })
  ).optional(),

  // Thêm mảng biến thể
  variants: Joi.array().items(
    Joi.object({
      skuVariant: Joi.string().required(),
      sizeName: Joi.string().allow(null, ""),
      colorName: Joi.string().allow(null, ""),
      colorCode: Joi.string().allow(null, ""),
      stockQuantity: Joi.number().integer().min(0).default(0),
      priceAdjustment: Joi.number().default(0)
    })
  ).optional()
});

module.exports = {
  productSchema,
};
