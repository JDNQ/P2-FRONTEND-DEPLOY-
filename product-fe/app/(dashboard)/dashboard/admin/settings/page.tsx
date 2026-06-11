'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/stores/authStore'
import { userApi } from '@/lib/api/userApi'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const updateMutation = useMutation({
    mutationFn: (data: { username?: string; email?: string }) =>
      userApi.updateProfile(user!.id, data),
    onSuccess: (res) => {
      updateUser({ username: res.data.data.username, email: res.data.data.email })
      toast.success('Cập nhật thông tin thành công!')
    },
    onError: () => toast.error('Cập nhật thất bại'),
  })

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({ username, email: email || undefined })
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không khớp')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    toast.info('Tính năng đổi mật khẩu đang phát triển!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-[24px] font-bold text-[#08006c]">Cài đặt quản trị</h2>
        <p className="text-sm text-[#444656] mt-1">
          Quản lý thông tin tài khoản và cài đặt hệ thống.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#c4c5d9]/50 p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#c4c5d9]/30">
          <div className="w-16 h-16 rounded-full bg-[#0035d1] flex items-center justify-center text-white text-2xl font-bold">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#08006c]">{user?.username}</h3>
            <p className="text-sm text-[#747688]">{user?.email || 'Chưa có email'}</p>
            <span className="inline-block mt-1 px-3 py-0.5 bg-[#e1dfff] text-[#0035d1] text-xs font-bold rounded-full">
              {user?.role || 'ADMIN'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <h4 className="text-base font-bold text-[#08006c]">Thông tin cá nhân</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#444656]">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#444656]">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none text-sm"
                placeholder="Nhập email"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-8 py-2.5 text-white rounded-lg text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
                boxShadow: '0 4px 14px 0 rgba(30, 76, 253, 0.25)',
              }}
            >
              {updateMutation.isPending && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#c4c5d9]/50 p-6 space-y-6">
        <h4 className="text-base font-bold text-[#08006c]">Đổi mật khẩu</h4>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#444656]">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#444656]">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#444656]">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-2.5 border-2 border-[#0035d1] text-[#0035d1] rounded-lg text-sm font-bold hover:bg-[#0035d1]/5 transition-colors"
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
