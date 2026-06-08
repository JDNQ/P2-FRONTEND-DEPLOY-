'use client'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const SIDEBAR = [
  { href: '/profile', label: 'Profile', icon: 'person' },
  { href: '/orders', label: 'Orders', icon: 'package' },
  { href: '/wishlist', label: 'Wishlist', icon: 'favorite' },
  { href: '#', label: 'Notifications', icon: 'notifications' },
]

export default function ProfilePage() {
  const { user, clearAuth, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    clearAuth()
    document.cookie = 'tl_token=; path=/; max-age=0'
    document.cookie = 'tl_role=; path=/; max-age=0'
    router.push('/')
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="rounded-2xl shadow-sm border border-[#c4c5d9] p-12" style={{ backgroundColor: '#ffffff' }}>
          <span className="material-symbols-outlined text-6xl text-[#c4c5d9] mb-4">person</span>
          <h1 className="text-2xl font-bold mb-2">Tài khoản</h1>
          <p className="text-[#444656] mb-8">Vui lòng đăng nhập để xem thông tin tài khoản của bạn.</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login?from=/profile"
              className="px-8 py-3 rounded-xl text-white font-bold"
              style={{
                background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
                boxShadow: '0 4px 14px 0 rgba(30, 76, 253, 0.25)'
              }}
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 rounded-xl border-2 font-bold transition-colors"
              style={{ borderColor: '#0035d1', color: '#0035d1' }}
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-16" style={{ backgroundColor: '#fcf8ff', color: '#08006c' }}>
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="rounded-xl p-4 sticky top-24 border border-[#c4c5d9]/30" style={{ backgroundColor: '#f5f2ff' }}>
              <div className="flex items-center gap-4 mb-6 px-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: '#dee1ff', color: '#0035d1' }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-[20px] font-semibold leading-[28px]">{user.username}</h2>
                  <p className="text-[12px] leading-[16px] text-[#444656]">Member since 2024</p>
                </div>
              </div>

              <nav className="space-y-1">
                {SIDEBAR.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all text-[14px] leading-[20px] font-medium ${
                        isActive
                          ? 'bg-[#1e4cfd] text-white translate-x-1'
                          : 'text-[#444656] hover:bg-[#e1dfff] hover:translate-x-1'
                      }`}
                    >
                      <span className="material-symbols-outlined">{item.icon}</span>
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              <hr className="my-4 border-[#c4c5d9]/30" />

              <nav className="space-y-1">
                <Link
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 text-[#444656] hover:bg-[#e1dfff] rounded-lg transition-all hover:translate-x-1 text-[14px] leading-[20px] font-medium"
                >
                  <span className="material-symbols-outlined">settings</span>
                  Settings
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 text-[#444656] hover:bg-[#e1dfff] rounded-lg transition-all hover:translate-x-1 text-[14px] leading-[20px] font-medium"
                >
                  <span className="material-symbols-outlined">help</span>
                  Support
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-all hover:translate-x-1 text-[14px] leading-[20px] font-medium"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="rounded-xl shadow-sm border border-[#c4c5d9]/20 p-6 lg:p-12" style={{ backgroundColor: '#ffffff' }}>
              {/* Avatar */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
                <div className="relative group">
                  <div
                    className="w-32 h-32 rounded-full p-1"
                    style={{
                      background: 'linear-gradient(to top right, #0035d1, #4958a9)',
                      boxShadow: '0 10px 15px -3px rgba(30, 76, 253, 0.25)',
                    }}
                  >
                    <div className="w-full h-full rounded-full border-4 border-white overflow-hidden" style={{ backgroundColor: '#dee1ff' }}>
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold" style={{ color: '#0035d1' }}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all" style={{ backgroundColor: '#0035d1', color: '#ffffff' }}>
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-[30px] font-bold leading-[40px] mb-1">Personal Information</h1>
                  <p className="text-[#444656] text-[16px] leading-[24px]">Update your photo and personal details here.</p>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[14px] leading-[20px] font-medium text-[#444656] px-1">Username</label>
                    <input
                      type="text"
                      defaultValue={user.username}
                      className="w-full rounded-xl py-3 px-4 text-[16px] leading-[24px] transition-all outline-none border border-[#c4c5d9]"
                      style={{ backgroundColor: '#f5f2ff' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] leading-[20px] font-medium text-[#444656] px-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user.email || 'user@example.com'}
                      className="w-full rounded-xl py-3 px-4 text-[16px] leading-[24px] transition-all outline-none border border-[#c4c5d9]"
                      style={{ backgroundColor: '#f5f2ff' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] leading-[20px] font-medium text-[#444656] px-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      className="w-full rounded-xl py-3 px-4 text-[16px] leading-[24px] transition-all outline-none border border-[#c4c5d9]"
                      style={{ backgroundColor: '#f5f2ff' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] leading-[20px] font-medium text-[#444656] px-1">Birthday</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Select date"
                        className="w-full rounded-xl py-3 px-4 text-[16px] leading-[24px] transition-all outline-none border border-[#c4c5d9]"
                        style={{ backgroundColor: '#f5f2ff' }}
                      />
                      <span className="material-symbols-outlined absolute right-4 top-3 text-[#747688]">calendar_today</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                  <label className="text-[14px] leading-[20px] font-medium text-[#444656] px-1">Biography (Optional)</label>
                  <textarea
                    placeholder="Write a short bio about yourself..."
                    rows={4}
                    className="w-full rounded-xl py-3 px-4 text-[16px] leading-[24px] transition-all outline-none border border-[#c4c5d9] resize-none"
                    style={{ backgroundColor: '#f5f2ff' }}
                    defaultValue={`Tech enthusiast and frequent shopper at TL Market.`}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#c4c5d9]/30">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-8 py-3 text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
                      boxShadow: '0 10px 15px -3px rgba(30, 76, 253, 0.25)',
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="flex-1 sm:flex-none px-8 py-3 border rounded-xl font-bold transition-all"
                    style={{ borderColor: '#c4c5d9', color: '#0035d1', backgroundColor: '#fcf8ff' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Bento Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="rounded-xl p-6 group hover:shadow-lg transition-all duration-300 cursor-pointer" style={{ backgroundColor: '#eeecff' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(30, 76, 253, 0.2)' }}>
                      <span className="material-symbols-outlined text-[#0035d1]">shield</span>
                    </div>
                    <span className="material-symbols-outlined text-[#747688] group-hover:text-[#0035d1] group-hover:translate-x-1 transition-all">arrow_forward</span>
                  </div>
                  <h3 className="text-[20px] font-semibold leading-[28px] mb-2">Account Security</h3>
                  <p className="text-[#444656] text-[16px] leading-[24px]">Manage your password, 2FA settings, and connected devices.</p>
                </div>
                <div className="rounded-xl p-6 group hover:shadow-lg transition-all duration-300 cursor-pointer" style={{ backgroundColor: '#eeecff' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(78, 79, 224, 0.2)' }}>
                      <span className="material-symbols-outlined text-[#3432c8]">credit_card</span>
                    </div>
                    <span className="material-symbols-outlined text-[#747688] group-hover:text-[#3432c8] group-hover:translate-x-1 transition-all">arrow_forward</span>
                  </div>
                  <h3 className="text-[20px] font-semibold leading-[28px] mb-2">Payment Methods</h3>
                  <p className="text-[#444656] text-[16px] leading-[24px]">Edit your stored credit cards and digital wallets for faster checkout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
