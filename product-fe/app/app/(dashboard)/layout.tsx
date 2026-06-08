'use client'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER'

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen p-6">
          <h1 className="font-heading text-xl font-bold text-primary-600 mb-8">TL Market Admin</h1>

          <nav className="space-y-2">
            {user?.role === 'MANAGER' && (
              <>
                <Link
                  href="/dashboard/manager"
                  className="block px-4 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/manager/orders"
                  className="block px-4 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700"
                >
                  Đơn hàng
                </Link>
                <Link
                  href="/dashboard/manager/users"
                  className="block px-4 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700"
                >
                  Người dùng
                </Link>
              </>
            )}
            {user?.role === 'ADMIN' && (
              <>
                <Link
                  href="/dashboard/admin"
                  className="block px-4 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/admin/products"
                  className="block px-4 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700"
                >
                  Sản phẩm
                </Link>
                <Link
                  href="/dashboard/admin/orders"
                  className="block px-4 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700"
                >
                  Đơn hàng
                </Link>
                <Link
                  href="/dashboard/admin/vouchers"
                  className="block px-4 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700"
                >
                  Voucher
                </Link>
              </>
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 mb-3">Đăng nhập với: {user?.username}</p>
            <a
              href="/profile"
              className="block px-4 py-2 bg-neutral-100 rounded-lg text-neutral-700 hover:bg-neutral-200 text-sm"
            >
              Thông tin tài khoản
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
