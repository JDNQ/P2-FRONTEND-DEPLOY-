import type { UserRole } from './auth'

export interface UserProfile {
  id: number
  username: string
  email: string
  role: UserRole
  status: 'Active' | 'Banned'
  createdAt: string
  updatedAt?: string
}

export interface DashboardStats {
  totalUsers: number
  activeNow: number
  newThisWeek: number
  banned: number
  totalUsersTrend: number
}
