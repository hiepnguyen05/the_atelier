var DataTypes = require("sequelize").DataTypes;
var _addresses = require("./addresses");
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

  orders.belongsTo(addresses, { as: "shipping_address", foreignKey: "shipping_address_id"});
  addresses.hasMany(orders, { as: "orders", foreignKey: "shipping_address_id"});
  cart_items.belongsTo(cart, { as: "cart", foreignKey: "cart_id"});
  cart.hasMany(cart_items, { as: "cart_items", foreignKey: "cart_id"});
  categories.belongsTo(categories, { as: "parent", foreignKey: "parent_id"});
  categories.hasMany(categories, { as: "categories", foreignKey: "parent_id"});
  products.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(products, { as: "products", foreignKey: "category_id"});
  products.belongsTo(collections, { as: "collection", foreignKey: "collection_id"});
  collections.hasMany(products, { as: "products", foreignKey: "collection_id"});
  orders.belongsTo(coupons, { as: "coupon", foreignKey: "coupon_id"});
  coupons.hasMany(orders, { as: "orders", foreignKey: "coupon_id"});
  order_items.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(order_items, { as: "order_items", foreignKey: "order_id"});
  payments.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasOne(payments, { as: "payment", foreignKey: "order_id"});
  cart_items.belongsTo(product_variants, { as: "variant", foreignKey: "variant_id"});
  product_variants.hasMany(cart_items, { as: "cart_items", foreignKey: "variant_id"});
  order_items.belongsTo(product_variants, { as: "variant", foreignKey: "variant_id"});
  product_variants.hasMany(order_items, { as: "order_items", foreignKey: "variant_id"});
  product_images.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_images, { as: "product_images", foreignKey: "product_id"});
  product_variants.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_variants, { as: "product_variants", foreignKey: "product_id"});
  reviews.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(reviews, { as: "reviews", foreignKey: "product_id"});
  wishlists.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(wishlists, { as: "wishlists", foreignKey: "product_id"});
  review_images.belongsTo(reviews, { as: "review", foreignKey: "review_id"});
  reviews.hasMany(review_images, { as: "review_images", foreignKey: "review_id"});
  users.belongsTo(roles, { as: "role", foreignKey: "role_id"});
  roles.hasMany(users, { as: "users", foreignKey: "role_id"});
  addresses.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(addresses, { as: "addresses", foreignKey: "user_id"});
  blog_posts.belongsTo(users, { as: "author", foreignKey: "author_id"});
  users.hasMany(blog_posts, { as: "blog_posts", foreignKey: "author_id"});
  cart.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasOne(cart, { as: "cart", foreignKey: "user_id"});
  orders.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(orders, { as: "orders", foreignKey: "user_id"});
  reviews.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(reviews, { as: "reviews", foreignKey: "user_id"});
  wishlists.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(wishlists, { as: "wishlists", foreignKey: "user_id"});

  return {
    addresses,
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
