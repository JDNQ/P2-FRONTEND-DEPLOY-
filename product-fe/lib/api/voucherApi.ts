import api from './axiosInstance'
import type { Voucher, CreateVoucherDto } from '@/lib/types/voucher'
import type { ApiResponse } from '@/lib/types/api'

export const voucherApi = {
  getAll: () => api.get<ApiResponse<Voucher[]>>('/vouchers'),

  getByCode: (code: string) =>
    api.get<ApiResponse<Voucher>>(`/vouchers/${code}`),

  apply: (code: string, orderTotal: number) =>
    api.post<ApiResponse<{ discount: number; finalPrice: number }>>('/vouchers/apply', { code, orderTotal }),

  create: (data: CreateVoucherDto) =>
    api.post<ApiResponse<Voucher>>('/vouchers', data),

  deactivate: (id: number) =>
    api.patch(`/vouchers/${id}/deactivate`),

  update: (id: number, data: Partial<CreateVoucherDto>) =>
    api.patch<ApiResponse<Voucher>>(`/vouchers/${id}`, data),
}
