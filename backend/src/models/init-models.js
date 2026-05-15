var DataTypes = require("sequelize").DataTypes;
var _addresses = require("./addresses");
var _brands = require("./brands");
var _blog_posts = require("./blog_posts");
var _cart = require("./cart");
var _cart_items = require("./cart_items");
var _categories = require("./categories");
var _collections = require("./collections");
var _coupons = require("./coupons");
var _order_items = require("./order_items");
var _orders = require("./orders");
var _payments = require("./payments");
var _product_images = require("./product_images");
var _product_variants = require("./product_variants");
var _products = require("./products");
var _review_images = require("./review_images");
var _reviews = require("./reviews");
var _roles = require("./roles");
var _users = require("./users");
var _wishlists = require("./wishlists");

function initModels(sequelize) {
  var addresses = _addresses(sequelize, DataTypes);
  var brands = _brands(sequelize, DataTypes);
  var blog_posts = _blog_posts(sequelize, DataTypes);
  var cart = _cart(sequelize, DataTypes);
  var cart_items = _cart_items(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var collections = _collections(sequelize, DataTypes);
  var coupons = _coupons(sequelize, DataTypes);
  var order_items = _order_items(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var payments = _payments(sequelize, DataTypes);
  var product_images = _product_images(sequelize, DataTypes);
  var product_variants = _product_variants(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var review_images = _review_images(sequelize, DataTypes);
  var reviews = _reviews(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var wishlists = _wishlists(sequelize, DataTypes);

  orders.belongsTo(addresses, { as: "shippingAddress", foreignKey: "shippingAddressId"});
  addresses.hasMany(orders, { as: "orders", foreignKey: "shippingAddressId"});
  cart_items.belongsTo(cart, { as: "cart", foreignKey: "cartId"});
  cart.hasMany(cart_items, { as: "cartItems", foreignKey: "cartId"});
  categories.belongsTo(categories, { as: "parent", foreignKey: "parentId"});
  categories.hasMany(categories, { as: "subCategories", foreignKey: "parentId"});
  products.belongsTo(categories, { as: "category", foreignKey: "categoryId"});
  categories.hasMany(products, { as: "products", foreignKey: "categoryId"});
  products.belongsTo(collections, { as: "collection", foreignKey: "collectionId"});
  collections.hasMany(products, { as: "products", foreignKey: "collectionId"});
  products.belongsTo(brands, { as: "brand", foreignKey: "brandId"});
  brands.hasMany(products, { as: "products", foreignKey: "brandId"});
  orders.belongsTo(coupons, { as: "coupon", foreignKey: "couponId"});
  coupons.hasMany(orders, { as: "orders", foreignKey: "couponId"});
  order_items.belongsTo(orders, { as: "order", foreignKey: "orderId"});
  orders.hasMany(order_items, { as: "orderItems", foreignKey: "orderId"});
  payments.belongsTo(orders, { as: "order", foreignKey: "orderId"});
  orders.hasOne(payments, { as: "payment", foreignKey: "orderId"});
  cart_items.belongsTo(product_variants, { as: "variant", foreignKey: "variantId"});
  product_variants.hasMany(cart_items, { as: "cartItems", foreignKey: "variantId"});
  order_items.belongsTo(product_variants, { as: "variant", foreignKey: "variantId"});
  product_variants.hasMany(order_items, { as: "orderItems", foreignKey: "variantId"});
  product_images.belongsTo(products, { as: "product", foreignKey: "productId"});
  products.hasMany(product_images, { as: "productImages", foreignKey: "productId"});
  product_variants.belongsTo(products, { as: "product", foreignKey: "productId"});
  products.hasMany(product_variants, { as: "productVariants", foreignKey: "productId"});
  reviews.belongsTo(products, { as: "product", foreignKey: "productId"});
  products.hasMany(reviews, { as: "reviews", foreignKey: "productId"});
  wishlists.belongsTo(products, { as: "product", foreignKey: "productId"});
  products.hasMany(wishlists, { as: "wishlists", foreignKey: "productId"});
  review_images.belongsTo(reviews, { as: "review", foreignKey: "reviewId"});
  reviews.hasMany(review_images, { as: "reviewImages", foreignKey: "reviewId"});
  users.belongsTo(roles, { as: "role", foreignKey: "roleId"});
  roles.hasMany(users, { as: "users", foreignKey: "roleId"});
  addresses.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(addresses, { as: "addresses", foreignKey: "userId"});
  blog_posts.belongsTo(users, { as: "author", foreignKey: "authorId"});
  users.hasMany(blog_posts, { as: "blogPosts", foreignKey: "authorId"});
  cart.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasOne(cart, { as: "cart", foreignKey: "userId"});
  orders.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(orders, { as: "orders", foreignKey: "userId"});
  reviews.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(reviews, { as: "reviews", foreignKey: "userId"});
  wishlists.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(wishlists, { as: "wishlists", foreignKey: "userId"});

  return {
    addresses,
    brands,
    blog_posts,
    cart,
    cart_items,
    categories,
    collections,
    coupons,
    order_items,
    orders,
    payments,
    product_images,
    product_variants,
    products,
    review_images,
    reviews,
    roles,
    users,
    wishlists,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
