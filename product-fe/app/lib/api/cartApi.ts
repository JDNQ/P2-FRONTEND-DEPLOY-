import api from './axiosInstance'
import type { CartData, AddToCartDto } from '@/lib/types/cart'
import type { ApiResponse } from '@/lib/types/api'

export const cartApi = {
  get: () => api.get<ApiResponse<CartData>>('/cart'),

  add: (data: AddToCartDto) => api.post('/cart', data),

  update: (id: number, quantity: number) =>
    api.patch(`/cart/${id}`, { quantity }),

  remove: (id: number) => api.delete(`/cart/${id}`),

  clear: () => api.delete('/cart'),
}
