const collectionService = require("../services/collectionService");
const asyncHandler = require("../utils/asyncHandler");

const getAllCollections = asyncHandler(async (req, res) => {
  const collections = await collectionService.getAllCollections();
  res.json(collections);
});

module.exports = {
  getAllCollections,
};
