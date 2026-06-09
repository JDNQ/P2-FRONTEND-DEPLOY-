'use client'
import { useAuthStore } from '@/lib/stores/authStore'
import type { User } from '@/lib/types/auth'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { uploadApi } from '@/lib/api/uploadApi'
import { userApi } from '@/lib/api/userApi'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const SIDEBAR = [
  { href: '/profile', label: 'Hồ sơ', icon: 'person' },
  { href: '/orders', label: 'Đơn hàng', icon: 'package' },
  { href: '/wishlist', label: 'Yêu thích', icon: 'favorite' },
  { href: '/notifications', label: 'Thông báo', icon: 'notifications' },
]

const today = new Date().toISOString().split('T')[0]

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    bio: 'Tech enthusiast and frequent shopper at TL Market.',
    birthday: '',
  })

  // Fetch dữ liệu mới nhất từ BE khi vào trang
  useEffect(() => {
    if (!isAuthenticated || !user) return
    userApi.getProfile().then((res) => {
      const profile = res.data.data
      const updates: Partial<User> = {
        username: profile.username,
        email: profile.email || undefined,
      }
      // Chỉ cập nhật avatarUrl nếu BE trả về giá trị truthy
      // (tránh ghi đè avatar đã lưu local khi BE chưa kịp lưu)
      if (profile.avatarUrl) {
        updates.avatarUrl = profile.avatarUrl
      }
      updateUser(updates)
      setFormData((prev) => ({
        ...prev,
        username: profile.username,
        email: profile.email || '',
      }))
    }).catch(() => {
      // Không có BE thì dùng local store, không sao
    })
  }, [isAuthenticated])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ hỗ trợ định dạng JPG, PNG, WEBP, GIF')
      return
    }
    const maxSize = file.type === 'image/gif' ? 15 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(`Ảnh không được vượt quá ${maxSize / 1024 / 1024}MB`)
      return
    }
    // Nếu upload BE thất bại và file > 2MB → base64 quá lớn cho localStorage
    const isBase64Safe = file.size <= 2 * 1024 * 1024

    setUploading(true)

    try {
      // Upload lên BE Cloudinary trước
      const url = await uploadApi.avatar(file)
      if (!url) throw new Error('Empty URL from server')
      if (user) {
        // Cập nhật store với URL từ BE
        updateUser({ avatarUrl: url })
        // Đồng thời gọi BE để lưu URL avatar vào user
        await userApi.updateProfile(user.id, { avatarUrl: url })
      }
      toast.success('Cập nhật ảnh đại diện thành công!')
    } catch {
      if (!isBase64Safe) {
        toast.error('File quá lớn để lưu tạm. Vui lòng thử lại sau hoặc chọn ảnh nhỏ hơn 2MB.')
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error('Read failed'))
          reader.readAsDataURL(file)
        })
        if (user) updateUser({ avatarUrl: base64 })
        toast.success('Đã lưu ảnh đại diện tạm thời')
      } catch {
        toast.error('Đọc file thất bại, vui lòng thử lại')
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (formData.birthday && formData.birthday > today) {
      toast.error('Ngày sinh không được vượt quá ngày hiện tại')
      return
    }

    const changedUsername = formData.username !== user.username
    const changedEmail = formData.email !== (user.email || '')

    if (!changedUsername && !changedEmail) {
      toast.success('Cập nhật thông tin thành công!')
      return
    }

    setIsSaving(true)
    try {
      await userApi.updateProfile(user.id, {
        username: changedUsername ? formData.username : undefined,
        email: changedEmail ? formData.email : undefined,
      })

      updateUser({
        username: formData.username || user.username,
        email: formData.email || undefined,
      })

      toast.success('Cập nhật thông tin thành công!')
    } catch {
      updateUser({
        username: formData.username || user.username,
        email: formData.email || undefined,
      })
      toast.success('Đã lưu thông tin (local)')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-xl mx-auto px-gutter py-stack-lg text-center">
          <div className="rounded-2xl shadow-sm border border-neutral-50 p-12 bg-white">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-stack-md">person</span>
            <h1 className="font-heading text-headline-sm text-on-surface mb-1">Tài khoản</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">Vui lòng đăng nhập để xem thông tin tài khoản của bạn.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/login?from=/profile" className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary font-heading font-bold px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition-all">
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
            <div className="rounded-xl p-stack-md sticky top-24 border border-neutral-50 bg-white shadow-sm">
              <div className="flex items-center gap-4 mb-stack-lg px-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-primary-container text-primary overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h2 className="font-heading text-headline-sm text-on-surface">{user.username}</h2>
                  <p className="font-caption text-caption text-on-surface-variant">Thành viên từ 2024</p>
                </div>
              </div>

              <nav className="space-y-1">
                {SIDEBAR.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.label} href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-label-md ${isActive
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
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-primary-container rounded-lg transition-all hover:translate-x-1 font-label-md">
                  <span className="material-symbols-outlined">settings</span>
                  Cài đặt
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="rounded-xl shadow-sm border border-neutral-50 p-stack-lg lg:p-12 bg-white">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-section-gap">
                {/* Avatar with Upload */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary shadow-primary-container/25 shadow-[0_10px_15px_-3px]">
                    <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-primary-container flex items-center justify-center">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-bold text-primary">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    title="Chọn ảnh đại diện"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all bg-primary text-on-primary disabled:opacity-50"
                    title="Thay đổi ảnh đại diện"
                  >
                    {uploading ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    )}
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="font-heading text-headline-sm text-on-surface mb-1">Thông tin cá nhân</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">Cập nhật ảnh đại diện và thông tin cá nhân tại đây.</p>
                </div>
              </div>

              <form className="space-y-stack-lg" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant px-1">Username</label>
                    <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Tên đăng nhập"
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
                    <input type="date" value={formData.birthday} onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                      max={today}
                      title="Ngày sinh"
                      className="w-full rounded-xl py-3 px-4 font-body-md text-body-md outline-none border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                  </div>
                </div>
                <div className="space-y-2 pt-stack-md">
                  <label className="font-label-md text-label-md text-on-surface-variant px-1">Biography (Optional)</label>
                  <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="Viết tiểu sử của bạn..."
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
                    onClick={() => setFormData({ username: user.username, email: user.email || '', phone: '', bio: 'Tech enthusiast and frequent shopper at TL Market.', birthday: '' })}
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
                  <h3 className="font-heading text-headline-sm text-on-surface mb-1">Account Security</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Manage your password, 2FA settings, and connected devices.</p>
                </div>
                <div className="rounded-xl p-stack-lg group hover:shadow-lg transition-all duration-300 cursor-pointer bg-surface-container-low">
                  <div className="flex justify-between items-start mb-stack-md">
                    <div className="p-3 rounded-xl bg-tertiary-container/20">
                      <span className="material-symbols-outlined text-tertiary">credit_card</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary group-hover:translate-x-1 transition-all">arrow_forward</span>
                  </div>
                  <h3 className="font-heading text-headline-sm text-on-surface mb-1">Payment Methods</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Edit your stored credit cards and digital wallets for faster checkout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}