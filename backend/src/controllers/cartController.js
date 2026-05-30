const cartService = require("../services/cartService");

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const addItemToCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { variantId, quantity } = req.body;
    const cart = await cartService.addItemToCart(userId, variantId, quantity);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

const updateItemQuantity = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cartItemId = req.params.itemId;
    const { quantity } = req.body;
    const cart = await cartService.updateItemQuantity(userId, cartItemId, quantity);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const removeItemFromCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cartItemId = req.params.itemId;
    const cart = await cartService.removeItemFromCart(userId, cartItemId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cart = await cartService.clearCart(userId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
};
