import api from './axiosInstance'
import type { ApiResponse } from '@/lib/types/api'
import type { ServiceStatus, SystemAlert, InfrastructureStats } from '@/lib/types/health'

export const healthApi = {
  getServices: () => api.get<ApiResponse<ServiceStatus[]>>('/health/services'),
  getAlerts: () => api.get<ApiResponse<SystemAlert[]>>('/health/alerts'),
  getInfrastructure: () =>
    api.get<ApiResponse<InfrastructureStats>>('/health/infrastructure'),
}
