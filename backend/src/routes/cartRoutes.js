const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const validate = require("../middlewares/validate");
const { addItemSchema, updateItemSchema } = require("../validations/cartValidation");
const { protect } = require("../middlewares/authMiddleware");

// All cart routes require authentication
router.use(protect);

router.get("/", cartController.getCart);
router.post("/items", validate(addItemSchema), cartController.addItemToCart);
router.put("/items/:itemId", validate(updateItemSchema), cartController.updateItemQuantity);
router.delete("/items/:itemId", cartController.removeItemFromCart);
router.delete("/", cartController.clearCart);

module.exports = router;
