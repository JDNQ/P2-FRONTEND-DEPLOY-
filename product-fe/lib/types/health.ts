export interface ServiceStatus {
  database: string
  api: string
  timestamp: string
}

export interface SystemAlert {
  id?: number
  type: 'warning' | 'info'
  message: string
  severity: 'medium' | 'low'
}

export interface InfrastructureStats {
  nodeVersion: string
  platform: string
  memoryUsage: {
    rss: number
    heapTotal: number
    heapUsed: number
    external: number
    arrayBuffers: number
  }
  uptime: number
  environment: string
}
