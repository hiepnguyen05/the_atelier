require("dotenv").config();
const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const initModels = require("../models/init-models");

// chuỗi kết nối đến TiDB cloud
const sequelize = new Sequelize(
  process.env.DB_URL,
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.join(__dirname, "isrgrootx1.pem")), // Đường dẫn đến file CA
      },
    },
    logging: false, // Tắt log SQL để console sạch hơn
    define: {
      underscored: true, // Map camelCase properties to snake_case columns
      timestamps: true,  // Automatically add createdAt and updatedAt
      paranoid: true,    // Enable soft deletes (deletedAt)
    },
  },
);

// Khởi tạo các models và quan hệ
const models = initModels(sequelize);

module.exports = {
  sequelize,
  models,
};
