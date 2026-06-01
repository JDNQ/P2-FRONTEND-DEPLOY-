# TODO (DX FutureTech / Product Manager)

## Completed

- ✅ app/login/page.tsx: giữ split layout trái/phải, validation inline đỏ, spinner + redirect `/products`, toggle password, EN/VI.
- ✅ app/layout.tsx: không bọc sidebar (root chỉ wrap html/body).
- ✅ components/Sidebar.tsx: chuyển khỏi `fixed` để layout `/products` điều khiển transition width.
- ✅ components/Header.tsx: tạo header sticky gồm hamburger, search, language switch, bell, user info.
- ✅ app/products/layout.tsx: tạo dashboard layout bọc `/products/*` (sidebar + header + main padding).
- ✅ app/login/layout.tsx: tạo layout rỗng để login dùng layout riêng (không bị dashboard layout bọc).

## Notes

- Chưa thống nhất toàn bộ màu scheme trên toàn repo (ví dụ `--primary` trong globals.css vẫn còn `#533ab7`).
