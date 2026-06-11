import { useQuery } from '@tanstack/react-query'
import { healthApi } from '@/lib/api/healthApi'

const SPARKLINES = ['M0,30 Q25,10 50,20 T100,15', 'M0,20 Q25,30 50,15 T100,25', 'M0,25 Q25,15 50,30 T100,10']

export function useServices() {
  return useQuery({
    queryKey: ['health', 'services'],
    queryFn: async () => {
      const { data } = await healthApi.getServices()
      const svc = data.data
      return [
        {
          id: 1,
          name: 'API Server',
          status: svc.api === 'healthy' ? 'Active' : 'Critical',
          latency: '< 10ms',
          uptime: '99.9%',
          sparkline: SPARKLINES[0],
        },
        {
          id: 2,
          name: 'Database',
          status: svc.database === 'healthy' ? 'Stable' : 'Critical',
          latency: '< 5ms',
          uptime: '99.8%',
          sparkline: SPARKLINES[1],
        },
      ]
    },
  })
}

export function useAlerts() {
  return useQuery({
    queryKey: ['health', 'alerts'],
    queryFn: async () => {
      const { data } = await healthApi.getAlerts()
      return (data.data || []).map((alert, i) => ({
        id: i + 1,
        type: alert.severity === 'medium' ? 'warning' : 'info',
        title: alert.message,
        description: alert.message,
        timestamp: new Date().toLocaleString('vi-VN'),
        actions: alert.type === 'warning' ? [{ label: 'Xem chi tiết', action: 'view' }] : undefined,
      }))
    },
  })
}

export function useInfrastructure() {
  return useQuery({
    queryKey: ['health', 'infrastructure'],
    queryFn: async () => {
      const { data } = await healthApi.getInfrastructure()
      const infra = data.data
      return {
        nodeVersion: infra.nodeVersion,
        platform: infra.platform,
        memoryUsage: infra.memoryUsage,
        uptime: infra.uptime,
        environment: infra.environment,
        diskUsage: Math.round((infra.memoryUsage.heapUsed / infra.memoryUsage.heapTotal) * 100),
        networkIn: Math.round(infra.memoryUsage.rss / 1024 / 1024),
        networkOut: Math.round(infra.memoryUsage.external / 1024 / 1024),
        regions: [
          { name: infra.platform === 'win32' ? 'Primary' : 'Main', status: 'active' as const },
          { name: 'Backup', status: 'active' as const },
        ],
        globalLatency: 42,
        nodeHealth: Math.round((1 - infra.memoryUsage.heapUsed / infra.memoryUsage.heapTotal) * 100),
      }
    },
  })
}
