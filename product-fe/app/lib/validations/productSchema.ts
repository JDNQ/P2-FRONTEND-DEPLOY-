import { z } from 'zod'

export const variantSchema = z.object({
  variantName: z.string().min(1, 'Không được để trống'),
  extraPrice: z.coerce.number().min(0, 'Phải >= 0'),
  stock: z.coerce.number().min(0, 'Phải >= 0'),
  image: z.string().url().optional().or(z.literal('')),
})

export const productSchema = z.object({
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional(),
  basePrice: z.coerce.number().min(1000, 'Giá tối thiểu 1.000đ'),
  shopId: z.coerce.number().min(1, 'Vui lòng chọn shop'),
  variants: z.array(variantSchema).min(1, 'Cần ít nhất 1 phân loại'),
})

export type ProductValues = z.infer<typeof productSchema>
