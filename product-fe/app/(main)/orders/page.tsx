'use client'
import { useMyOrders } from '@/lib/hooks/useOrders'
import { formatPrice } from '@/lib/utils/formatPrice'
import { formatDate } from '@/lib/utils/formatDate'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
  SHIPPING:  { label: 'Shipping',  bg: 'bg-primary-container/30', text: 'text-primary',  icon: 'local_shipping', iconFill: true },
  DELIVERED: { label: 'Delivered', bg: 'bg-green-100',  text: 'text-green-700',  icon: 'check_circle', iconFill: true },
  CANCELLED: { label: 'Cancelled', bg: 'bg-error-container/20', text: 'text-error',  icon: 'cancel', iconFill: true },
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
      <div className="min-h-screen bg-background text-on-surface">
        <Header />
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg animate-pulse">
          <div className="h-8 bg-surface-container-high rounded w-1/3 mb-stack-lg" />
          <div className="h-6 bg-surface-container-high rounded w-2/3 mb-stack-lg" />
          <div className="space-y-stack-lg">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-surface-container-high rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
        <header className="mb-stack-lg">
          <h1 className="font-heading text-headline-lg text-on-surface mb-1">My Orders</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">View and track all your purchases and order history.</p>
        </header>

        {/* Status Tabs */}
        <div className="mb-stack-lg overflow-x-auto pb-2">
          <div className="flex gap-2 border-b border-outline-variant min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-label-md text-label-md whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'border-b-2 border-primary text-primary font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {orderList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-section-gap text-center">
            <span className="material-symbols-outlined text-[80px] text-outline-variant mb-stack-md">package</span>
            <h2 className="font-heading text-headline-sm text-on-surface mb-1">No orders yet</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">
              {activeTab === 'All Orders' ? 'Start shopping to see your orders here.' : `No ${activeTab.toLowerCase()} orders found.`}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary font-heading font-bold px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-stack-lg">
            {orderList.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
              const isCancelled = order.status === 'CANCELLED'
              const productImages = order.items.map((i) => i.product?.images?.[0]?.url).filter(Boolean) as string[]
              const displayImages = productImages.slice(0, 3)
              const remaining = productImages.length - 3

              return (
                <div
                  key={order.id}
                  className="rounded-2xl shadow-sm border border-neutral-50 transition-all overflow-hidden bg-white"
                  style={{
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
                  <div className="p-stack-md border-b border-neutral-100 flex flex-wrap justify-between items-center bg-surface-container-low">
                    <div className="flex gap-4 items-center">
                      <div>
                        <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Order ID</span>
                        <p className="font-label-md text-label-md font-bold text-on-surface">#{order.id}</p>
                      </div>
                      <div className="w-px h-8 bg-outline-variant" />
                      <div>
                        <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Date</span>
                        <p className="font-label-md text-label-md text-on-surface">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-caption text-caption font-medium flex items-center gap-1 ${cfg.bg} ${cfg.text}`}>
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: cfg.iconFill ? "'FILL' 1" : "'FILL' 0" }}>{cfg.icon}</span>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-stack-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      {displayImages.length > 0 ? (
                        <div className="flex" style={{ marginRight: remaining > 0 ? 0 : undefined }}>
                          {displayImages.map((url, idx) => (
                            <img key={idx} src={url} alt={`Product ${idx + 1}`}
                              className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                              style={{ marginLeft: idx > 0 ? '-16px' : '0', zIndex: 30 - idx }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                          ))}
                          {remaining > 0 && (
                            <div className="w-16 h-16 rounded-lg flex items-center justify-center border-2 border-white shadow-sm text-on-surface-variant font-label-md bg-surface-container-high" style={{ marginLeft: '-16px', zIndex: 10 }}>
                              +{remaining}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-surface-container-high">
                          <span className="material-symbols-outlined text-outline">inventory_2</span>
                        </div>
                      )}
                      <div>
                        <p className="font-label-md text-label-md font-bold text-on-surface">{order.items[0]?.product?.productName || 'Order items'}</p>
                        {order.items.length > 1 && (
                          <p className="font-caption text-caption text-on-surface-variant">+{order.items.length - 1} more item(s)</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end">
                      <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
                        {isCancelled ? 'Refunded Amount' : 'Total Amount'}
                      </span>
                      <p className="font-price-display text-price-display text-primary">{formatPrice(order.totalPrice)}</p>
                    </div>

                    <button
                      className="w-full md:w-auto px-6 py-3 border-2 border-neutral-100 rounded-xl font-label-md transition-all active:scale-95 flex items-center justify-center gap-2 bg-white hover:bg-primary hover:text-white hover:border-transparent"
                      onClick={() => {
                        if (isCancelled) { router.push('/products') }
                        else { router.push(`/checkout/success`) }
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
      <Footer />
    </div>
  )
}
