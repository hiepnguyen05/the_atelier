const { models } = require("../config/db");
const { generateSlug } = require("../utils/slugifyUtils");

const getAllCollections = async () => {
  return await models.collections.findAll({
    where: { isActive: true },
    order: [['year', 'DESC'], ['createdAt', 'DESC']]
  });
};

const getCollectionBySlug = async (slug) => {
  return await models.collections.findOne({
    where: { slug },
    include: [
      {
        model: models.products,
        as: "products",
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
