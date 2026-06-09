export interface ActivityLog {
  id: number
  timestamp: string
  user: string
  role: string
  action: string
  target: string
  ip: string
  device: string
  status: 'Success' | 'Failed' | 'System'
  note?: string
}

export interface LogStats {
  total24h: number
  successRate: number
  securityWarnings: number
  unknownIps: number
}
