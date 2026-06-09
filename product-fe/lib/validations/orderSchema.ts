import { z } from 'zod'

export const createOrderSchema = z.object({
  items: z
    .array(z.object({
      productId: z.number(),
      variantId: z.number(),
      quantity: z.number().min(1, 'Số lượng tối thiểu 1'),
    }))
    .min(1, 'Giỏ hàng trống'),
  voucherCode: z.string().optional(),
  note: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
  paymentMethod: z.string().optional(),
  phoneNumber: z.string().optional(),
  shippingAddress: z.string().optional(),
})

export type CreateOrderValues = z.infer<typeof createOrderSchema>
