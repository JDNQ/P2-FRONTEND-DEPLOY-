import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboardApi'

export function useManagerDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'manager'],
    queryFn: async () => {
      const { data } = await dashboardApi.getManagerDashboard()
      return data.data
    },
  })
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: async () => {
      const { data } = await dashboardApi.getAdminDashboard()
      return data.data
    },
  })
}
