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
        { href: '/dashboard/manager/inventory', label: 'Inventory', icon: 'inventory_2' },
        { href: '/dashboard/manager/health', label: 'System Health', icon: 'monitoring' },
        { href: '/dashboard/manager/logs', label: 'Activity Log', icon: 'history' },
      ]
    : [
        { href: '/dashboard/admin', label: 'Dashboard', icon: 'dashboard' },
        { href: '/dashboard/admin/orders', label: 'Orders', icon: 'package' },
        { href: '/dashboard/admin/products', label: 'Inventory', icon: 'inventory_2' },
        { href: '/dashboard/admin/users', label: 'Customers', icon: 'group' },
        { href: '/dashboard/admin/vouchers', label: 'Discounts', icon: 'monetization_on' },
      ]

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#fcf8ff', color: '#08006c' }}>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-full w-64 border-r border-[#c4c5d9] p-4 shrink-0" style={{ backgroundColor: '#f5f2ff' }}>
        <div className="flex items-center gap-3 mb-6 px-2">
          <Link href="/">
            <img src="/logo-removebg-preview.png" alt="TL Market" className="h-10 w-auto" />
          </Link>
          <div>
            <h1 className="text-[20px] font-semibold leading-[28px] font-bold">Admin Panel</h1>
            <p className="text-[12px] leading-[16px] text-[#444656]">Manage your store</p>
          </div>
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
                    ? 'bg-[#1e4cfd] text-white translate-x-1'
                    : 'text-[#444656] hover:bg-[#e1dfff] hover:translate-x-1'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-[14px] leading-[20px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto space-y-1 pt-4 border-t border-[#c4c5d9]">
          {role !== 'MANAGER' && (
            <Link
              href="/dashboard/admin/products/new"
              className="w-full flex items-center justify-center gap-2 mb-4 py-2.5 rounded-xl font-bold transition-transform active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
                boxShadow: '0 4px 14px 0 rgba(30, 76, 253, 0.25)'
              }}
            >
              <span className="material-symbols-outlined text-white">add</span>
              <span className="text-white">Add Product</span>
            </Link>
          )}
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-[#444656] hover:bg-[#e1dfff] rounded-lg transition-all text-sm">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[14px] leading-[20px] font-medium">Settings</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-[#444656] hover:bg-[#e1dfff] rounded-lg transition-all text-sm">
            <span className="material-symbols-outlined">help</span>
            <span className="text-[14px] leading-[20px] font-medium">Support</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto" style={{ backgroundColor: '#fcf8ff' }}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm" style={{ backgroundColor: 'rgba(252, 248, 255, 0.8)', backdropFilter: 'blur(12px)' }}>
          <div className="flex flex-col">
            <h2 className="text-[24px] font-bold leading-[32px]" style={{ color: '#0035d1' }}>Overview</h2>
            <p className="text-[#444656] text-[14px] leading-[20px] font-medium">Welcome back, {user?.username || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#747688] material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Search data..."
                className="pl-10 pr-4 py-2 border-none rounded-xl text-[14px] leading-[20px] font-medium focus:ring-2 focus:ring-[#0035d1]/20 w-64 transition-all outline-none"
                style={{ backgroundColor: '#e8e6ff' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-[#e1dfff] rounded-full text-[#444656] transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: '#ba1a1a' }}></span>
              </button>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold border-2" style={{ backgroundColor: '#9aa8ff', color: '#2a3a8a', borderColor: '#fcf8ff' }}>
                {user?.username?.charAt(0).toUpperCase() || 'A'}
                {user?.username?.charAt(1)?.toUpperCase() || ''}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-[1280px] mx-auto w-full space-y-6">
          {children}
        </div>

        {/* Footer */}
        <footer className="mt-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[12px] leading-[16px] text-[#444656] border-t border-[#c4c5d9]/30">
          <p>© 2024 TL Market. All rights reserved.</p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <a className="hover:text-[#0035d1] transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-[#0035d1] transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-[#0035d1] transition-colors" href="#">System Status</a>
          </div>
        </footer>
      </main>
    </div>
  )
}
