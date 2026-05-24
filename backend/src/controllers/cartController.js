const cartService = require("../services/cartService");
const asyncHandler = require("../utils/asyncHandler");

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const cart = await cartService.getCart(userId);
  res.json(cart);
});

const addItemToCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { variantId, quantity } = req.body;
  const cart = await cartService.addItemToCart(userId, variantId, quantity);
  res.status(201).json(cart);
});

const updateItemQuantity = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const cartItemId = req.params.itemId;
  const { quantity } = req.body;
  const cart = await cartService.updateItemQuantity(userId, cartItemId, quantity);
  res.json(cart);
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const cartItemId = req.params.itemId;
  const cart = await cartService.removeItemFromCart(userId, cartItemId);
  res.json(cart);
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const cart = await cartService.clearCart(userId);
  res.json(cart);
});

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
};
