const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const validate = require("../middlewares/validate");
const { categorySchema } = require("../validations/categoryValidation");

router.get("/", categoryController.getAllCategories);
router.get("/:identifier", categoryController.getCategory);
router.post("/", validate(categorySchema), categoryController.createCategory);
router.put("/:id", validate(categorySchema), categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
