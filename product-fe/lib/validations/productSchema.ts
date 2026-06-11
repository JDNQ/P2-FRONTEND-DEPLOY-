import { z } from 'zod'

export const variantSchema = z.object({
  variantName: z.string().min(1, 'Variant name là bắt buộc'),
  extraPrice: z.number(),
  stock: z.number().min(0, 'Stock phải lớn hơn hoặc bằng 0'),
  image: z.string().optional(),
})

export const productSchema = z.object({
  productName: z
    .string()
    .min(1, 'Product name là bắt buộc')
    .max(100, 'Product name không được vượt quá 100 ký tự'),
  description: z.string().optional(),
  basePrice: z.number().min(0, 'Base price phải lớn hơn hoặc bằng 0'),
  variants: z.array(variantSchema).min(1, 'Cần ít nhất 1 variant'),
  images: z.array(z.string()).optional(),
})

export type ProductValues = z.input<typeof productSchema>
