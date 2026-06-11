'use client'
import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from '@/lib/hooks/useNotifications'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const FILTERS = ['All', 'order', 'promo', 'system']
const TYPE_LABEL: Record<string, string> = { order: 'Orders', promo: 'Promotions', system: 'System' }
const TYPE_ICON: Record<string, string> = { order: 'package_2', promo: 'sell', system: 'security' }
const TYPE_COLOR: Record<string, string> = { order: 'text-primary', promo: 'text-tertiary', system: 'text-secondary' }
const ITEMS_PER_PAGE = 5

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications()
  const { mutate: markRead } = useMarkNotificationRead()
  const { mutate: markAllRead } = useMarkAllNotificationsRead()
  const { mutate: deleteNotification } = useDeleteNotification()
  const [activeFilter, setActiveFilter] = useState('All')
  const [page, setPage] = useState(1)

  const filtered = activeFilter === 'All'
    ? notifications
    : notifications.filter(n => n.type === activeFilter)

  const visibleNotifications = filtered.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = filtered.length > visibleNotifications.length

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <div className="max-w-5xl mx-auto px-gutter py-stack-lg">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-lg">
          <div>
            <nav className="flex items-center gap-2 font-caption text-caption text-on-surface-variant mb-1">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="font-bold text-primary">Notifications</span>
            </nav>
            <h1 className="font-heading text-headline-lg text-on-surface">Your Notifications</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Stay updated with your orders and latest offers.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { markAllRead(); toast.success('Đã đánh dấu đọc tất cả thông báo!') }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-label-md active:scale-[0.98] text-primary hover:bg-primary-container/20">
              <span className="material-symbols-outlined text-[20px]">done_all</span>
              Mark all as read
            </button>
            <button onClick={() => toast.info('Tính năng tùy chỉnh cài đặt thông báo đang được phát triển!')}
              className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-stack-lg overflow-x-auto pb-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => { setActiveFilter(f); setPage(1) }}
              className={`px-6 py-2.5 rounded-full font-label-md text-label-md transition-all ${
                activeFilter === f
                  ? 'orange-gradient text-white shadow-md'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-stack-md">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-surface rounded-xl animate-pulse border border-outline-variant" />
            ))}
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-section-gap text-center">
            <span className="material-symbols-outlined text-[80px] text-outline-variant mb-stack-md">notifications_off</span>
            <h2 className="font-heading text-headline-sm text-on-surface mb-1">No notifications</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">You&apos;re all caught up!</p>
            <Link href="/products" className="bg-primary text-on-primary font-label-md px-8 py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-stack-md">
            {visibleNotifications.map((n) => {
              const categoryColor = TYPE_COLOR[n.type] || 'text-secondary'
              const icon = TYPE_ICON[n.type] || 'notifications'
              const typeLabel = TYPE_LABEL[n.type] || n.type
              return (
                <div key={n.id}
                  className={`relative overflow-hidden rounded-xl border transition-all hover:shadow-lg hover:-translate-y-0.5 group cursor-pointer ${!n.isRead ? 'bg-white/80 border-l-4 border-l-primary' : 'bg-white border-l-4 border-l-transparent'} border-outline-variant`}
                  onClick={() => { if (!n.isRead) markRead(n.id) }}>
                  <div className="p-stack-md flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary-container/10">
                      <span className={`material-symbols-outlined ${categoryColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`font-label-md text-label-md font-bold ${categoryColor}`}>{typeLabel}</span>
                        <span className="font-caption text-caption text-on-surface-variant flex-shrink-0 ml-2">
                          {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-heading text-headline-sm text-on-surface mb-1">{n.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{n.message}</p>
                    </div>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id) }}
                      className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {hasMore && (
          <div className="mt-section-gap flex flex-col items-center">
            <button onClick={() => setPage(p => p + 1)}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-label-md bg-surface-variant text-on-surface hover:bg-primary hover:text-on-primary">
              Load more history
              <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">expand_more</span>
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
