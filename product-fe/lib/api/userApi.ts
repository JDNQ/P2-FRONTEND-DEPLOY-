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
  updateProfile: (id: number, data: { username?: string; email?: string; avatarUrl?: string }) =>
    api.patch<ApiResponse<{ id: number; username: string; email?: string; avatarUrl?: string }>>(`/users/${id}`, data),
  getProfile: () =>
    api.get<ApiResponse<{ id: number; username: string; email?: string; role: string; avatarUrl?: string }>>('/auth/profile'),
}
