'use client'
import { useAllOrders } from '@/lib/hooks/useOrders'
import { useProducts } from '@/lib/hooks/useProducts'
import { useAdminDashboard } from '@/lib/hooks/useDashboard'
import { formatPrice } from '@/lib/utils/formatPrice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const ORDER_STATUS_MAP: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PENDING:   { label: 'Pending',   bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-600' },
  CONFIRMED: { label: 'Confirmed', bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-600' },
  SHIPPING:  { label: 'Shipping',  bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-600' },
  DELIVERED: { label: 'Delivered', bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-600' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-600' },
}

function getInitials(id: number) {
  const s = String(id)
  return s.slice(0, 2).toUpperCase()
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { data: ordersData } = useAllOrders()
  const { data: products } = useProducts()
  const { data: dashboard } = useAdminDashboard()

  const orders = ordersData || []
  const totalRevenue = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalPrice, 0)
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length
  const recentOrders = orders.slice(0, 5)

  const weeks = (dashboard?.revenue ?? []).length > 0
    ? dashboard!.revenue.map(r => ({ label: r.label, value: r.value }))
    : orders.length > 0
      ? orders.map((o, i) => ({
          label: `Week ${Math.min(Math.ceil(new Date(o.createdAt).getDate() / 7), 4)}`,
          value: 30 + (i * 7) % 60,
        })).slice(0, 4)
      : [
          { label: 'Week 1', value: 40 },
          { label: 'Week 2', value: 55 },
          { label: 'Week 3', value: 65 },
          { label: 'Week 4', value: 95 },
        ]

  const maxWeekVal = Math.max(...weeks.map(w => w.value), 1)
  const weekLabels = weeks.slice(0, 4)

  const categories = dashboard?.categoryStats ?? [
    { name: 'Điện tử', percentage: 45, color: 'bg-primary-500' },
    { name: 'Thời trang', percentage: 32, color: 'bg-primary-600' },
    { name: 'Gia dụng', percentage: 15, color: 'bg-secondary' },
    { name: 'Khác', percentage: 8, color: 'bg-outline-variant' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="bg-[#fcf8ff] p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 transition-all"
          style={{ transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(71,71,208,0.2)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="p-2 bg-[#3b82f6]/10 text-[#3b82f6] rounded-lg material-symbols-outlined">payments</span>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-sm">trending_up</span> {dashboard?.kpis?.[0]?.trend ?? 12.5}%
            </span>
          </div>
          <p className="text-[#444656] text-[14px] leading-[20px] font-medium">Doanh thu</p>
          <h3 className="text-[24px] font-bold leading-[32px]">{formatPrice(totalRevenue)}</h3>
        </div>

        <div
          className="bg-[#fcf8ff] p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 transition-all"
          style={{ transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(71,71,208,0.2)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="p-2 bg-[#4958a9]/10 text-[#4958a9] rounded-lg material-symbols-outlined">shopping_bag</span>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-sm">trending_up</span> 8.2%
            </span>
          </div>
          <p className="text-[#444656] text-[14px] leading-[20px] font-medium">Đơn hàng</p>
          <h3 className="text-[24px] font-bold leading-[32px]">{orders.length.toLocaleString()}</h3>
        </div>

        <div
          className="bg-[#fcf8ff] p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 transition-all"
          style={{ transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(71,71,208,0.2)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="p-2 bg-[#3b82f6]/10 text-[#3b82f6] rounded-lg material-symbols-outlined">inventory</span>
            <span className="flex items-center text-xs font-bold text-[#444656] bg-[#e1dfff] px-2 py-0.5 rounded-full">Stable</span>
          </div>
          <p className="text-[#444656] text-[14px] leading-[20px] font-medium">Sản phẩm</p>
          <h3 className="text-[24px] font-bold leading-[32px]">{products?.length || 0}</h3>
        </div>

        <div
          className="bg-[#fcf8ff] p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 transition-all"
          style={{ transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(71,71,208,0.2)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="p-2 bg-[#ba1a1a]/10 text-[#ba1a1a] rounded-lg material-symbols-outlined">hourglass_empty</span>
            <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-sm">trending_down</span> -2.4%
            </span>
          </div>
          <p className="text-[#444656] text-[14px] leading-[20px] font-medium">Chờ xử lý</p>
          <h3 className="text-[24px] font-bold leading-[32px]">{pendingOrders}</h3>
        </div>
      </div>

      {/* Chart + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Chart */}
        <div
          className="lg:col-span-2 bg-[#fcf8ff] p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 flex flex-col"
          style={{ transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(71,71,208,0.2)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[20px] font-semibold leading-[28px]">Tăng trưởng doanh thu</h4>
            <select className="bg-[#e8e6ff] border-none rounded-lg text-[14px] leading-[20px] font-medium px-3 py-1.5 focus:ring-1 focus:ring-[#3b82f6] outline-none transition-all">
              <option>30 ngày qua</option>
              <option>6 tháng qua</option>
              <option>Năm nay</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px] relative w-full overflow-hidden bg-[#ffffff] rounded-xl">
            <div className="absolute inset-0 flex items-end px-4 pb-8 space-x-2">
              {weekLabels.map((w, i) => {
                const height = Math.round((w.value / maxWeekVal) * 95)
                const isMax = w.value === maxWeekVal
                return (
                  <div
                    key={i}
                    className={`w-full rounded-t-lg relative group transition-all ${isMax ? 'bg-[#3b82f6]' : 'bg-[#3b82f6]/20'} ${!isMax ? 'hover:bg-[#3b82f6]/40' : 'hover:brightness-110'}`}
                    style={{ height: `${height}%` }}
                  >
                    {isMax && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#3b82f6] text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap">
                        {formatPrice(totalRevenue)}
                      </div>
                    )}
                    {!isMax && (
                      <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1e40af] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                        ~{formatPrice((totalRevenue * w.value) / maxWeekVal / 1000 * 1000)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="absolute inset-x-0 bottom-2 px-4 flex justify-between text-[10px] text-[#c4c5d9] font-bold uppercase tracking-wider">
              {weekLabels.map((w, i) => (
                <span key={i}>{w.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div
          className="bg-[#fcf8ff] p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 flex flex-col"
          style={{ transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(71,71,208,0.2)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        >
          <h4 className="text-[20px] font-semibold leading-[28px] mb-6">Danh mục hàng đầu</h4>
          <div className="flex-1 space-y-5">
            {categories.map((cat) => (
              <div key={cat.name} className="space-y-2">
                <div className="flex justify-between items-center text-[14px] leading-[20px] font-medium">
                  <span className="font-bold">{cat.name}</span>
                  <span className="text-[#444656]">{cat.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-[#e8e6ff] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <div className="p-4 bg-[#f5f2ff] rounded-xl border border-[#c4c5d9]/30 flex items-center gap-3">
              <div className="p-2 bg-[#4958a9]/20 rounded-lg text-[#4958a9]">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <p className="text-[12px] leading-[16px] text-[#444656]">
                <strong className="text-[#1e40af]">Gợi ý:</strong> &quot;Fashion&quot; tăng 15% tuần này. Cân nhắc chạy flash sale cuối tuần.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div
        className="bg-[#fcf8ff] rounded-xl shadow-sm border border-[#c4c5d9]/50 overflow-hidden"
        style={{ transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(71,71,208,0.2)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
      >
        <div className="p-6 border-b border-[#c4c5d9]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-[20px] font-semibold leading-[28px]">Đơn hàng gần đây</h4>
            <p className="text-[12px] leading-[16px] text-[#444656]">Quản lý {orders.length} giao dịch</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin/orders"
              className="px-4 py-2 text-[14px] leading-[20px] font-bold text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-lg transition-all"
            >
              Xem tất cả
            </Link>
            <button
              onClick={() => toast.info('Bộ lọc đang được phát triển!')}
              className="p-2 border border-[#c4c5d9] rounded-lg text-[#444656] hover:bg-[#e1dfff] transition-all"
            >
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#f5f2ff' }}>
                <th className="px-6 py-4 font-bold text-[14px] leading-[20px] font-medium uppercase tracking-wider text-[#444656] border-b border-[#c4c5d9]/30">Mã đơn</th>
                <th className="px-6 py-4 font-bold text-[14px] leading-[20px] font-medium uppercase tracking-wider text-[#444656] border-b border-[#c4c5d9]/30">Khách hàng</th>
                <th className="px-6 py-4 font-bold text-[14px] leading-[20px] font-medium uppercase tracking-wider text-[#444656] border-b border-[#c4c5d9]/30">Ngày</th>
                <th className="px-6 py-4 font-bold text-[14px] leading-[20px] font-medium uppercase tracking-wider text-[#444656] border-b border-[#c4c5d9]/30">Tổng</th>
                <th className="px-6 py-4 font-bold text-[14px] leading-[20px] font-medium uppercase tracking-wider text-[#444656] border-b border-[#c4c5d9]/30">Trạng thái</th>
                <th className="px-6 py-4 border-b border-[#c4c5d9]/30"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c5d9]/20">
              {recentOrders.map((order) => {
                const s = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING
                return (
                  <tr key={order.id} className="hover:bg-[#eeecff] transition-colors group">
                    <td className="px-6 py-4 font-bold text-[#3b82f6]">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#e1dfff] flex items-center justify-center font-bold text-xs">
                          {getInitials(order.id)}
                        </div>
                        <div>
                          <div className="text-[14px] leading-[20px] font-bold">KH #{order.id}</div>
                          <div className="text-[10px] uppercase" style={{ color: '#444656' }}>
                            {order.id % 5 === 0 ? 'VIP' : order.id % 3 === 0 ? 'New' : 'Member'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] leading-[20px] text-[#444656]">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 font-bold">{formatPrice(order.totalPrice)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text} inline-flex items-center gap-1`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => router.push(`/dashboard/admin/orders`)}
                        className="p-1 hover:bg-[#e1dfff] rounded text-[#747688] group-hover:text-[#3b82f6] transition-colors"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#444656] text-sm">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
