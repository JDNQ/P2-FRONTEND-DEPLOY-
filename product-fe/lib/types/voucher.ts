export type DiscountType = 'PERCENT' | 'FIXED'

export interface Voucher {
  id: number
  code: string
  description: string | null
  discountType: DiscountType
  discountValue: number
  minOrderValue: number
  maxDiscount: number | null
  usageLimit: number
  usageCount: number
  isActive: boolean
  expiresAt: string | null
  createdAt: string
}

export interface CreateVoucherDto {
  code: string
  description?: string
  discountType: DiscountType
  discountValue: number
  minOrderValue?: number
  maxDiscount?: number
  usageLimit?: number
  expiresAt?: string
}
