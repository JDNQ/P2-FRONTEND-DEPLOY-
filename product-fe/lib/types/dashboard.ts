export interface KpiCard {
  label: string
  value: string
  trend: number
  trendLabel: string
  icon: string
}

export interface RevenuePoint {
  label: string
  value: number
}

export interface TopProduct {
  id: number
  name: string
  category: string
  price: number
  sales: number
  stock: number
  tag: string
}

export interface RecentActivity {
  id: number
  initials: string
  initialsBg: string
  name: string
  action: string
  target: string
  timestamp: string
}

export interface CategoryStat {
  name: string
  percentage: number
  color: string
}

export interface AdminDashboardData {
  kpis: KpiCard[]
  revenue: RevenuePoint[]
  topProducts: TopProduct[]
  recentActivities: RecentActivity[]
  categoryStats: CategoryStat[]
}
