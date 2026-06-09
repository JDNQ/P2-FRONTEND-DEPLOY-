import type { Product } from './product'
import type { Variant } from './product'

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: number
  productId: number
  variantId: number
  quantity: number
  price: number
  product?: Product
  variant?: Variant
}

export interface Order {
  id: number
  status: OrderStatus
  items: OrderItem[]
  totalPrice: number
  voucherCode?: string
  note?: string
  phoneNumber?: string
  shippingAddress?: string
  voucherId?: number
  paymentMethod?: string
  createdAt: string
  updatedAt: string
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
