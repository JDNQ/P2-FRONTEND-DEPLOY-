'use client'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, clearAuth, isAuthenticated } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    clearAuth()
    document.cookie = 'tl_token=; path=/; max-age=0'
    document.cookie = 'tl_role=; path=/; max-age=0'
    router.push('/')
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-outline-variant p-12">
          <span className="material-symbols-outlined text-6xl text-m3-outline-variant mb-4">person</span>
          <h1 className="text-2xl font-bold text-m3-on-surface mb-2">Tài khoản</h1>
          <p className="text-m3-on-surface-variant mb-8">Vui lòng đăng nhập để xem thông tin tài khoản của bạn.</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login?from=/profile"
              className="px-8 py-3 rounded-xl text-white font-bold"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.3)'
              }}
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 rounded-xl border-2 border-m3-primary text-m3-primary font-bold hover:bg-m3-primary-fixed transition-colors"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-m3-on-surface">Hồ sơ của tôi</h1>

      <div className="bg-surface-card rounded-2xl shadow-sm border border-outline-variant p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-m3-primary-fixed flex items-center justify-center text-m3-primary font-bold text-xl">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-m3-on-surface">{user.username}</h2>
            <p className="text-sm text-m3-on-surface-variant">{user.email || 'Chưa có email'}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-m3-primary-container/30 text-m3-primary">
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-outline-variant">
          <Link
            href="/orders"
            className="flex items-center justify-between w-full px-4 py-3 bg-white border border-outline-variant rounded-xl hover:bg-m3-surface-container-low transition-colors text-m3-on-surface font-medium"
          >
            <span>Xem đơn hàng</span>
            <span className="material-symbols-outlined text-m3-on-surface-variant">chevron_right</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-4 py-3 border border-error/30 rounded-xl text-error font-medium hover:bg-error/5 transition-colors"
          >
            <span>Đăng xuất</span>
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
