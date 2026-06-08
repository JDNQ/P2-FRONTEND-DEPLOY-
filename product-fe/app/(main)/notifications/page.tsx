'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Notification {
  id: number
  category: string
  categoryLabel: string
  categoryColor: string
  icon: string
  iconFill?: boolean
  badge?: string
  title: string
  description: string
  time: string
  unread: boolean
  actions?: { label: string; primary?: boolean }[]
  image?: { src: string; caption: string; action: string }
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, category: 'Orders', categoryLabel: 'Order Update', categoryColor: 'text-[#0035d1]', icon: 'package_2', iconFill: true, title: 'Your order #TL-9842 is out for delivery!', description: 'Our courier is on the way to your address. Estimated arrival: 2:30 PM today.', time: '2 mins ago', unread: true, actions: [{ label: 'Track Order', primary: true }, { label: 'Details' }] },
  { id: 2, category: 'Promotions', categoryLabel: 'Promotion', categoryColor: 'text-[#3432c8]', icon: 'sell', iconFill: true, badge: 'Flash Sale', title: 'Up to 50% Off on Electronics!', description: "Don't miss out on our weekend tech madness. Top brands are now on sale for a limited time.", time: '1 hour ago', unread: false, image: { src: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=200&fit=crop', caption: 'Premium Gadgets Collection', action: 'Shop Now' } },
  { id: 3, category: 'System', categoryLabel: 'Security Alert', categoryColor: 'text-[#4958a9]', icon: 'security', iconFill: true, title: 'New login detected on your account', description: "A login was detected from a New Device in San Francisco, CA. If this wasn't you, please secure your account immediately.", time: 'Yesterday', unread: true },
  { id: 4, category: 'Reviews', categoryLabel: 'Feedback', categoryColor: 'text-green-700', icon: 'star', iconFill: true, title: 'How was your recent purchase?', description: 'Your opinion matters! Share your thoughts on the Wireless Earbuds you bought last week.', time: '3 days ago', unread: false },
]

const FILTERS = ['All', 'Orders', 'Promotions', 'System']

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [activeFilter, setActiveFilter] = useState('All')
  const [page, setPage] = useState(1)

  const filtered = activeFilter === 'All'
    ? notifications
    : notifications.filter(n => n.category === activeFilter)

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

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
              onClick={markAllRead}
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

        {filtered.length === 0 ? (
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
            {filtered.map((n) => (
              <div
                key={n.id}
                className="relative overflow-hidden rounded-xl border transition-all hover:shadow-lg hover:-translate-y-1 group"
                style={{
                  background: n.unread ? 'rgba(255, 255, 255, 0.8)' : '#ffffff',
                  backdropFilter: n.unread ? 'blur(12px)' : 'none',
                  borderColor: '#c4c5d9',
                  borderLeft: n.unread ? '4px solid #0035d1' : '4px solid transparent',
                }}
              >
                <div className="p-4 flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(30, 76, 253, 0.1)' }}>
                    <span className="material-symbols-outlined" style={{ color: n.categoryColor, fontVariationSettings: n.iconFill ? "'FILL' 1" : "'FILL' 0" }}>
                      {n.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] leading-[20px] font-medium font-bold" style={{ color: n.categoryColor }}>{n.categoryLabel}</span>
                        {n.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'rgba(52, 50, 200, 0.1)', color: '#3432c8' }}>
                            {n.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] leading-[16px] text-[#444656] flex-shrink-0 ml-2">{n.time}</span>
                    </div>
                    <h3 className="text-[20px] font-semibold leading-[28px] mb-1">{n.title}</h3>
                    <p className="text-[#444656] text-[16px] leading-[24px]">{n.description}</p>

                    {/* Image card */}
                    {n.image && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-[#c4c5d9] max-w-md">
                        <img
                          src={n.image.src}
                          alt={n.image.caption}
                          className="w-full h-32 object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                        <div className="p-3 flex justify-between items-center" style={{ backgroundColor: '#f5f2ff' }}>
                          <span className="text-[14px] leading-[20px] font-medium">{n.image.caption}</span>
                          <span className="font-bold" style={{ color: '#0035d1' }}>{n.image.action}</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {n.actions && (
                      <div className="mt-4 flex gap-3">
                        {n.actions.map((a) => (
                          <button
                            key={a.label}
                            className={`px-4 py-2 rounded-lg text-[14px] leading-[20px] font-medium transition-opacity ${
                              a.primary
                                ? 'text-white hover:opacity-90'
                                : 'border transition-colors'
                            }`}
                            style={{
                              backgroundColor: a.primary ? '#0035d1' : 'transparent',
                              borderColor: a.primary ? 'transparent' : '#c4c5d9',
                              color: a.primary ? '#ffffff' : '#444656',
                            }}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Delete button (visible on hover) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeNotification(n.id)}
                    className="material-symbols-outlined text-[#747688] hover:text-[#ba1a1a] transition-colors"
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
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
