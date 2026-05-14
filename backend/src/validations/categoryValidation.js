const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Tên danh mục không được để trống",
    "string.min": "Tên danh mục phải có ít nhất 2 ký tự",
    "any.required": "Tên danh mục là bắt buộc",
  }),
  parent_id: Joi.number().integer().allow(null),
  slug: Joi.string().max(150).allow(null, ""),
  description: Joi.string().max(500).allow(null, ""),
});

module.exports = {
  categorySchema,
};
