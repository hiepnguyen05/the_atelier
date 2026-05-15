const Joi = require("joi");

const collectionSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  slug: Joi.string().max(255).allow(null, ""),
  tagline: Joi.string().max(255).allow(null, ""),
  description: Joi.string().allow(null, ""),
  season: Joi.string().valid('Spring/Summer', 'Fall/Winter', 'Resort', 'Pre-Fall', 'Special Edition').allow(null),
  year: Joi.number().integer().min(2000).max(2100).allow(null),
  heroImageUrl: Joi.string().uri().allow(null, ""),
  coverImageUrl: Joi.string().uri().allow(null, ""),
  footerImageUrl: Joi.string().uri().allow(null, ""),
  editorialContent: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('text', 'image', 'product_highlight').required(),
      content: Joi.string().when('type', { is: 'text', then: Joi.required() }),
      url: Joi.string().uri().when('type', { is: 'image', then: Joi.required() }),
      productId: Joi.number().integer().when('type', { is: 'product_highlight', then: Joi.required() }),
      layout: Joi.string().valid('full', 'half', 'sidebar').default('full')
    })
  ).allow(null),
  isFeatured: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true)
});

module.exports = {
  collectionSchema,
};
