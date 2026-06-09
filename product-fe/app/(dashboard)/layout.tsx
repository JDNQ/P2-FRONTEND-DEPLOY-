'use client'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    clearAuth()
    document.cookie = 'tl_token=; path=/; max-age=0'
    document.cookie = 'tl_role=; path=/; max-age=0'
    router.push('/login')
  }

  if (!isAuthenticated) return null

  const role = user?.role || 'ADMIN'
  const navItems = role === 'MANAGER'
    ? [
        { href: '/dashboard/manager', label: 'Tổng quan', icon: 'dashboard' },
        { href: '/dashboard/manager/orders', label: 'Đơn hàng', icon: 'package' },
        { href: '/dashboard/manager/inventory', label: 'Kho hàng', icon: 'inventory_2' },
        { href: '/dashboard/manager/health', label: 'Hệ thống', icon: 'monitoring' },
        { href: '/dashboard/manager/logs', label: 'Nhật ký', icon: 'history' },
      ]
    : [
        { href: '/dashboard/admin', label: 'Tổng quan', icon: 'dashboard' },
        { href: '/dashboard/admin/orders', label: 'Đơn hàng', icon: 'package' },
        { href: '/dashboard/admin/products', label: 'Sản phẩm', icon: 'inventory_2' },
        { href: '/dashboard/admin/users', label: 'Khách hàng', icon: 'group' },
        { href: '/dashboard/admin/vouchers', label: 'Voucher', icon: 'monetization_on' },
      ]

  return (
    <div className="flex h-screen overflow-hidden bg-surface-page text-on-surface">
      <aside className="hidden md:flex flex-col h-full w-64 border-r border-border-subtle p-4 shrink-0 bg-white">
        <div className="flex items-center gap-3 mb-6 px-2">
          <Link href="/">
            <img src="/logo-removebg-preview.png" alt="TL Market" className="h-10 w-auto" />
          </Link>
          <div>
            <h1 className="text-headline-sm font-heading font-bold">Quản trị</h1>
            <p className="text-caption text-on-surface-variant">TL Market Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-label-md transition-all text-sm ${
                  isActive
                    ? 'orange-gradient text-white shadow-primary-glow translate-x-1'
                    : 'text-on-surface-variant hover:bg-primary-50 hover:text-primary hover:translate-x-1'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto space-y-1 pt-4 border-t border-border-subtle">
          {role !== 'MANAGER' && (
            <Link
              href="/dashboard/admin/products/new"
              className="w-full flex items-center justify-center gap-2 mb-4 py-2.5 rounded-xl font-bold orange-gradient orange-glow text-white transition-transform active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">add</span>
              Thêm sản phẩm
            </Link>
          )}
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-primary-50 rounded-xl transition-all text-sm">
            <span className="material-symbols-outlined">settings</span>
            <span>Cài đặt</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-primary-50 rounded-xl transition-all text-sm">
            <span className="material-symbols-outlined">storefront</span>
            <span>Về cửa hàng</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-surface-page">
        <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm bg-white/80 backdrop-blur-md border-b border-border-subtle">
          <div className="flex flex-col">
            <h2 className="text-headline-md font-heading font-bold text-primary">Bảng điều khiển</h2>
            <p className="text-on-surface-variant text-body-md">Xin chào, {user?.username || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 border border-border-subtle rounded-xl text-body-md focus:ring-2 focus:ring-primary/20 w-64 transition-all outline-none bg-surface-container-low"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-primary-50 rounded-full text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-flash-sale" />
              </button>
              <Link
                href="/profile"
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 bg-primary-50 text-primary border-white hover:ring-2 hover:ring-primary/20 transition-all"
                title="Cài đặt tài khoản"
              >
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-error hover:bg-error-container/30 rounded-xl transition-all text-sm font-semibold"
                title="Đăng xuất"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-container-max mx-auto w-full space-y-6">
          {children}
        </div>

        <footer className="mt-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-caption text-on-surface-variant border-t border-border-subtle">
          <p>© 2024 TL Market. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <a className="hover:text-primary transition-colors" href="#">Chính sách bảo mật</a>
            <a className="hover:text-primary transition-colors" href="#">Điều khoản</a>
          </div>
        </footer>
      </main>
    </div>
  )
}
