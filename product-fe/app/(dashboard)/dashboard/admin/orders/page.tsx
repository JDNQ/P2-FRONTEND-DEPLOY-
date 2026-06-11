'use client'
import { useAllOrders, useUpdateOrderStatus } from '@/lib/hooks/useOrders'
import { formatPrice } from '@/lib/utils/formatPrice'
import { formatDate } from '@/lib/utils/formatDate'
import { useState } from 'react'
import { toast } from 'sonner'
import type { OrderStatus } from '@/lib/types/order'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:   { label: 'Chờ xác nhận', className: 'bg-amber-100 text-amber-700 border border-amber-200' },
  CONFIRMED: { label: 'Đã xác nhận',  className: 'bg-blue-100 text-blue-700 border border-blue-200' },
  SHIPPING:  { label: 'Đang giao',    className: 'bg-purple-100 text-purple-700 border border-purple-200' },
  DELIVERED: { label: 'Đã giao',      className: 'bg-green-100 text-green-700 border border-green-200' },
  CANCELLED: { label: 'Đã hủy',       className: 'bg-red-100 text-red-700 border border-red-200' },
}

const TABS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ xác nhận', value: 'PENDING' },
  { label: 'Đã xác nhận', value: 'CONFIRMED' },
  { label: 'Đang giao', value: 'SHIPPING' },
  { label: 'Đã giao', value: 'DELIVERED' },
  { label: 'Đã hủy', value: 'CANCELLED' },
]

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '??'
}

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useAllOrders()
  const { mutate: updateStatus } = useUpdateOrderStatus()
  const [activeTab, setActiveTab] = useState<OrderStatus | 'ALL'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const pageSize = 5

  const filtered = !orders ? [] : activeTab === 'ALL'
    ? orders
    : orders.filter((o) => o.status === activeTab)

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const tabCounts = TABS.map((t) => ({
    ...t,
    count: t.value === 'ALL' ? (orders?.length || 0) : (orders?.filter((o) => o.status === t.value).length || 0),
  }))

  const toggleExpand = (id: number) => {
    setExpandedOrderId(prev => prev === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#08006c]">Order Management</h2>
          <p className="text-sm text-[#444656]">Track and manage all customer purchases in real-time.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toast.success('Đã xuất dữ liệu đơn hàng thành công!')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c4c5d9] rounded-xl text-sm hover:bg-[#e1dfff] transition-all"
          >
            <span className="material-symbols-outlined">file_download</span> Export
          </button>
          <button 
            onClick={() => toast.success('Đã gửi yêu cầu in ấn hàng loạt!')}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-xl font-bold text-sm transition-all orange-gradient orange-glow"
          >
            <span className="material-symbols-outlined">print</span> Print Batch
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#c4c5d9] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-6 min-w-max">
          {tabCounts.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setCurrentPage(1) }}
              className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
                activeTab === tab.value
                  ? 'border-[#0035d1] text-[#0035d1]'
                  : 'border-transparent text-[#444656] hover:text-[#0035d1]'
              }`}
            >
              {tab.label}
              <span className={`px-2 rounded-full text-[10px] ${
                activeTab === tab.value
                  ? 'bg-[#dee1ff] text-[#0035d1]'
                  : 'bg-[#eeecff] text-[#444656]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-neutral-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : paged.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-[#c4c5d9]">package</span>
          <p className="text-[#444656] mt-4">No orders found</p>
        </div>
      ) : (
        <>
          {/* Table Header (Desktop) */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-[#f5f2ff] rounded-xl text-xs uppercase tracking-wider text-[#444656] font-bold border border-[#c4c5d9]/30">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Total Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {paged.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
              const itemCount = order.items.length
              const randomName = `Customer #${order.id}`
              const isExpanded = expandedOrderId === order.id

              return (
                <div key={order.id} className="flex flex-col bg-white rounded-2xl border border-[#c4c5d9]/30 shadow-sm overflow-hidden">
                  <div
                    className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 px-6 py-5 transition-all duration-300 hover:bg-[#fcf8ff]"
                  >
                    <div className="col-span-2 flex flex-col">
                      <span className="font-bold text-[#0035d1]">#TLM-{order.id}</span>
                      <span className="text-xs text-[#444656]">
                        {itemCount} sản phẩm
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f5f2ff] flex items-center justify-center text-[#0035d1] font-bold text-sm">
                        {getInitials(randomName)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{randomName}</span>
                        <span className="text-xs text-[#444656]">
                          {itemCount} items
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 text-sm text-[#444656]">
                      {formatDate(order.createdAt)}
                    </div>
                    <div className="col-span-2 text-lg font-bold text-[#0035d1]">
                      {formatPrice(order.totalPrice)}
                    </div>
                    <div className="col-span-2">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          updateStatus({ id: order.id, status: e.target.value })
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.className} cursor-pointer outline-none`}
                      >
                        {Object.keys(STATUS_CONFIG).map((st) => (
                          <option key={st} value={st} className="text-black bg-white">
                            {STATUS_CONFIG[st as OrderStatus].label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button 
                        onClick={() => toggleExpand(order.id)}
                        className={`p-2 rounded-lg transition-all ${isExpanded ? 'bg-[#dee1ff] text-[#0035d1]' : 'bg-[#f5f2ff] hover:bg-[#e1dfff] text-[#444656]'}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{isExpanded ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 bg-[#fcf8ff] border-t border-[#c4c5d9]/20 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-bold text-[#08006c] mb-1">Thông tin giao hàng</h5>
                          <p><span className="text-[#444656]">Số điện thoại:</span> {order.phoneNumber || 'N/A'}</p>
                          <p><span className="text-[#444656]">Địa chỉ:</span> {order.shippingAddress || 'N/A'}</p>
                        </div>
                        <div>
                          <h5 className="font-bold text-[#08006c] mb-1">Mã giảm giá áp dụng</h5>
                          <p>{order.voucherId ? `Mã ID: #${order.voucherId}` : 'Không sử dụng'}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-bold text-[#08006c] mb-2">Chi tiết sản phẩm ({itemCount})</h5>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#c4c5d9]/10">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#eeecff] overflow-hidden flex-shrink-0">
                                  {item.product?.images?.[0] ? (
                                    <img src={item.product.images[0].url} alt={item.product.productName} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-[#c4c5d9]">No Img</div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-[#08006c]">{item.product?.productName || 'Sản phẩm không tên'}</p>
                                  <p className="text-xs text-[#444656]">
                                    Phân loại: {item.variant?.color || 'Mặc định'} {item.variant?.size ? `- Size ${item.variant.size}` : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm text-[#0035d1]">{formatPrice(item.price)}</p>
                                <p className="text-xs text-[#444656]">Số lượng: x{item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <span className="text-xs text-[#444656]">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} orders
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#c4c5d9] text-[#444656] hover:bg-[#eeecff] transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                    currentPage === page
                      ? 'bg-[#dee1ff] text-[#0035d1]'
                      : 'bg-white border border-[#c4c5d9] text-[#444656] hover:bg-[#eeecff]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#c4c5d9] text-[#444656] hover:bg-[#eeecff] transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
