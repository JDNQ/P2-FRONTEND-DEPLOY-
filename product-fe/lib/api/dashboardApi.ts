import api from './axiosInstance'
import type { ApiResponse } from '@/lib/types/api'
import type { AdminDashboardData, ManagerDashboardData } from '@/lib/types/dashboard'

export const dashboardApi = {
  getAdminDashboard: () =>
    api.get<ApiResponse<AdminDashboardData>>('/dashboard/admin'),

  getManagerDashboard: () =>
    api.get<ApiResponse<ManagerDashboardData>>('/dashboard/manager'),
}
