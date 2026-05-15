const collectionService = require("../services/collectionService");
const asyncHandler = require("../utils/asyncHandler");

const getAllCollections = asyncHandler(async (req, res) => {
  const collections = await collectionService.getAllCollections();
  res.json(collections);
});

const getCollectionBySlug = asyncHandler(async (req, res) => {
  const collection = await collectionService.getCollectionBySlug(req.params.slug);
  if (!collection) {
    return res.status(404).json({ message: "Collection not found" });
  }
  res.json(collection);
});

const createCollection = asyncHandler(async (req, res) => {
  const collection = await collectionService.createCollection(req.body);
  res.status(201).json(collection);
});

const updateCollection = asyncHandler(async (req, res) => {
  const collection = await collectionService.updateCollection(req.params.id, req.body);
  if (!collection) {
    return res.status(404).json({ message: "Collection not found" });
  }
  res.json(collection);
});

const deleteCollection = asyncHandler(async (req, res) => {
  const success = await collectionService.deleteCollection(req.params.id);
  if (!success) {
    return res.status(404).json({ message: "Collection not found" });
  }
  res.json({ message: "Collection deleted successfully" });
});

module.exports = {
  getAllCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
};
