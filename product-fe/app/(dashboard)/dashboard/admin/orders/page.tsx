'use client'
import { useAllOrders } from '@/lib/hooks/useOrders'
import { formatPrice } from '@/lib/utils/formatPrice'
import { formatDate } from '@/lib/utils/formatDate'
import { useState } from 'react'
import type { OrderStatus } from '@/types/order'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:   { label: 'Chờ xác nhận', className: 'bg-amber-100 text-gold border border-gold/20' },
  CONFIRMED: { label: 'Đã xác nhận',  className: 'bg-blue-100 text-info border border-info/20' },
  SHIPPING:  { label: 'Đang giao',    className: 'bg-purple-100 text-tertiary border border-tertiary/20' },
  DELIVERED: { label: 'Đã giao',      className: 'bg-green-100 text-success border border-success/20' },
  CANCELLED: { label: 'Đã hủy',      className: 'bg-red-100 text-error border border-error/20' },
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
  const [activeTab, setActiveTab] = useState<OrderStatus | 'ALL'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-m3-on-surface">Order Management</h2>
          <p className="text-sm text-m3-on-surface-variant">Track and manage all customer purchases in real-time.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-m3-outline-variant rounded-xl text-sm hover:bg-m3-surface-container transition-all">
            <span className="material-symbols-outlined">file_download</span> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-white rounded-xl font-bold text-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.3)'
            }}
          >
            <span className="material-symbols-outlined">print</span> Print Batch
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-m3-outline-variant overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-6 min-w-max">
          {tabCounts.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setCurrentPage(1) }}
              className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
                activeTab === tab.value
                  ? 'border-m3-primary text-m3-primary'
                  : 'border-transparent text-m3-on-surface-variant hover:text-m3-primary'
              }`}
            >
              {tab.label}
              <span className={`px-2 rounded-full text-[10px] ${
                activeTab === tab.value
                  ? 'bg-m3-primary-fixed text-m3-primary'
                  : 'bg-m3-surface-container-high text-m3-on-surface-variant'
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
          <span className="material-symbols-outlined text-6xl text-m3-outline-variant">package</span>
          <p className="text-m3-on-surface-variant mt-4">No orders found</p>
        </div>
      ) : (
        <>
          {/* Table Header (Desktop) */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-m3-surface-container-low rounded-xl text-xs uppercase tracking-wider text-m3-on-surface-variant font-bold border border-m3-outline-variant/30">
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
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 px-6 py-5 bg-white rounded-2xl border border-m3-outline-variant/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="col-span-2 flex flex-col">
                    <span className="font-bold text-m3-primary">#TLM-{order.id}</span>
                    <span className="text-xs text-m3-on-surface-variant">
                      {itemCount} sản phẩm
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-m3-surface-container-highest flex items-center justify-center text-m3-primary font-bold text-sm">
                      {getInitials(randomName)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{randomName}</span>
                      <span className="text-xs text-m3-on-surface-variant">
                        {itemCount} items
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-m3-on-surface-variant">
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="col-span-2 text-lg font-bold text-m3-primary">
                    {formatPrice(order.totalPrice)}
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button className="p-2 bg-m3-surface-container-high hover:bg-m3-primary-container hover:text-on-primary-container rounded-lg transition-all">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <span className="text-xs text-m3-on-surface-variant">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} orders
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-m3-outline-variant text-m3-on-surface-variant hover:bg-m3-primary-container hover:text-on-primary-container transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                    currentPage === page
                      ? 'bg-m3-primary-container text-on-primary-container'
                      : 'bg-white border border-m3-outline-variant text-m3-on-surface-variant hover:bg-m3-primary-container hover:text-on-primary-container'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-m3-outline-variant text-m3-on-surface-variant hover:bg-m3-primary-container hover:text-on-primary-container transition-all disabled:opacity-50"
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
