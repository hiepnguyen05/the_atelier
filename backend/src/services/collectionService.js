const { models } = require("../config/db");

const getAllCollections = async () => {
  return await models.collections.findAll();
};

module.exports = {
  getAllCollections,
};
