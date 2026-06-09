# 🛒 TL Market - Design Specification

Tài liệu thiết kế chi tiết cho dự án Frontend TL Market (Next.js 14+ App Router).

---

## 🎨 1. Hệ thống màu sắc (Color Palette)

### Primary Colors (Orange Gradient)
Dùng cho nút bấm CTA, Icons quan trọng, và các trạng thái active.
- **Primary 500 (Main):** `#f97316` (Nền chính)
- **Primary 600 (Dark):** `#ea580c` (Hover/Gradient end)
- **Primary 50 (Light):** `#fff4ed` (Background active/Highlight)
- **Gradient:** `linear-gradient(to right, #f97316, #ea580c)`

### Secondary & Special Colors
- **Flash Sale:** `#ff2d2d` (Đỏ rực cho countdown và badge giảm giá)
- **Gold/Rating:** `#f59e0b` (Màu sao đánh giá, huy hiệu vàng)
- **Success:** `#22c55e` (Trạng thái đã giao, còn hàng)
- **Surface:** `#f8fafc` (Nền toàn trang)
- **Surface Container:** `#ffffff` (Nền Card, Modal, Input)

---

## ✍️ 2. Typography

### Headings
- **Font:** `Sora`, sans-serif
- **Style:** Bold (700) hoặc Extra Bold (800)
- **Usage:** Tiêu đề trang, Tên sản phẩm trong chi tiết, Tiêu đề Section lớn.

### Body Text
- **Font:** `Be Vietnam Pro`, sans-serif
- **Weight:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold)
- **Usage:** Nội dung mô tả, giá cả, menu navigation, text input.

---

## 🏗️ 3. UI Components Standards

### Cards (Sản phẩm/Voucher)
- **Radius:** `16px` (Rounded 2XL)
- **Border:** `1px solid #f1f5f9`
- **Shadow:** `shadow-sm` mặc định, `shadow-lg` (với `translate-y-[-4px]`) khi hover.

### Buttons
- **Shape:** Rounded `12px` (XL)
- **Padding:** `12px 24px` cho nút lớn, `8px 16px` cho nút nhỏ.
- **Interactions:** `whileTap={{ scale: 0.98 }}` và `whileHover={{ scale: 1.02 }}`.

### Inputs
- **Shape:** Rounded `12px`
- **Border Focus:** `2px solid #f97316`

---

## 📂 4. Danh sách các trang cụ thể (Sitemap)

### 🟢 Nhóm Người dùng (Main Flow)
1.  **Trang chủ (`/`):** Hero banner, Flash Sale, Danh mục nổi bật, Sản phẩm gợi ý.
2.  **Danh sách sản phẩm (`/products`):** Bộ lọc (Filter), Sắp xếp (Sort), Tìm kiếm.
3.  **Chi tiết sản phẩm (`/products/[id]`):** Gallery ảnh, Chọn phân loại (Variant Selector), Mô tả, Đánh giá.
4.  **Giỏ hàng (`/cart`):** Quản lý số lượng, Áp dụng Voucher, Tóm tắt chi phí.
5.  **Thanh toán (`/checkout`):** Form thông tin nhận hàng, Ghi chú, Phương thức thanh toán.
6.  **Thành công (`/checkout/success`):** Xác nhận đơn hàng, Hiệu ứng Confetti.
7.  **Đơn hàng của tôi (`/orders`):** Danh sách đơn theo trạng thái (Chờ xác nhận, Đang giao, Đã giao...).
8.  **Yêu thích (`/wishlist`):** Danh sách sản phẩm đã lưu.
9.  **Cá nhân (`/profile`):** Thông tin tài khoản, Lịch sử mua hàng.

### 🟡 Nhóm Xác thực (Auth Flow)
10. **Đăng nhập (`/login`):** Form login, Social login.
11. **Đăng ký (`/register`):** Form tạo tài khoản mới.

### 🔴 Nhóm Quản trị (Admin/Manager Dashboard)
12. **Tổng quan (`/dashboard`):** Chỉ số doanh thu, Tổng đơn hàng, Biểu đồ thống kê.
13. **Quản lý sản phẩm (`/dashboard/products`):** Danh sách, Thêm mới, Chỉnh sửa, Upload ảnh Cloudinary.
14. **Quản lý đơn hàng (`/dashboard/orders`):** Cập nhật trạng thái đơn hàng.
15. **Quản lý Voucher (`/dashboard/vouchers`):** Tạo và quản lý mã giảm giá.

---

## ⚙️ 5. Tech Stack Recommendation
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + Framer Motion (Animations)
- **UI Library:** Shadcn/ui (Base components)
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Validation:** Zod + React Hook Form
