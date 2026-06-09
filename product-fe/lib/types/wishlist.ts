export interface WishlistItem {
  id: number
  productId: number
  name: string
  description: string
  price: number
  rating: number
  reviewCount: number
  image: string
  badge?: string
  colors?: string[]
}
