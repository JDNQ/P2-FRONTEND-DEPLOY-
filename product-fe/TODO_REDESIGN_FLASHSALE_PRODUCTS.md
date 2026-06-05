# TODO - Flash Sale/Featured + Product Detail Redesign

## 1) Home page (app/page.tsx)

- [x] Fetch real products from API using `getProducts()`.
- [x] Flash Sale: đổi nút "Xem chi tiết" sang `/products/${p.id}`.
- [x] Flash Sale: render `productName` + `basePrice`, discountPercent ngẫu nhiên 10-30% nếu có `variants[0].extraPrice`.
- [x] Featured products: bỏ id tĩnh, dùng `realProducts` thay cho `featuredProducts`.

## 2) Product detail page (app/products/[id]/page.tsx)

- [ ] Fix Hooks violation: move `useState/useEffect` to top (userRole + selectedVariant + quantity).

- [ ] Redesign UI (Shopee/Tiki style) theo spec.
- [ ] Variant buttons: update selectedVariant; clamp quantity <= stock.
- [ ] Buttons: "Thêm giỏ hàng" + "Mua ngay"; show edit/delete for non-USER.
