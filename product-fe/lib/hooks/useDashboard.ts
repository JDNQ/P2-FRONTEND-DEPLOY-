import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboardApi'
import type { KpiCard, RevenuePoint, TopProduct, RecentActivity, CategoryStat } from '@/lib/types/dashboard'
import { formatPrice } from '@/lib/utils/formatPrice'

function mapKpiToCards(kpis: Record<string, number>): KpiCard[] {
  const iconMap: Record<string, string> = {
    totalOrders: 'shopping_bag',
    totalProducts: 'inventory',
    totalUsers: 'group',
    totalRevenue: 'payments',
    pendingOrders: 'hourglass_empty',
  }
  const labelMap: Record<string, string> = {
    totalOrders: 'Đơn hàng',
    totalProducts: 'Sản phẩm',
    totalUsers: 'Người dùng',
    totalRevenue: 'Doanh thu',
    pendingOrders: 'Chờ xử lý',
  }
  return Object.entries(kpis).map(([key, value]) => ({
    label: labelMap[key] || key,
    value: key === 'totalRevenue' ? formatPrice(value as number) : String(value ?? 0),
    trend: 0,
    trendLabel: 'vs tháng trước',
    icon: iconMap[key] || 'chart_data',
  }))
}

function mapRevenue(revenue: { date: string; total: number }[]): RevenuePoint[] {
  return revenue.map(r => ({
    label: r.date ? new Date(r.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }) : 'N/A',
    value: Math.round((r.total / 1000) * 10) / 10,
  }))
}

function mapTopProducts(products: { productId: number; productName: string; totalSold: number | null; totalRevenue: number | null }[]): TopProduct[] {
  return products.map(p => ({
    id: p.productId,
    name: p.productName,
    category: 'General',
    price: formatPrice(p.totalRevenue ?? 0),
    sales: p.totalSold ?? 0,
    stock: 0,
    tag: p.totalSold && p.totalSold > 10 ? 'Selling Fast' : 'Normal',
  }))
}

function mapRecentActivities(activities: { id: number; action: string; user: { id: number; username: string } | null; createdAt: string }[]): RecentActivity[] {
  return activities.map(a => ({
    id: a.id,
    initials: a.user ? a.user.username.charAt(0).toUpperCase() : 'S',
    initialsBg: a.user ? '#4958a9' : '#747688',
    name: a.user?.username ?? 'System',
    action: a.action,
    target: a.action,
    timestamp: new Date(a.createdAt).toLocaleString('vi-VN'),
  }))
}

export function useManagerDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'manager'],
    queryFn: async () => {
      try {
        const { data } = await dashboardApi.getManagerDashboard()
        const raw = data.data
        return {
          kpis: mapKpiToCards(raw.kpis as unknown as Record<string, number>),
          revenue: mapRevenue(raw.revenue),
          topProducts: mapTopProducts(raw.topProducts),
          recentActivities: mapRecentActivities(raw.recentActivities),
        }
      } catch {
        return { kpis: [], revenue: [], topProducts: [], recentActivities: [] }
      }
    },
  })
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: async () => {
      try {
        const { data } = await dashboardApi.getAdminDashboard()
        const raw = data.data
        return {
          kpis: mapKpiToCards(raw.kpis as unknown as Record<string, number>),
          revenue: mapRevenue(raw.revenue),
          topProducts: mapTopProducts(raw.topProducts),
          recentActivities: mapRecentActivities(raw.recentActivities),
          categoryStats: raw.categoryStats.map((c: { shopId: number; count: number }, i: number) => ({
            name: `Shop #${c.shopId}`,
            percentage: Math.round((c.count / Math.max(...raw.categoryStats.map((x: { count: number }) => x.count), 1)) * 100),
            color: ['bg-primary-500', 'bg-primary-600', 'bg-secondary', 'bg-outline-variant'][i % 4],
          })),
        }
      } catch {
        return {
          kpis: [] as KpiCard[],
          revenue: [] as RevenuePoint[],
          topProducts: [] as TopProduct[],
          recentActivities: [] as RecentActivity[],
          categoryStats: [] as CategoryStat[],
        }
      }
    },
  })
}
