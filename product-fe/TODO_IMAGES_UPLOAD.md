# TODO - Upload & Hiển thị ảnh sản phẩm (FE Next.js)

## Đã làm

- `app/products/[id]/page.tsx`
  - Cập nhật type `ProductDetail` thêm `images` và `variants[*].image`
  - Thêm Image Slider + thumbnails (badge “Ảnh chính”)
  - Sửa bảng Variants thêm cột “Ảnh”

## Chưa làm (theo spec người dùng)

1. `components/ProductForm.tsx`
   - Thêm state upload:
     - `productImages`
     - `variantImages`
     - `uploading`
   - Thêm hàm `uploadProductImages(files)` gọi endpoint upload ảnh product
   - Thêm hàm `uploadVariantImage(index, file)` gọi endpoint upload ảnh variant
   - Đưa UI upload ảnh product (sau Base price, trước Variants)
   - Thêm UI upload ảnh variant cho từng variant (kèm preview)
   - Sửa `onValid` để đính kèm payload:
     - `images: productImages` (nếu có)
     - `variants[*].image` (từ `variantImages`)

2. `components/VariantRow.tsx` (nếu cần)
   - Không bắt buộc nếu UI upload ảnh variant đặt trực tiếp trong `ProductForm` như spec
   - Nếu bạn muốn upload nằm trong VariantRow thì cần sửa VariantRow signature.

3. `.env.local`
   - Thêm `NEXT_PUBLIC_API_URL=<backend-url-thực>`

## Endpoint giả định (cần khớp backend)

- `/upload/product-images`
- `/upload/variant-image`

---
