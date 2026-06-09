'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from '@/lib/hooks/useNotifications'

const FILTERS = ['All', 'Orders', 'Promotions', 'System']

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

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: '#fcf8ff', color: '#08006c' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb + Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <nav className="flex items-center gap-2 text-[#444656] text-[14px] leading-[20px] font-medium mb-2">
              <Link href="/" className="hover:text-[#0035d1] transition-colors">Home</Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="font-bold" style={{ color: '#0035d1' }}>Notifications</span>
            </nav>
            <h1 className="text-[30px] font-bold leading-[40px]">Your Notifications</h1>
            <p className="text-[#444656] text-[16px] leading-[24px] mt-1">Stay updated with your orders and latest offers.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => markAllRead()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[14px] leading-[20px] font-medium active:scale-[0.98]"
              style={{ color: '#0035d1' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(30, 76, 253, 0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <span className="material-symbols-outlined text-[20px]">done_all</span>
              Mark all as read
            </button>
            <button className="p-2 text-[#444656] hover:bg-[#eeecff] rounded-lg transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2.5 rounded-full text-[14px] leading-[20px] font-medium transition-all ${
                activeFilter === f
                  ? 'text-white shadow-md'
                  : 'hover:bg-[#e8e6ff] transition-colors'
              }`}
              style={{
                backgroundColor: activeFilter === f ? '#0035d1' : '#f5f2ff',
                color: activeFilter === f ? '#ffffff' : '#444656',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-xl animate-pulse border border-[#c4c5d9]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[80px] text-[#c4c5d9] mb-4">notifications_off</span>
            <h2 className="text-[24px] font-bold mb-2">No notifications</h2>
            <p className="text-[#444656] text-[16px] mb-8">You&apos;re all caught up!</p>
            <Link
              href="/products"
              className="px-8 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all inline-block text-white"
              style={{
                background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
                boxShadow: '0 4px 14px 0 rgba(30, 76, 253, 0.25)',
              }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((n) => {
              const categoryColor = n.type === 'Orders' ? '#0035d1' : n.type === 'Promotions' ? '#3432c8' : '#4958a9'
              const icon = n.type === 'Orders' ? 'package_2' : n.type === 'Promotions' ? 'sell' : 'security'
              return (
                <div
                  key={n.id}
                  className="relative overflow-hidden rounded-xl border transition-all hover:shadow-lg hover:-translate-y-1 group"
                  style={{
                    background: !n.isRead ? 'rgba(255, 255, 255, 0.8)' : '#ffffff',
                    backdropFilter: !n.isRead ? 'blur(12px)' : 'none',
                    borderColor: '#c4c5d9',
                    borderLeft: !n.isRead ? '4px solid #0035d1' : '4px solid transparent',
                  }}
                  onClick={() => { if (!n.isRead) markRead(n.id) }}
                >
                  <div className="p-4 flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(30, 76, 253, 0.1)' }}>
                      <span className="material-symbols-outlined" style={{ color: categoryColor, fontVariationSettings: "'FILL' 1" }}>
                        {icon}
                      </span>
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] leading-[20px] font-medium font-bold" style={{ color: categoryColor }}>{n.type}</span>
                        </div>
                        <span className="text-[12px] leading-[16px] text-[#444656] flex-shrink-0 ml-2">
                          {new Date(n.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-[20px] font-semibold leading-[28px] mb-1">{n.title}</h3>
                      <p className="text-[#444656] text-[16px] leading-[24px]">{n.message}</p>
                    </div>
                  </div>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(n.id) }}
                      className="material-symbols-outlined text-[#747688] hover:text-[#ba1a1a] transition-colors"
                    >
                      delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Load More */}
        {filtered.length > 0 && (
          <div className="mt-12 flex flex-col items-center">
            <button
              onClick={() => setPage(p => p + 1)}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 text-[14px] leading-[20px] font-medium"
              style={{ backgroundColor: '#e8e6ff', color: '#08006c' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e4cfd'; e.currentTarget.style.color = '#ffffff' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#e8e6ff'; e.currentTarget.style.color = '#08006c' }}
            >
              Load more history
              <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">expand_more</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
