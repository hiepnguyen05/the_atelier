require("dotenv").config();
const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

// chuỗi kết nối đến TiDB cloud
const connection = new Sequelize(
  process.env.DB_URL,
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.join(__dirname, "isrgrootx1.pem")), // Đường dẫn đến file CA
      },
    },
  },
);

module.exports = connection;
