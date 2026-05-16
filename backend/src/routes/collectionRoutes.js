const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");
const validate = require("../middlewares/validate");
const { collectionSchema } = require("../validations/collectionValidation");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", collectionController.getAllCollections);
router.get("/:slug", collectionController.getCollectionBySlug);

// Admin only routes
router.post("/", protect, authorize('admin'), validate(collectionSchema), collectionController.createCollection);
router.put("/:id", protect, authorize('admin'), validate(collectionSchema), collectionController.updateCollection);
router.delete("/:id", protect, authorize('admin'), collectionController.deleteCollection);

module.exports = router;
