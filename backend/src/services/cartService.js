const { models, sequelize } = require("../config/db");

/**
 * Lấy giỏ hàng của user (nếu chưa có thì tạo mới)
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
    cart.cartItems = []; // Trả về dạng mảng rỗng để frontend dễ xử lý
  }

  return cart;
};

/**
 * Thêm sản phẩm vào giỏ hàng
 */
const addItemToCart = async (userId, variantId, quantity) => {
  // Lấy hoặc tạo giỏ hàng
  let cart = await models.cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await models.cart.create({ userId });
  }

  // Kiểm tra variant có tồn tại không
  const variant = await models.product_variants.findByPk(variantId);
  if (!variant) {
    throw new Error("Variant not found");
  }

  // Kiểm tra xem item đã có trong giỏ chưa
  const existingItem = await models.cart_items.findOne({
    where: { cartId: cart.cartId, variantId },
  });

  if (existingItem) {
    // Nếu có rồi thì tăng số lượng
    await existingItem.update({
      quantity: existingItem.quantity + quantity,
    });
  } else {
    // Nếu chưa có thì tạo mới
    await models.cart_items.create({
      cartId: cart.cartId,
      variantId,
      quantity,
    });
  }

  return await getCart(userId);
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ
 */
const updateItemQuantity = async (userId, cartItemId, quantity) => {
  const cart = await models.cart.findOne({ where: { userId } });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = await models.cart_items.findOne({
    where: { cartItemId, cartId: cart.cartId },
  });

  if (!cartItem) {
    throw new Error("Item not found in cart");
  }

  await cartItem.update({ quantity });

  return await getCart(userId);
};

/**
 * Xóa một sản phẩm khỏi giỏ hàng
 */
const removeItemFromCart = async (userId, cartItemId) => {
  const cart = await models.cart.findOne({ where: { userId } });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = await models.cart_items.findOne({
    where: { cartItemId, cartId: cart.cartId },
  });

  if (!cartItem) {
    throw new Error("Item not found in cart");
  }

  // Xóa cứng (force: true) hoặc xóa mềm (tùy vào logic hệ thống, nhưng giỏ hàng thường xóa luôn)
  await cartItem.destroy({ force: true });

  return await getCart(userId);
};

/**
 * Xóa toàn bộ giỏ hàng
 */
const clearCart = async (userId) => {
  const cart = await models.cart.findOne({ where: { userId } });
  if (!cart) {
    throw new Error("Cart not found");
  }

  await models.cart_items.destroy({
    where: { cartId: cart.cartId },
    force: true, // Xóa cứng các item
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
