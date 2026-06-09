'use client'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import Header from '@/components/Header'

const SIDEBAR = [
  { href: '/profile', label: 'Profile', icon: 'person' },
  { href: '/orders', label: 'Orders', icon: 'package' },
  { href: '/wishlist', label: 'Wishlist', icon: 'favorite' },
  { href: '/notifications', label: 'Notifications', icon: 'notifications' },
]

export default function ProfilePage() {
  const { user, clearAuth, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    bio: 'Tech enthusiast and frequent shopper at TL Market.',
  })

  const handleLogout = () => {
    clearAuth()
    document.cookie = 'tl_token=; path=/; max-age=0'
    document.cookie = 'tl_role=; path=/; max-age=0'
    router.push('/')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success('Cập nhật thông tin thành công!')
    } catch {
      toast.error('Cập nhật thất bại, vui lòng thử lại')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-xl mx-auto px-gutter py-stack-lg text-center">
          <div className="rounded-2xl shadow-sm border border-outline-variant/30 p-12 bg-surface">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-stack-md">person</span>
            <h1 className="font-headline-sm text-headline-sm text-on-surface mb-1">Tài khoản</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">Vui lòng đăng nhập để xem thông tin tài khoản của bạn.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/login?from=/profile" className="bg-primary text-on-primary font-label-md px-8 py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
                Đăng nhập
              </Link>
              <Link href="/register" className="px-8 py-3 rounded-xl border-2 border-primary text-primary font-label-md hover:bg-primary hover:text-on-primary transition-all">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />
      <div className="max-w-container-max mx-auto px-gutter py-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="rounded-xl p-stack-md sticky top-24 border border-outline-variant/30 bg-surface-container-low">
              <div className="flex items-center gap-4 mb-stack-lg px-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-primary-container text-primary">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">{user.username}</h2>
                  <p className="font-caption text-caption text-on-surface-variant">Member since 2024</p>
                </div>
              </div>

              <nav className="space-y-1">
                {SIDEBAR.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.label} href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-label-md ${
                        isActive
                          ? 'bg-primary text-on-primary translate-x-1'
                          : 'text-on-surface-variant hover:bg-primary-container hover:translate-x-1'
                      }`}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              <hr className="my-stack-md border-outline-variant/30" />

              <nav className="space-y-1">
                <Link href="#" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-primary-container rounded-lg transition-all hover:translate-x-1 font-label-md">
                  <span className="material-symbols-outlined">settings</span>
                  Settings
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-primary-container rounded-lg transition-all hover:translate-x-1 font-label-md">
                  <span className="material-symbols-outlined">help</span>
                  Support
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/20 rounded-lg transition-all hover:translate-x-1 font-label-md">
                  <span className="material-symbols-outlined">logout</span>
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="rounded-xl shadow-sm border border-outline-variant/20 p-stack-lg lg:p-12 bg-surface">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-section-gap">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-[#4958a9] shadow-[0_10px_15px_-3px_rgba(30,76,253,0.25)]">
                    <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-primary-container">
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all bg-primary text-on-primary">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="font-headline-sm text-headline-sm text-on-surface mb-1">Personal Information</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">Update your photo and personal details here.</p>
                </div>
              </div>

              <form className="space-y-stack-lg" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant px-1">Username</label>
                    <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full rounded-xl py-3 px-4 font-body-md text-body-md outline-none border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant px-1">Email Address</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@example.com"
                      className="w-full rounded-xl py-3 px-4 font-body-md text-body-md outline-none border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant px-1">Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="w-full rounded-xl py-3 px-4 font-body-md text-body-md outline-none border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant px-1">Birthday</label>
                    <input type="date"
                      className="w-full rounded-xl py-3 px-4 font-body-md text-body-md outline-none border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                  </div>
                </div>
                <div className="space-y-2 pt-stack-md">
                  <label className="font-label-md text-label-md text-on-surface-variant px-1">Biography (Optional)</label>
                  <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full rounded-xl py-3 px-4 font-body-md text-body-md outline-none border border-outline-variant bg-surface-container-low resize-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-stack-lg border-t border-outline-variant/30">
                  <button type="submit" disabled={isSaving}
                    className="flex-1 sm:flex-none px-8 py-3 orange-gradient orange-glow text-white font-label-md rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {isSaving ? (
                      <><span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> Saving...</>
                    ) : (
                      <><span className="material-symbols-outlined text-[18px]">save</span> Save Changes</>
                    )}
                  </button>
                  <button type="button"
                    onClick={() => setFormData({ username: user.username, email: user.email || '', phone: '', bio: 'Tech enthusiast and frequent shopper at TL Market.' })}
                    className="flex-1 sm:flex-none px-8 py-3 border border-outline-variant rounded-xl font-label-md text-primary hover:bg-primary-container/20 transition-all">
                    Cancel
                  </button>
                </div>
              </form>

              {/* Bento Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg mt-section-gap">
                <div className="rounded-xl p-stack-lg group hover:shadow-lg transition-all duration-300 cursor-pointer bg-surface-container-low">
                  <div className="flex justify-between items-start mb-stack-md">
                    <div className="p-3 rounded-xl bg-primary-container/20">
                      <span className="material-symbols-outlined text-primary">shield</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Account Security</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Manage your password, 2FA settings, and connected devices.</p>
                </div>
                <div className="rounded-xl p-stack-lg group hover:shadow-lg transition-all duration-300 cursor-pointer bg-surface-container-low">
                  <div className="flex justify-between items-start mb-stack-md">
                    <div className="p-3 rounded-xl bg-tertiary-container/20">
                      <span className="material-symbols-outlined text-tertiary">credit_card</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary group-hover:translate-x-1 transition-all">arrow_forward</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Payment Methods</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Edit your stored credit cards and digital wallets for faster checkout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
