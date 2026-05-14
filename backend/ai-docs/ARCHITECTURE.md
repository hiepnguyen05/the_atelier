# System Architecture

## 1. Folder Structure
- `src/config/`: Cấu hình Database, Cloudinary, Env.
- `src/models/`: Định nghĩa thực thể database (Sequelize).
- `src/services/`: **Tầng quan trọng nhất**. Chứa toàn bộ Business Logic và truy vấn Database.
- `src/controllers/`: Nhận request, gọi Service và trả về JSON.
- `src/routes/`: Định nghĩa Endpoint API.
- `src/middlewares/`: Chứa các hàm trung gian (Auth, Error Handler).
- `src/utils/`: Các hàm tiện ích (Cloudinary utils, asyncHandler).
- `tests/`: Chứa các file Unit Test.

## 2. Request Lifecycle
1. Client gửi request tới `index.js` -> `src/app.js`.
2. Request đi qua `src/routes/index.js` để tìm route tương ứng.
3. Controller nhận request, sử dụng `asyncHandler` để bọc logic.
4. Controller gọi hàm tương ứng trong tầng Service.
5. Service tương tác với Model và trả về dữ liệu.
6. Controller trả về kết quả cho Client.
7. Nếu có lỗi ở bất kỳ bước nào, `errorHandler` middleware sẽ bắt và xử lý tập trung.

## 3. Communication Pattern
Dự án sử dụng chuẩn RESTful API, trả về dữ liệu dưới định dạng JSON.
