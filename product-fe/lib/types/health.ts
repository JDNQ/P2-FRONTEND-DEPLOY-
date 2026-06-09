export interface ServiceStatus {
  id: number
  name: string
  status: 'Stable' | 'Warning' | 'Active' | 'Critical'
  latency: string
  uptime: string
  sparkline: string
}

export interface SystemAlert {
  id: number
  type: 'error' | 'warning' | 'info'
  title: string
  description: string
  timestamp: string
  actions?: { label: string; action: string }[]
}

export interface InfrastructureStats {
  diskUsage: number
  networkIn: number
  networkOut: number
  regions: { name: string; status: 'active' | 'offline' }[]
  globalLatency: number
  nodeHealth: number
}
