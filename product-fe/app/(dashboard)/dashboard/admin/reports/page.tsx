'use client'
import { useAdminDashboard } from '@/lib/hooks/useDashboard'
import { useAllOrders } from '@/lib/hooks/useOrders'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function ReportsPage() {
  const { data: dashboard } = useAdminDashboard()
  const { data: orders } = useAllOrders()

  const deliveredOrders = orders?.filter((o) => o.status === 'DELIVERED') || []
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalPrice, 0)
  const totalOrders = orders?.length || 0
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const revenueByMonth = dashboard?.revenue || [
    { label: 'Tháng 1', value: 45000000 },
    { label: 'Tháng 2', value: 52000000 },
    { label: 'Tháng 3', value: 48000000 },
    { label: 'Tháng 4', value: 61000000 },
    { label: 'Tháng 5', value: 72000000 },
    { label: 'Tháng 6', value: 68000000 },
  ]

  const maxVal = Math.max(...revenueByMonth.map(r => r.value), 1)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline-md font-heading font-bold text-primary">Báo cáo doanh thu</h2>
        <p className="text-on-surface-variant text-body-md">Thống kê và báo cáo tổng quan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border border-border-subtle">
          <p className="text-body-sm text-on-surface-variant">Tổng doanh thu</p>
          <h3 className="text-headline-lg font-bold text-primary">{formatPrice(totalRevenue)}</h3>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border border-border-subtle">
          <p className="text-body-sm text-on-surface-variant">Tổng đơn hàng</p>
          <h3 className="text-headline-lg font-bold text-primary">{totalOrders}</h3>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border border-border-subtle">
          <p className="text-body-sm text-on-surface-variant">Giá trị TB mỗi đơn</p>
          <h3 className="text-headline-lg font-bold text-primary">{formatPrice(avgOrderValue)}</h3>
        </div>
      </div>

      <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border border-border-subtle">
        <h3 className="text-title-md font-bold mb-4">Doanh thu theo tháng</h3>
        <div className="flex items-end gap-3 h-48">
          {revenueByMonth.map((item) => (
            <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-primary">{formatPrice(item.value)}</span>
              <div
                className="w-full bg-primary/20 rounded-t-lg hover:bg-primary/40 transition-colors"
                style={{ height: `${(item.value / maxVal) * 100}%` }}
              />
              <span className="text-xs text-on-surface-variant">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border border-border-subtle">
        <h3 className="text-title-md font-bold mb-2">Xuất dữ liệu</h3>
        <p className="text-body-sm text-on-surface-variant mb-4">Tải xuống báo cáo dưới dạng file CSV hoặc Excel</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all">
            Xuất đơn hàng (CSV)
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all">
            Xuất khách hàng (CSV)
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all">
            Xuất doanh thu (CSV)
          </button>
        </div>
      </div>
    </div>
  )
}
