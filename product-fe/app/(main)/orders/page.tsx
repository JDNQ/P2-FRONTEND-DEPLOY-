'use client'
import { useMyOrders } from '@/lib/hooks/useOrders'
import { formatPrice } from '@/lib/utils/formatPrice'
import { formatDate } from '@/lib/utils/formatDate'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TABS = ['All Orders', 'Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled']
const TAB_KEY_MAP: Record<string, string | undefined> = {
  'All Orders': undefined,
  'Pending': 'PENDING',
  'Confirmed': 'CONFIRMED',
  'Shipping': 'SHIPPING',
  'Delivered': 'DELIVERED',
  'Cancelled': 'CANCELLED',
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string; iconFill?: boolean }> = {
  PENDING:   { label: 'Pending',   bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'schedule' },
  CONFIRMED: { label: 'Confirmed', bg: 'bg-blue-100',   text: 'text-blue-700',   icon: 'check_circle', iconFill: true },
  SHIPPING:  { label: 'Shipping',  bg: 'bg-[#dee1ff]',  text: 'text-[#0035d1]',  icon: 'local_shipping', iconFill: true },
  DELIVERED: { label: 'Delivered', bg: 'bg-green-100',  text: 'text-green-700',  icon: 'check_circle', iconFill: true },
  CANCELLED: { label: 'Cancelled', bg: 'bg-[#ffdad6]',  text: 'text-[#93000a]',  icon: 'cancel', iconFill: true },
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useMyOrders()
  const [activeTab, setActiveTab] = useState('All Orders')
  const router = useRouter()

  const orderList = (orders || []).filter((o) => {
    const key = TAB_KEY_MAP[activeTab]
    return key ? o.status === key : true
  })

  if (isLoading) {
    return (
      <div className="min-h-screen pb-16" style={{ backgroundColor: '#fcf8ff', color: '#08006c' }}>
        <div className="max-w-[1280px] mx-auto px-4 py-16 animate-pulse">
          <div className="h-8 bg-[#eeecff] rounded w-1/3 mb-8" />
          <div className="h-6 bg-[#eeecff] rounded w-2/3 mb-8" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-[#eeecff] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: '#fcf8ff', color: '#08006c' }}>
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-[30px] font-bold leading-[40px]">My Orders</h1>
          <p className="text-[#444656] text-[16px] leading-[24px]">View and track all your purchases and order history.</p>
        </header>

        {/* Status Tabs */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 border-b border-[#c4c5d9] min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-[14px] leading-[20px] font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'border-b-2 border-[#0035d1] text-[#0035d1] font-bold'
                    : 'text-[#444656] hover:text-[#0035d1]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {orderList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[80px] text-[#c4c5d9] mb-4">package</span>
            <h2 className="text-[24px] font-bold mb-2">No orders yet</h2>
            <p className="text-[#444656] mb-8 text-[16px]">
              {activeTab === 'All Orders' ? 'Start shopping to see your orders here.' : `No ${activeTab.toLowerCase()} orders found.`}
            </p>
            <Link
              href="/products"
              className="text-white px-8 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all inline-block"
              style={{
                background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
                boxShadow: '0 4px 14px 0 rgba(30, 76, 253, 0.25)'
              }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orderList.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
              const isCancelled = order.status === 'CANCELLED'
              const productImages = order.items.map((i) => i.product?.images?.[0]?.url).filter(Boolean) as string[]
              const displayImages = productImages.slice(0, 3)
              const remaining = productImages.length - 3

              return (
                <div
                  key={order.id}
                  className="rounded-xl shadow-sm border border-transparent hover:border-[#1e4cfd] hover:shadow-lg transition-all duration-300 overflow-hidden"
                  style={{
                    backgroundColor: '#ffffff',
                    opacity: isCancelled ? 0.75 : 1,
                    filter: isCancelled ? 'grayscale(0.5)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (isCancelled) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'grayscale(0)' }
                  }}
                  onMouseLeave={(e) => {
                    if (isCancelled) { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.filter = 'grayscale(0.5)' }
                  }}
                >
                  {/* Card Header */}
                  <div
                    className="p-4 border-b flex flex-wrap justify-between items-center"
                    style={{ borderColor: '#eeecff', backgroundColor: '#f5f2ff' }}
                  >
                    <div className="flex gap-4 items-center">
                      <div>
                        <span className="text-[12px] leading-[16px] text-[#444656] uppercase tracking-wider">Order ID</span>
                        <p className="text-[14px] leading-[20px] font-bold">#{order.id}</p>
                      </div>
                      <div className="w-px h-8" style={{ backgroundColor: '#c4c5d9' }} />
                      <div>
                        <span className="text-[12px] leading-[16px] text-[#444656] uppercase tracking-wider">Date</span>
                        <p className="text-[14px] leading-[20px]">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] leading-[16px] font-medium flex items-center gap-1 ${cfg.bg} ${cfg.text}`}
                    >
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: cfg.iconFill ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {cfg.icon}
                      </span>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      {displayImages.length > 0 ? (
                        <div className="flex" style={{ marginRight: remaining > 0 ? 0 : undefined }}>
                          {displayImages.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`Product ${idx + 1}`}
                              className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                              style={{
                                marginLeft: idx > 0 ? '-16px' : '0',
                                zIndex: 30 - idx,
                              }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ))}
                          {remaining > 0 && (
                            <div className="w-16 h-16 rounded-lg flex items-center justify-center border-2 border-white shadow-sm text-[#444656] text-[14px] leading-[20px] font-medium" style={{ marginLeft: '-16px', zIndex: 10, backgroundColor: '#eeecff' }}>
                              +{remaining}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eeecff' }}>
                          <span className="material-symbols-outlined text-[#747688]">inventory_2</span>
                        </div>
                      )}
                      <div>
                        <p className="text-[14px] leading-[20px] font-bold">{order.items[0]?.product?.productName || 'Order items'}</p>
                        {order.items.length > 1 && (
                          <p className="text-[12px] leading-[16px] text-[#444656]">+{order.items.length - 1} more item(s)</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end">
                      <span className="text-[12px] leading-[16px] text-[#444656] uppercase tracking-wider">
                        {isCancelled ? 'Refunded Amount' : 'Total Amount'}
                      </span>
                      <p className="text-[20px] font-semibold leading-[28px] text-[#0035d1]">{formatPrice(order.totalPrice)}</p>
                    </div>

                    <button
                      className="w-full md:w-auto px-6 py-3 border rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-[14px] leading-[20px] font-medium"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#c4c5d9',
                        color: isCancelled ? '#444656' : '#0035d1',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isCancelled ? '#e1dfff' : '#1e4cfd'
                        e.currentTarget.style.color = '#ffffff'
                        e.currentTarget.style.borderColor = 'transparent'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff'
                        e.currentTarget.style.borderColor = '#c4c5d9'
                        e.currentTarget.style.color = isCancelled ? '#444656' : '#0035d1'
                      }}
                      onClick={() => {
                        if (isCancelled) {
                          router.push('/products')
                        } else {
                          router.push(`/checkout/success`)
                        }
                      }}
                    >
                      <span>{isCancelled ? 'Buy Again' : order.status === 'SHIPPING' ? 'Track Order' : 'View Details'}</span>
                      <span className="material-symbols-outlined text-[18px]">
                        {isCancelled ? 'replay' : order.status === 'SHIPPING' ? 'map' : 'chevron_right'}
                      </span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
