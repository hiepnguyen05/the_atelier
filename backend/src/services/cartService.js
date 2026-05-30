const { models, sequelize } = require("../config/db");
const { NotFoundError } = require("../utils/errors");

/**
 * Get user cart (create if not exists)
 */
const getCart = async (userId) => {
  let cart = await models.cart.findOne({
    where: { userId },
    include: [
      {
        model: models.cart_items,
        as: "cartItems",
        include: [
          {
            model: models.product_variants,
            as: "variant",
            include: [
              {
                model: models.products,
                as: "product",
                attributes: ["productId", "name", "slug", "basePrice", "status", "productType", "gender"],
                include: [
                  { model: models.product_images, as: "productImages" }
                ]
              }
            ]
          }
        ],
      },
    ],
  });

  if (!cart) {
    cart = await models.cart.create({ userId });
    cart.cartItems = []; // Return empty array for frontend convenience
  }

  return cart;
};

/**
 * Add an item to cart
 */
const addItemToCart = async (userId, variantId, quantity) => {
  // Get or create cart
  let cart = await models.cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await models.cart.create({ userId });
  }

  // Check if variant exists
  const variant = await models.product_variants.findByPk(variantId);
  if (!variant) {
    throw new NotFoundError("Variant not found");
  }

  // Check if item already exists in cart
  const existingItem = await models.cart_items.findOne({
    where: { cartId: cart.cartId, variantId },
  });

  if (existingItem) {
    // If exists, increase quantity
    await existingItem.update({
      quantity: existingItem.quantity + quantity,
    });
  } else {
    // If not, create new cart item
    await models.cart_items.create({
      cartId: cart.cartId,
      variantId,
      quantity,
    });
  }

  return await getCart(userId);
};

/**
 * Update item quantity in cart
 */
const updateItemQuantity = async (userId, cartItemId, quantity) => {
  const cart = await models.cart.findOne({ where: { userId } });
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const cartItem = await models.cart_items.findOne({
    where: { cartItemId, cartId: cart.cartId },
  });

  if (!cartItem) {
    throw new NotFoundError("Item not found in cart");
  }

  await cartItem.update({ quantity });

  return await getCart(userId);
};

/**
 * Remove an item from cart
 */
const removeItemFromCart = async (userId, cartItemId) => {
  const cart = await models.cart.findOne({ where: { userId } });
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const cartItem = await models.cart_items.findOne({
    where: { cartItemId, cartId: cart.cartId },
  });

  if (!cartItem) {
    throw new NotFoundError("Item not found in cart");
  }

  // Hard delete cart item
  await cartItem.destroy({ force: true });

  return await getCart(userId);
};

/**
 * Clear the entire cart
 */
const clearCart = async (userId) => {
  const cart = await models.cart.findOne({ where: { userId } });
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  // Hard delete all items in cart
  await models.cart_items.destroy({
    where: { cartId: cart.cartId },
    force: true,
  });

  return await getCart(userId);
};

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
};
