const db = require("../config/db");

const getAllBrands = async () => {
  try {
    const models = db.models;
    if (!models || !models.brands) {
      console.log("Current models:", Object.keys(models || {}));
      throw new Error("Model 'brands' is not initialized correctly");
    }
    return await models.brands.findAll({
      order: [["name", "ASC"]]
    });
  } catch (error) {
    console.error("Error in getAllBrands:", error);
    throw error;
  }
};

const createBrand = async (data) => {
  try {
    const models = db.models;
    return await models.brands.create(data);
  } catch (error) {
    console.error("Error in createBrand:", error);
    throw error;
  }
};

module.exports = {
  getAllBrands,
  createBrand
};
