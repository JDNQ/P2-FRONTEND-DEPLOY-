import { z } from 'zod'

export const createVoucherSchema = z
  .object({
    code: z
      .string()
      .min(3, 'Mã tối thiểu 3 ký tự')
      .regex(/^[A-Z0-9]+$/, 'Chỉ dùng chữ in hoa và số')
      .transform((v) => v.toUpperCase()),
    description: z.string().optional(),
    discountType: z.enum(['PERCENT', 'FIXED']),
    discountValue: z.coerce.number().min(1, 'Phải > 0'),
    minOrderValue: z.coerce.number().min(0).optional(),
    maxDiscount: z.coerce.number().min(0).optional(),
    usageLimit: z.coerce.number().min(1).optional(),
    expiresAt: z.string().optional(),
  })
  .refine(
    (d) => !(d.discountType === 'PERCENT' && d.discountValue > 100),
    { message: 'Phần trăm giảm không vượt quá 100%', path: ['discountValue'] }
  )

export type CreateVoucherValues = z.infer<typeof createVoucherSchema>
