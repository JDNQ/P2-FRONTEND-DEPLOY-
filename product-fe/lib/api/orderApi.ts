import api from './axiosInstance'
import type { Order, CreateOrderDto, UpdateOrderStatusDto } from '@/lib/types/order'
import type { ApiResponse } from '@/lib/types/api'

export const orderApi = {
  create: (data: CreateOrderDto) =>
    api.post<ApiResponse<Order>>('/orders', data),

  getAll: () => api.get<ApiResponse<Order[]>>('/orders'),

  getMy: () => api.get<ApiResponse<Order[]>>('/orders/my'),

  getOne: (id: number) => api.get<ApiResponse<Order>>(`/orders/${id}`),

  updateStatus: (id: number, data: UpdateOrderStatusDto) =>
    api.patch<ApiResponse<Order>>(`/orders/${id}/status`, data),

  cancelByUser: (id: number) =>
    api.post<ApiResponse<Order>>(`/orders/${id}/cancel`),
}
