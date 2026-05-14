# Database Schema Overview

Dữ liệu được quản lý bởi Sequelize ORM. Dưới đây là các bảng quan trọng nhất trong hệ thống hiện tại.

## 1. Catalog Tables
- **`categories`**: Danh mục sản phẩm (Áo, Quần...). Hỗ trợ phân cấp cha-con (`parent_id`).
- **`collections`**: Bộ sưu tập thời trang.
- **`products`**: Thông tin chung của sản phẩm (Tên, Giá gốc, Mô tả...).
- **`product_images`**: Lưu trữ các đường dẫn ảnh từ Cloudinary liên kết với sản phẩm.
- **`product_variants`**: Các biến thể chi tiết (Size, Color, Stock, SKU).

## 2. User & Auth Tables (Planned)
- **`users`**: Thông tin người dùng.
- **`roles`**: Phân quyền (Admin, Customer).
- **`addresses`**: Sổ địa chỉ người dùng.

## 3. Order Tables (Planned)
- **`orders`**: Thông tin đơn hàng.
- **`order_items`**: Chi tiết các sản phẩm trong đơn hàng.
- **`payments`**: Thông tin thanh toán.

## 4. Engagement Tables (Planned)
- **`reviews`**: Đánh giá sản phẩm.
- **`wishlists`**: Sản phẩm yêu thích.
- **`blog_posts`**: Bài viết tin tức/thời trang.

---
*Ghi chú: Xem chi tiết định nghĩa tại `src/models/`.*
