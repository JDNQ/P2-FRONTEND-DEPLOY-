import type { Product } from './product'

export interface WishlistItem {
  id: number
  userId: number
  productId: number
  createdAt: string
  product: Product
}
