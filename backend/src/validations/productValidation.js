const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  category_id: Joi.number().integer().required(),
  collection_id: Joi.number().integer().allow(null),
  price_base: Joi.number().min(0).required(),
  discount_price: Joi.number().min(0).allow(null),
  sku_base: Joi.string().max(50).required(),
  description: Joi.string().allow(null, ""),
  material: Joi.string().max(100).allow(null, ""),
  care_instructions: Joi.string().allow(null, ""),
  status: Joi.string().valid("active", "inactive", "out_of_stock").default("active"),
  slug: Joi.string().max(255).allow(null, ""),
  
  // Thêm mảng ảnh
  images: Joi.array().items(
    Joi.object({
      image_url: Joi.string().uri().required(),
      is_thumbnail: Joi.boolean().default(false),
      order_index: Joi.number().integer().default(0)
    })
  ).optional(),

  // Thêm mảng biến thể
  variants: Joi.array().items(
    Joi.object({
      sku_variant: Joi.string().required(),
      size: Joi.string().allow(null, ""),
      color: Joi.string().allow(null, ""),
      stock: Joi.number().integer().min(0).default(0),
      price_modifier: Joi.number().default(0),
      status: Joi.string().valid("active", "inactive", "out_of_stock").default("active")
    })
  ).optional()
});

module.exports = {
  productSchema,
};
