'use client'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, clearAuth, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = () => {
    clearAuth()
    document.cookie = 'tl_token=; path=/; max-age=0'
    document.cookie = 'tl_role=; path=/; max-age=0'
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8">Hồ sơ của tôi</h1>

        <div className="bg-neutral-50 rounded-xl p-8 max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold">{user.username}</h2>
              <p className="text-neutral-500 text-sm">{user.email || 'Không có email'}</p>
              <p className="text-primary-600 text-sm font-medium mt-1">{user.role}</p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-neutral-200">
            <a
              href="/orders"
              className="block px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition text-neutral-900 font-medium text-center"
            >
              Xem đơn hàng
            </a>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
