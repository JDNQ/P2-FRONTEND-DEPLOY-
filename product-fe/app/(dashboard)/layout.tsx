'use client'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const role = user?.role || 'ADMIN'
  const navItems = role === 'MANAGER'
    ? [
        { href: '/dashboard/manager', label: 'Dashboard', icon: 'dashboard' },
        { href: '/dashboard/manager/orders', label: 'Orders', icon: 'package' },
        { href: '/dashboard/manager/users', label: 'Users', icon: 'group' },
      ]
    : [
        { href: '/dashboard/admin', label: 'Dashboard', icon: 'dashboard' },
        { href: '/dashboard/admin/products', label: 'Products', icon: 'inventory_2' },
        { href: '/dashboard/admin/orders', label: 'Orders', icon: 'package' },
        { href: '/dashboard/admin/vouchers', label: 'Vouchers', icon: 'monetization_on' },
      ]

  return (
    <div className="flex min-h-screen bg-surface-page font-body-md text-on-surface">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 border-r border-outline-variant bg-surface-container p-4 sticky top-0">
        <div className="mb-6 px-2">
          <Link href="/" className="font-heading text-xl font-bold text-m3-primary">TL Market</Link>
          <p className="text-sm text-m3-on-surface-variant opacity-70">Manage your store</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-bold transition-all text-sm ${
                  isActive
                    ? 'bg-m3-primary-container text-on-primary-container'
                    : 'text-m3-on-surface-variant hover:bg-m3-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-4 space-y-1">
          <button className="w-full py-2.5 px-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 mb-4 text-sm"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.3)'
            }}
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span>Add Product</span>
          </button>
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-lg transition-all text-sm">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-lg transition-all text-sm">
            <span className="material-symbols-outlined">logout</span>
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-surface sticky top-0 z-20 shadow-sm">
          <div className="flex justify-between items-center px-4 py-4 w-full max-w-[1280px] mx-auto">
            <div className="flex items-center gap-6">
              <button className="md:hidden text-m3-primary">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h2 className="text-xl font-bold text-m3-primary">Overview</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 bg-m3-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-m3-primary/20 w-64 transition-all"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/50">search</span>
              </div>
              <button className="relative p-2 text-m3-on-surface-variant hover:bg-m3-surface-variant rounded-full transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-outline-variant">
                <div className="w-10 h-10 rounded-full bg-m3-primary-fixed flex items-center justify-center text-m3-primary font-bold text-sm ring-2 ring-m3-primary-fixed">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-bold leading-tight">{user?.username}</p>
                  <p className="text-xs text-m3-on-surface-variant opacity-70">{role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 max-w-[1280px] mx-auto w-full space-y-6">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-m3-surface-container-highest border-t border-outline-variant mt-12">
          <div className="px-4 py-6 max-w-[1280px] mx-auto text-center text-xs text-m3-on-surface-variant">
            © 2024 TL Market. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  )
}
