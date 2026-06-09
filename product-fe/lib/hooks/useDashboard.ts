import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboardApi'
import type { KpiCard, RevenuePoint, TopProduct, RecentActivity, CategoryStat } from '@/lib/types/dashboard'

export function useManagerDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'manager'],
    queryFn: async () => {
      try {
        const { data } = await dashboardApi.getManagerDashboard()
        return data.data
      } catch {
        return { kpis: [], revenue: [], topProducts: [], recentActivities: [] }
      }
    },
  })
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: async () => {
      try {
        const { data } = await dashboardApi.getAdminDashboard()
        return data.data
      } catch {
        return {
          kpis: [] as KpiCard[],
          revenue: [] as RevenuePoint[],
          topProducts: [] as TopProduct[],
          recentActivities: [] as RecentActivity[],
          categoryStats: [] as CategoryStat[],
        }
      }
    },
  })
}
