# Development Conventions

Để duy trì tính thống nhất, mọi AI Agent khi tham gia dự án cần tuân thủ các quy tắc sau:

## 1. Naming Conventions
- **Files**: `camelCase` (ví dụ: `productService.js`, `categoryController.js`).
- **Variables/Functions**: `camelCase`.
- **Database Tables/Columns**: `snake_case` (ví dụ: `product_id`, `created_at`).
- **Classes**: `PascalCase`.

## 2. API Design
- Sử dụng đúng HTTP Methods: `GET` (đọc), `POST` (tạo), `PUT` (cập nhật), `DELETE` (xóa).
- Response JSON Format:
  - Thành công: Trả về Object hoặc Array trực tiếp hoặc bọc trong một field có ý nghĩa.
  - Lỗi: Phải thông qua `next(error)` để `errorHandler` xử lý, trả về `{ status, message, stack }`.

## 3. Best Practices
- **Lean Controllers**: Không viết logic database trong Controller. Luôn đẩy vào Service.
- **Async/Await**: Sử dụng `async/await` kết hợp với `asyncHandler` để tránh callback hell và quên bắt lỗi.
- **Testing First**: Viết API mới đi kèm với Unit Test bao phủ ít nhất 7 kịch bản cơ bản (Xem `TESTING_GUIDE.md`).
- **Validation**: Mọi dữ liệu input từ `req.body` hoặc `req.query` cần được validate trước khi xử lý (Dùng Joi hoặc Zod là gợi ý tốt cho giai đoạn tới).

## 4. Documentation
Cập nhật `ai-docs/` khi có sự thay đổi lớn về cấu trúc hoặc thêm module mới quan trọng.
