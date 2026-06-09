import api from './axiosInstance'
import type { ApiResponse } from '@/lib/types/api'
import type { UserProfile } from '@/lib/types/user'

export const userApi = {
  getAll: () => api.get<ApiResponse<UserProfile[]>>('/users'),
  create: (data: { username: string; email: string; password: string; fullName?: string; role?: string }) =>
    api.post<ApiResponse<UserProfile>>('/auth/create-manager', data),
  updateRole: (id: number, role: string) =>
    api.patch<ApiResponse<UserProfile>>(`/users/${id}/role`, { role }),
  toggleStatus: (id: number) =>
    api.patch<ApiResponse<UserProfile>>(`/users/${id}/toggle-status`),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/users/${id}`),
}
