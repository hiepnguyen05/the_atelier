const db = require("../config/db");
const { NotFoundError, BadRequestError } = require("../utils/errors");

const getAllBrands = async () => {
  const models = db.models;
  if (!models || !models.brands) {
    throw new BadRequestError("Model 'brands' is not initialized correctly");
  }
  return await models.brands.findAll({
    order: [["name", "ASC"]]
  });
};

const createBrand = async (data) => {
  const models = db.models;
  return await models.brands.create(data);
};

module.exports = {
  getAllBrands,
  createBrand
};
