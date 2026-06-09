import api from './axiosInstance'
import type { ApiResponse } from '@/lib/types/api'
import type { ActivityLog, LogStats } from '@/lib/types/log'

export const logApi = {
  getAll: (params?: { search?: string; action?: string; startDate?: string; endDate?: string }) =>
    api.get<ApiResponse<ActivityLog[]>>('/logs', { params }),
  getStats: () => api.get<ApiResponse<LogStats>>('/logs/stats'),
}
