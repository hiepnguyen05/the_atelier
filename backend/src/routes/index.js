const express = require("express");
const router = express.Router();
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const uploadRoutes = require("./uploadRoutes");
const brandRoutes = require("./brandRoutes");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const cartRoutes = require("./cartRoutes");

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/upload", uploadRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);

module.exports = router;
