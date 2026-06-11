import type { Product } from './product'
import type { Variant } from './product'

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  variantId: number
  quantity: number
  price: number
  productName: string
  variantName: string
  product: Product
  variant: Variant
}

export interface Order {
  id: number
  userId: number
  totalPrice: number
  status: OrderStatus
  note: string | null
  voucherCode: string | null
  voucherId: number | null
  discountAmount: number
  phoneNumber: string | null
  shippingAddress: string | null
  paymentMethod: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user?: { id: number; username: string; email: string; role: string; status: string; avatarUrl: string | null; createdAt: string; updatedAt: string }
}

export interface CreateOrderDto {
  items: { productId: number; variantId: number; quantity: number }[]
  voucherCode?: string
  note?: string
  paymentMethod?: string
  phoneNumber?: string
  shippingAddress?: string
}

export interface UpdateOrderStatusDto {
  status: OrderStatus
}
