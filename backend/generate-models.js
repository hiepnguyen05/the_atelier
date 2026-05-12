require('dotenv').config();
const SequelizeAuto = require('sequelize-auto');
const fs = require('fs');
const path = require('path');

const auto = new SequelizeAuto(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    directory: './src/models',
    additional: {
        timestamps: false
    },
    dialectOptions: {
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true,
            // Nếu bạn đã copy file isrgrootx1.pem vào thư mục backend, hãy bỏ comment dòng dưới
            // ca: fs.readFileSync(path.resolve(__dirname, 'isrgrootx1.pem')).toString()
        }
    }
});

console.log('Đang kết nối và tạo model từ TiDB Cloud...');

auto.run().then(data => {
    console.log('Thành công! Các model đã được tạo trong thư mục ./src/models');
}).catch(err => {
    console.error('Lỗi khi tạo model:', err);
});
