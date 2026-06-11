export interface AdminKpis {
  totalOrders: number
  totalProducts: number
  totalUsers: number
  totalRevenue: number
  pendingOrders: number
}

export interface ManagerKpis {
  totalOrders: number
  totalProducts: number
  totalRevenue: number
  pendingOrders: number
}

export interface RevenuePoint {
  date: string
  total: number
}

export interface TopProduct {
  productId: number
  productName: string
  totalSold: number | null
  totalRevenue: number | null
}

export interface RecentActivity {
  id: number
  action: string
  user: { id: number; username: string } | null
  createdAt: string
}

export interface CategoryStat {
  shopId: number
  count: number
}

export interface AdminDashboardData {
  kpis: AdminKpis
  revenue: RevenuePoint[]
  topProducts: TopProduct[]
  recentActivities: RecentActivity[]
  categoryStats: CategoryStat[]
}

export interface ManagerDashboardData {
  kpis: ManagerKpis
  revenue: RevenuePoint[]
  topProducts: TopProduct[]
  recentActivities: RecentActivity[]
}
