import api from './axiosInstance'
import type { ApiResponse } from '@/lib/types/api'
import type {
  KpiCard,
  RevenuePoint,
  TopProduct,
  RecentActivity,
  CategoryStat,
} from '@/lib/types/dashboard'

export const dashboardApi = {
  getAdminDashboard: () =>
    api.get<ApiResponse<{
      kpis: KpiCard[]
      revenue: RevenuePoint[]
      topProducts: TopProduct[]
      recentActivities: RecentActivity[]
      categoryStats: CategoryStat[]
    }>>('/dashboard/admin'),

  getManagerDashboard: () =>
    api.get<ApiResponse<{
      kpis: KpiCard[]
      revenue: RevenuePoint[]
      topProducts: TopProduct[]
      recentActivities: RecentActivity[]
    }>>('/dashboard/manager'),
}
