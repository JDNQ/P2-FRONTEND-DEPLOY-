import type { Product } from './product'
import type { Variant } from './product'

export interface CartItem {
  id: number
  userId: number
  productId: number
  variantId: number
  quantity: number
  createdAt: string
  product: Product
  variant: Variant
}

export interface CartData {
  items: CartItem[]
  totalPrice: number
}

export interface AddToCartDto {
  productId: number
  variantId: number
  quantity?: number
}
