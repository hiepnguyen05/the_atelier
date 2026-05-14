# Hướng dẫn Kiểm thử dành cho AI Agent - The Atelier Backend

Tài liệu này cung cấp các tiêu chuẩn và hướng dẫn để thực hiện kiểm thử (Testing) cho hệ thống Backend của dự án The Atelier.

## 1. Công nghệ sử dụng
- **Framework**: [Jest](https://jestjs.io/)
- **HTTP Testing**: [Supertest](https://github.com/ladjs/supertest)
- **Data Mocking**: Sử dụng `jest.mock()` cho tầng Service và các hàm random cơ bản.

## 2. Cấu trúc thư mục
```text
backend/
├── src/
│   ├── app.js          # Express app instance (Dùng để test)
│   └── services/       # Business logic (Cần được Mock khi Unit Test)
├── tests/
│   └── category.test.js # File test cho từng module
└── index.js            # Server entry point (Không dùng để test)
```

## 3. Các kịch bản kiểm thử tiêu chuẩn (Standard Scenarios)

Mọi module API mới cần phải đáp ứng 7 kịch bản kiểm thử sau:

| Kịch bản | Mô tả |
| :--- | :--- |
| **Basic API Tests** | Kiểm tra mã trạng thái (200, 201), Content-Type (JSON), cấu trúc Response. |
| **CRUD Tests** | Kiểm tra luồng dữ liệu trọn vẹn: Tạo mới -> Đọc -> Cập nhật -> Xóa. |
| **Negative Tests** | Kiểm tra các trường hợp lỗi: ID không tồn tại (404), Lỗi Database (500). |
| **Dynamic Data** | Sử dụng dữ liệu ngẫu nhiên (Random String/Number) để tránh fix cứng giá trị. |
| **Business Logic** | Kiểm tra các quy tắc nghiệp vụ đặc thù (VD: Không cho xóa nếu có ràng buộc). |
| **Performance** | Đảm bảo thời gian phản hồi (Response Time) dưới ngưỡng cho phép (thường là 200ms). |
| **Boundary Tests** | Kiểm tra dữ liệu biên: Tên quá dài (255+ ký tự), ký tự đặc biệt, chuỗi rỗng. |

## 4. Hướng dẫn dành cho AI Agent

### 4.1. Nguyên tắc Mocking
AI Agent **PHẢI** thực hiện mock tầng Service thay vì truy vấn trực tiếp vào Database thật để đảm bảo:
- Tốc độ thực thi nhanh.
- Không làm bẩn dữ liệu thực tế.
- Tránh phụ thuộc vào môi trường Database.

```javascript
// Ví dụ Mocking
jest.mock("../src/services/yourService");
```

### 4.2. Khởi tạo môi trường Test
Luôn yêu cầu file `app.js` để thực hiện test:
```javascript
const request = require("supertest");
const app = require("../src/app");
```

### 4.3. Các câu lệnh thực thi
- Chạy toàn bộ test: `npm test`
- Chạy test một lần: `npm test -- --watchAll=false`
- Chạy test kèm theo báo cáo độ bao phủ (Coverage): `npx jest --coverage`

## 5. Quy trình thêm Test mới
1. Xác định Controller và Service cần test.
2. Tạo file `.test.js` trong thư mục `tests/`.
3. Định nghĩa các kịch bản dựa trên 7 tiêu chuẩn ở mục 3.
4. Chạy lệnh `npm test` để xác nhận kết quả.

---
*Tài liệu này được tạo tự động bởi AI Agent để hỗ trợ quá trình phát triển bền vững.*
