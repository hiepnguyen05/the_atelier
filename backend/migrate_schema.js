require('dotenv').config({ path: './.env' });
const { sequelize } = require('./src/config/db');

async function migrate() {
  try {
    console.log("Bắt đầu migration...");

    // 1. Xóa bảng product_categories (vì đã đổi sang 1-N products.category_id)
    await sequelize.query(`DROP TABLE IF EXISTS product_categories;`);
    console.log("Đã xóa bảng product_categories.");

    // 2. Rút FK từ products đến collections (nếu có)
    try {
      await sequelize.query(`ALTER TABLE products DROP FOREIGN KEY products_ibfk_3;`);
      console.log("Đã xóa FK collections trong products (ibfk_3).");
    } catch (e) {
      console.log("FK collections (ibfk_3) không tồn tại.");
    }
    
    try {
      await sequelize.query(`ALTER TABLE products DROP FOREIGN KEY fk_2;`);
      console.log("Đã xóa FK collections trong products (fk_2).");
    } catch (err) {}

    try {
      await sequelize.query(`ALTER TABLE products DROP FOREIGN KEY fk_18;`);
      console.log("Đã xóa FK collections trong products (fk_18).");
    } catch (err) {}

    // 3. Drop column collection_id in products
    try {
      await sequelize.query(`ALTER TABLE products DROP COLUMN collection_id;`);
      console.log("Đã xóa cột collection_id trong products.");
    } catch (e) {
      console.log("Cột collection_id không tồn tại hoặc đã xóa.");
    }

    // 4. Thêm product_type và gender
    try {
      await sequelize.query(`
        ALTER TABLE products 
        ADD COLUMN product_type ENUM('clothing_top', 'clothing_bottom', 'shoes', 'slippers', 'eyewear', 'bag', 'perfume') NOT NULL DEFAULT 'clothing_top',
        ADD COLUMN gender ENUM('nam', 'nu', 'unisex') NOT NULL DEFAULT 'unisex';
      `);
      console.log("Đã thêm product_type và gender vào products.");
    } catch (e) {
      console.log("Cột product_type/gender có thể đã tồn tại: ", e.message);
    }

    // 5. Xóa bảng collections
    await sequelize.query(`DROP TABLE IF EXISTS collections;`);
    console.log("Đã xóa bảng collections.");

    // 6. Xóa attribute_config trong categories
    try {
      await sequelize.query(`ALTER TABLE categories DROP COLUMN attribute_config;`);
      console.log("Đã xóa cột attribute_config trong categories.");
    } catch (e) {
      console.log("Cột attribute_config không tồn tại hoặc đã xóa.");
    }

    console.log("Migration hoàn tất thành công!");
    process.exit(0);
  } catch (error) {
    console.error("Migration thất bại:", error);
    process.exit(1);
  }
}

migrate();
