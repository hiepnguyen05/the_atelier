require('dotenv').config({ path: './.env' });
const { sequelize } = require('../config/db');

async function run() {
  try {
    console.log("Bắt đầu chạy migration cho many-to-many categories...");

    // 1. Tạo bảng product_categories
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS product_categories (
        product_id INT NOT NULL,
        category_id INT NOT NULL,
        PRIMARY KEY (product_id, category_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("Đã tạo bảng product_categories (nếu chưa có).");

    // 2. Chuyển dữ liệu cũ từ products.category_id sang product_categories
    const [inserted] = await sequelize.query(`
      INSERT IGNORE INTO product_categories (product_id, category_id)
      SELECT product_id, category_id 
      FROM products 
      WHERE category_id IS NOT NULL;
    `);
    console.log("Đã di chuyển dữ liệu cũ thành công.");

    console.log("Migration many-to-many categories hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error("Migration thất bại:", error);
    process.exit(1);
  }
}

run();
