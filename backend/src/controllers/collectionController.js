const collectionService = require("../services/collectionService");
const asyncHandler = require("../utils/asyncHandler");

const getAllCollections = asyncHandler(async (req, res) => {
  const result = await collectionService.getAllCollections(req.query);
  res.json(result);
});

const getCollectionBySlug = asyncHandler(async (req, res) => {
  const collection = await collectionService.getCollectionBySlug(req.params.slug);
  if (!collection) {
    return res.status(404).json({ message: "Không tìm thấy bộ sưu tập này." });
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
    return res.status(404).json({ message: "Không tìm thấy bộ sưu tập để cập nhật." });
  }
  res.json(collection);
});

const deleteCollection = asyncHandler(async (req, res) => {
  try {
    const success = await collectionService.deleteCollection(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Không tìm thấy bộ sưu tập." });
    }
    res.json({ message: "Đã xóa bộ sưu tập thành công." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  getAllCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
};
