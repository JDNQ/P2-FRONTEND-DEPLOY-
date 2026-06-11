import api from './axiosInstance'
import type { ApiResponse } from '@/lib/types/api'
import type { Notification } from '@/lib/types/notification'

export const notificationApi = {
  getAll: () => api.get<ApiResponse<Notification[]>>('/notifications'),
  markRead: (id: number) =>
    api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`),
  markAllRead: () => api.patch<ApiResponse<void>>('/notifications/read-all'),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/notifications/${id}`),

  getUnreadCount: () => api.get<ApiResponse<number>>('/notifications/unread-count'),
}
