const express = require("express");
const router = express.Router();
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const collectionRoutes = require("./collectionRoutes");
const uploadRoutes = require("./uploadRoutes");
const brandRoutes = require("./brandRoutes");
const authRoutes = require("./authRoutes");

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/collections", collectionRoutes);
router.use("/brands", brandRoutes);
router.use("/upload", uploadRoutes);
router.use("/auth", authRoutes);

module.exports = router;
