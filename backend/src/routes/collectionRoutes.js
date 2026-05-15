const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");

router.get("/", collectionController.getAllCollections);
router.get("/:slug", collectionController.getCollectionBySlug);
router.post("/", collectionController.createCollection);
router.put("/:id", collectionController.updateCollection);
router.delete("/:id", collectionController.deleteCollection);

module.exports = router;
