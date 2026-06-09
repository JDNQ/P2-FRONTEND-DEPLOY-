import { useQuery } from '@tanstack/react-query'
import { healthApi } from '@/lib/api/healthApi'

export function useServices() {
  return useQuery({
    queryKey: ['health', 'services'],
    queryFn: async () => {
      const { data } = await healthApi.getServices()
      return data.data
    },
  })
}

export function useAlerts() {
  return useQuery({
    queryKey: ['health', 'alerts'],
    queryFn: async () => {
      const { data } = await healthApi.getAlerts()
      return data.data
    },
  })
}

export function useInfrastructure() {
  return useQuery({
    queryKey: ['health', 'infrastructure'],
    queryFn: async () => {
      const { data } = await healthApi.getInfrastructure()
      return data.data
    },
  })
}
