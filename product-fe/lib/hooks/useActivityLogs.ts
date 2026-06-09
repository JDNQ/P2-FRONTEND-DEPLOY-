import { useQuery } from '@tanstack/react-query'
import { logApi } from '@/lib/api/logApi'

export function useActivityLogs(params?: {
  search?: string
  action?: string
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ['logs', params],
    queryFn: async () => {
      const { data } = await logApi.getAll(params)
      return data.data
    },
  })
}

export function useLogStats() {
  return useQuery({
    queryKey: ['logs', 'stats'],
    queryFn: async () => {
      const { data } = await logApi.getStats()
      return data.data
    },
  })
}
