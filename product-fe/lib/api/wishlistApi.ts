import api from './axiosInstance'
import type { ApiResponse } from '@/lib/types/api'
import type { WishlistItem } from '@/lib/types/wishlist'

export const wishlistApi = {
  getAll: () => api.get<ApiResponse<WishlistItem[]>>('/wishlist'),
  add: (productId: number) =>
    api.post<ApiResponse<WishlistItem>>('/wishlist', { productId }),
  remove: (id: number) => api.delete<ApiResponse<void>>(`/wishlist/${id}`),
  addAllToCart: () => api.post<ApiResponse<void>>('/wishlist/add-all-to-cart'),
}
