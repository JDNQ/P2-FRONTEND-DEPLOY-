import api from './axiosInstance'
import type { Product, CreateProductDto } from '@/lib/types/product'
import type { ApiResponse } from '@/lib/types/api'

export const productApi = {
  getAll: () =>
    api.get<ApiResponse<Product[]>>('/products'),

  getOne: (id: number) =>
    api.get<ApiResponse<Product>>(`/products/${id}`),

  create: (data: CreateProductDto) =>
    api.post<ApiResponse<Product>>('/products', data),

  update: (id: number, data: Partial<CreateProductDto>) =>
    api.patch<ApiResponse<Product>>(`/products/${id}`, data),

  delete: (id: number) =>
    api.delete(`/products/${id}`),
}
