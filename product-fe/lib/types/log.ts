export interface ActivityLog {
  id: number
  userId: number | null
  action: string
  entity: string | null
  entityId: number | null
  details: string | null
  ip: string | null
  createdAt: string
  user: { id: number; username: string } | null
}

export interface LogStats {
  totalLogs: number
  actionBreakdown: { action: string; count: number }[]
  recentActivity: {
    id: number
    action: string
    createdAt: string
    user: { id: number; username: string } | null
  }[]
}

export interface LogQueryParams {
  page?: number
  limit?: number
  action?: string
}
