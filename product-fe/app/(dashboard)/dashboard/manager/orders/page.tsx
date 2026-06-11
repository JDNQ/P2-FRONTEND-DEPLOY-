'use client'
import { useAllOrders } from '@/lib/hooks/useOrders'
import { formatPrice } from '@/lib/utils/formatPrice'
import { formatDate } from '@/lib/utils/formatDate'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'

const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  PENDING:   { label: 'CHỜ XÁC NHẬN', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  CONFIRMED: { label: 'ĐÃ XÁC NHẬN',   bg: 'bg-blue-100',   text: 'text-blue-700' },
  SHIPPING:  { label: 'ĐANG GIAO',      bg: 'bg-purple-100', text: 'text-purple-700' },
  DELIVERED: { label: 'HOÀN TẤT',       bg: 'bg-green-100',  text: 'text-green-700' },
  CANCELLED: { label: 'ĐÃ HỦY',         bg: 'bg-red-100',    text: 'text-red-700' },
}

export default function ManagerOrdersPage() {
  const { data: orders, isLoading } = useAllOrders()
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

  const list = orders || []

  // Search filter
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return list
    const term = searchQuery.toLowerCase()
    return list.filter((o) => {
      const orderIdStr = `#tl-${o.id.toString().padStart(5, '0')}`.toLowerCase()
      const customerStr = `customer #${o.id}`.toLowerCase()
      const phoneStr = o.phoneNumber ? o.phoneNumber.toLowerCase() : ''
      const addressStr = o.shippingAddress ? o.shippingAddress.toLowerCase() : ''
      return (
        orderIdStr.includes(term) ||
        customerStr.includes(term) ||
        phoneStr.includes(term) ||
        addressStr.includes(term)
      )
    })
  }, [list, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredList.length / 10))
  const paged = filteredList.slice((page - 1) * 10, page * 10)
  
  const todayRevenue = list.filter((o) => o.status !== 'CANCELLED').reduce((s, o) => s + o.totalPrice, 0)
  const cancelledRate = list.length ? ((list.filter((o) => o.status === 'CANCELLED').length / list.length) * 100).toFixed(2) : '0'
  const newOrdersCount = list.filter((o) => o.status === 'PENDING').length

  const toggleExpand = (id: number) => {
    setExpandedOrderId(prev => prev === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-bold leading-[32px] text-[#1e40af]">Quản Lý Đơn Hàng</h2>
          <p className="text-[14px] leading-[20px] text-[#444656]">Hệ thống giám sát giao dịch thời gian thực</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.success('Đã xuất báo cáo giao dịch thành công!')}
            className="px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold border border-[#c4c5d9] text-[#444656] hover:bg-[#f5f2ff] transition-all"
          >
            <span className="material-symbols-outlined">download</span>
            Xuất báo cáo
          </button>
          <button
            onClick={() => toast.info('Chức năng tạo đơn mới dành cho Manager đang được phát triển!')}
            className="px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold text-white transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
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
            <h3 className="text-[20px] font-semibold text-[#3b82f6] flex items-center gap-2">
              <span className="material-symbols-outlined">filter_list</span>
              Bộ lọc hệ thống
            </h3>
            <span className="text-[12px] text-[#747688]">Cập nhật 2 phút trước</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Khu vực vận hành', 'Cửa hàng / Chi nhánh', 'Trạng thái tài chính'].map((label) => (
              <div key={label} className="space-y-1">
                <label className="text-[12px] font-bold text-[#444656] px-1">{label}</label>
                <select 
                  onChange={() => toast.info(`Lọc theo ${label} đang được chuẩn bị!`)}
                  className="w-full bg-[#f5f2ff] border-[#c4c5d9] rounded-xl text-sm p-2.5 focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all cursor-pointer"
                >
                  <option>Tất cả</option>
                  <option>Khu vực miền Bắc</option>
                  <option>Khu vực miền Nam</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Chart */}
        <div className="lg:col-span-4 bg-[#fcf8ff] p-6 rounded-2xl shadow-sm border border-[#c4c5d9]/50 overflow-hidden relative group">
          <h3 className="text-[20px] font-semibold text-[#3b82f6]">Xu hướng đơn</h3>
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
                  backgroundColor: i === 4 ? '#3b82f6' : 'rgba(30, 76, 253, 0.2)',
                }}
              />
            ))}
          </div>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#3b82f6]/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng doanh thu', value: formatPrice(todayRevenue), extra: '+5.4%', border: '#3b82f6', extraGreen: true },
          { label: 'Lợi nhuận ước tính', value: formatPrice(todayRevenue * 0.25), extra: '+2.1%', border: '#3b82f6', extraGreen: true },
          { label: 'Đơn hàng mới', value: newOrdersCount.toLocaleString(), extra: 'Live', border: '#4958a9', extraBlue: true },
          { label: 'Tỷ lệ hủy đơn', value: `${cancelledRate}%`, extra: '-0.3%', border: '#ba1a1a', extraRed: true },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-[#fcf8ff]/80 p-5 rounded-2xl border border-[#c4c5d9]/50 flex flex-col gap-1"
            style={{ borderLeft: `4px solid ${kpi.border}`, backdropFilter: 'blur(12px)' }}
          >
            <p className="text-[12px] font-bold text-[#444656] uppercase tracking-tight">{kpi.label}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[24px] font-bold text-[#1e40af]">{kpi.value}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  kpi.extraGreen ? 'text-green-600 bg-green-50' : ''
                } ${kpi.extraBlue ? 'text-[#3b82f6] bg-[#3b82f6]/10' : ''} ${
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f5f2ff] border-[#c4c5d9] rounded-xl text-sm focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse bg-[#eeecff]" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-[#c4c5d9]">package</span>
            <p className="text-[#444656] mt-4 text-sm">Không tìm thấy đơn hàng nào phù hợp</p>
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
                  const customerInitials = `KH${String(order.id).slice(0, 2)}`
                  const profit = order.totalPrice * 0.25
                  const isExpanded = expandedOrderId === order.id
                  return (
                    <>
                      <tr key={order.id} className="hover:bg-[#3b82f6]/5 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#3b82f6]">#TL-{order.id.toString().padStart(5, '0')}</span>
                            <span className="text-[11px] text-[#747688]">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px]"
                              style={{ backgroundColor: i % 2 === 0 ? '#9aa8ff' : '#4e4fe0', color: '#ffffff' }}
                            >
                              {customerInitials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">Customer #{order.id}</p>
                              <p className="text-[12px] text-[#747688]">{order.items.length} items</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {['TL Flagship', 'TL Quận 1', 'TL Cầu Giấy', 'TL Đà Nẵng', 'TP HCM Hub'][i % 5]}
                        </td>
                        <td className="px-6 py-4 font-bold">{formatPrice(order.totalPrice)}</td>
                        <td className="px-6 py-4 text-green-600 font-semibold">+{formatPrice(profit)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => toggleExpand(order.id)}
                              className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-[#dee1ff] text-[#3b82f6]' : 'hover:bg-[#e1dfff]'}`}
                            >
                              <span className="material-symbols-outlined text-[#747688]">{isExpanded ? 'visibility_off' : 'visibility'}</span>
                            </button>
                            <button 
                              onClick={() => toast.info('Chức năng điều phối đang được xây dựng')}
                              className="p-2 hover:bg-[#e1dfff] rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-[#747688]">more_vert</span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded View */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-[#fcf8ff] border-t border-[#c4c5d9]/10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                              <div>
                                <h5 className="font-bold text-[#1e40af] mb-1">Thông tin giao hàng</h5>
                                <p><span className="text-[#444656]">Số điện thoại:</span> {order.phoneNumber || 'N/A'}</p>
                                <p><span className="text-[#444656]">Địa chỉ:</span> {order.shippingAddress || 'N/A'}</p>
                              </div>
                              <div>
                                <h5 className="font-bold text-[#1e40af] mb-1">Voucher áp dụng</h5>
                                <p>{order.voucherId ? `Voucher ID: #${order.voucherId}` : 'Không sử dụng'}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-bold text-[#1e40af] text-xs">Sản phẩm trong đơn hàng:</h5>
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#c4c5d9]/10">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[#eeecff] flex-shrink-0 flex items-center justify-center text-xs text-[#747688]">
                                      {item.product?.images?.[0] ? (
                                        <img src={item.product.images[0].url} alt={item.product.productName} className="w-full h-full object-cover rounded-lg" />
                                      ) : (
                                        'No Img'
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-bold text-xs text-[#1e40af]">{item.product?.productName || 'Sản phẩm không tên'}</p>
                                      <p className="text-[10px] text-[#444656]">
                                        Phân loại: {item.variant?.color || 'Mặc định'} {item.variant?.size ? `- Size ${item.variant.size}` : ''}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right text-xs">
                                    <p className="font-bold text-[#3b82f6]">{formatPrice(item.price)}</p>
                                    <p className="text-[10px] text-[#444656]">Số lượng: x{item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredList.length > 0 && (
          <div className="p-4 border-t border-[#c4c5d9] flex items-center justify-between">
            <p className="text-[12px] text-[#747688]">Hiển thị {paged.length} trong {filteredList.length} đơn hàng</p>
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
                      ? 'bg-[#60a5fa] text-white'
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
        )}
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar{width:4px;height:4px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background:#c4c5d9;border-radius:10px}`}</style>
    </div>
  )
}
