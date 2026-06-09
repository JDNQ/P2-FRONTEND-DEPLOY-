'use client'
import { useAllOrders } from '@/lib/hooks/useOrders'
import { formatPrice } from '@/lib/utils/formatPrice'
import { useState } from 'react'

const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  PENDING:   { label: 'CHỜ XÁC NHẬN', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  CONFIRMED: { label: 'ĐÃ XÁC NHẬN',   bg: 'bg-blue-100',   text: 'text-blue-700' },
  SHIPPING:  { label: 'ĐANG GIAO',      bg: 'bg-purple-100', text: 'text-purple-700' },
  DELIVERED: { label: 'HOÀN TẤT',       bg: 'bg-green-100',  text: 'text-green-700' },
  CANCELLED: { label: 'ĐÃ HỦY',         bg: 'bg-red-100',    text: 'text-red-700' },
}

const CUSTOMERS = [
  { name: 'Nguyễn Thành Trung', email: 'trung.nt@email.com', initials: 'NT', bg: '#9aa8ff', color: '#2a3a8a' },
  { name: 'Lê Anh Đào', email: 'dao.le@email.com', initials: 'LA', bg: '#4e4fe0', color: '#ffffff' },
  { name: 'Vương Hoàng Nam', email: 'nam.v@email.com', initials: 'VH', bg: '#bac3ff', color: '#001159' },
  { name: 'Trần Phương', email: 'phuong.t@email.com', initials: 'TP', bg: '#ffdad6', color: '#93000a' },
  { name: 'Phạm Minh Tâm', email: 'tam.pm@email.com', initials: 'PT', bg: '#9aa8ff', color: '#2a3a8a' },
  { name: 'Hoàng Kim Ngân', email: 'ngan.hk@email.com', initials: 'HN', bg: '#4e4fe0', color: '#ffffff' },
]

const BRANCHES = ['TL Flagship', 'TL Quận 1', 'TL Cầu Giấy', 'TL Đà Nẵng', 'TP HCM Hub']

function getCustomer(index: number) {
  return CUSTOMERS[index % CUSTOMERS.length]
}

function getBranch(index: number) {
  return BRANCHES[index % BRANCHES.length]
}

function getProfit(total: number) {
  return total * 0.25
}

export default function ManagerOrdersPage() {
  const { data: orders, isLoading } = useAllOrders()
  const [page, setPage] = useState(1)
  const list = orders || []
  const totalPages = Math.max(1, Math.ceil(list.length / 10))
  const paged = list.slice((page - 1) * 10, page * 10)
  const todayRevenue = list.filter((o) => o.status !== 'CANCELLED').reduce((s, o) => s + o.totalPrice, 0)
  const cancelledRate = list.length ? ((list.filter((o) => o.status === 'CANCELLED').length / list.length) * 100).toFixed(2) : '0'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-bold leading-[32px] text-[#08006c]">Quản Lý Đơn Hàng</h2>
          <p className="text-[14px] leading-[20px] text-[#444656]">Hệ thống giám sát giao dịch thời gian thực</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold border border-[#c4c5d9] text-[#444656] hover:bg-[#f5f2ff] transition-all">
            <span className="material-symbols-outlined">download</span>
            Xuất báo cáo
          </button>
          <button
            className="px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold text-white transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
              boxShadow: '0 4px 14px 0 rgba(30, 76, 253, 0.25)',
            }}
          >
            <span className="material-symbols-outlined">add</span>
            Tạo đơn mới
          </button>
        </div>
      </div>

      {/* Filters + Mini Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#fcf8ff]/80 p-6 rounded-2xl shadow-sm border border-[#c4c5d9]/50"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-semibold text-[#0035d1] flex items-center gap-2">
              <span className="material-symbols-outlined">filter_list</span>
              Bộ lọc hệ thống
            </h3>
            <span className="text-[12px] text-[#747688]">Cập nhật 2 phút trước</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Khu vực vận hành', 'Cửa hàng / Chi nhánh', 'Trạng thái tài chính'].map((label) => (
              <div key={label} className="space-y-1">
                <label className="text-[12px] font-bold text-[#444656] px-1">{label}</label>
                <select className="w-full bg-[#f5f2ff] border-[#c4c5d9] rounded-xl text-sm p-2.5 focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] outline-none transition-all">
                  <option>Tất cả</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Chart */}
        <div className="lg:col-span-4 bg-[#fcf8ff] p-6 rounded-2xl shadow-sm border border-[#c4c5d9]/50 overflow-hidden relative group">
          <h3 className="text-[20px] font-semibold text-[#3432c8]">Xu hướng đơn</h3>
          <p className="text-sm text-[#444656] mb-4">
            +12.5% so với hôm qua
          </p>
          <div className="h-16 flex items-end gap-1">
            {[40, 60, 35, 75, 90, 50, 65].map((h, i) => (
              <div
                key={i}
                className="w-full rounded-t transition-all duration-500 group-hover:opacity-80"
                style={{
                  height: `${h}%`,
                  backgroundColor: i === 4 ? '#0035d1' : 'rgba(30, 76, 253, 0.2)',
                }}
              />
            ))}
          </div>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#0035d1]/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng doanh thu', value: formatPrice(todayRevenue), extra: '+5.4%', border: '#0035d1', extraGreen: true },
          { label: 'Lợi nhuận ước tính', value: formatPrice(todayRevenue * 0.25), extra: '+2.1%', border: '#3432c8', extraGreen: true },
          { label: 'Đơn hàng mới', value: list.length.toLocaleString(), extra: 'Live', border: '#4958a9', extraBlue: true },
          { label: 'Tỷ lệ hủy đơn', value: `${cancelledRate}%`, extra: '-0.3%', border: '#ba1a1a', extraRed: true },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-[#fcf8ff]/80 p-5 rounded-2xl border border-[#c4c5d9]/50 flex flex-col gap-1"
            style={{ borderLeft: `4px solid ${kpi.border}`, backdropFilter: 'blur(12px)' }}
          >
            <p className="text-[12px] font-bold text-[#444656] uppercase tracking-tight">{kpi.label}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[24px] font-bold text-[#08006c]">{kpi.value}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  kpi.extraGreen ? 'text-green-600 bg-green-50' : ''
                } ${kpi.extraBlue ? 'text-[#0035d1] bg-[#0035d1]/10' : ''} ${
                  kpi.extraRed ? 'text-[#ba1a1a] bg-[#ffdad6]' : ''
                }`}
              >
                {kpi.extra}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Order Table */}
      <div className="bg-[#fcf8ff]/80 rounded-2xl shadow-sm border border-[#c4c5d9]/50 overflow-hidden"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        <div className="p-6 border-b border-[#c4c5d9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-[20px] font-semibold">Danh sách giao dịch hệ thống</h3>
          <div className="relative max-w-sm w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747688] text-sm">search</span>
            <input
              type="text"
              placeholder="Tìm mã đơn, tên khách, số điện thoại..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#f5f2ff] border-[#c4c5d9] rounded-xl text-sm focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] outline-none transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse bg-[#eeecff]" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f2ff] border-b border-[#c4c5d9]">
                  {['Mã đơn hàng', 'Khách hàng', 'Chi nhánh', 'Tổng tiền', 'Lợi nhuận', 'Trạng thái', 'Thao tác'].map((h) => (
                    <th key={h} className="px-6 py-4 text-sm font-bold text-[#444656] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d9]/30">
                {paged.map((order, i) => {
                  const status = STATUS_MAP[order.status] || STATUS_MAP.PENDING
                  const customer = getCustomer(order.id)
                  const branch = getBranch(order.id)
                  const profit = getProfit(order.totalPrice)
                  return (
                    <tr key={order.id} className="hover:bg-[#0035d1]/5 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0035d1]">#TL-{order.id.toString().padStart(5, '0')}</span>
                          <span className="text-[11px] text-[#747688]">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px]"
                            style={{ backgroundColor: customer.bg, color: customer.color }}
                          >
                            {customer.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{customer.name}</p>
                            <p className="text-[12px] text-[#747688]">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{branch}</td>
                      <td className="px-6 py-4 font-bold">{formatPrice(order.totalPrice)}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">+{formatPrice(profit)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-2 hover:bg-[#e1dfff] rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[#747688]">visibility</span>
                          </button>
                          <button className="p-2 hover:bg-[#e1dfff] rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[#747688]">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-[#c4c5d9] flex items-center justify-between">
          <p className="text-[12px] text-[#747688]">Hiển thị {paged.length} trong {list.length} đơn hàng</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center border border-[#c4c5d9] rounded-lg hover:bg-[#e1dfff] text-[#747688] disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-[12px] transition-colors ${
                  page === n
                    ? 'bg-[#1e4cfd] text-white'
                    : 'border border-[#c4c5d9] hover:bg-[#e1dfff] text-[#444656]'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-[#c4c5d9] rounded-lg hover:bg-[#e1dfff] text-[#747688] disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar{width:4px;height:4px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background:#c4c5d9;border-radius:10px}`}</style>
    </div>
  )
}
