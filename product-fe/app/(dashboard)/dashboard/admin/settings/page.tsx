'use client'

import { useAuthStore } from '@/lib/stores/authStore'

export default function AdminSettingsPage() {
  const { user } = useAuthStore()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-[24px] font-bold text-[#08006c]">Cài đặt</h2>
        <p className="text-sm text-[#444656] mt-1">
          Quản lý thông tin tài khoản quản trị.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#444656]">Username</label>
            <input
              value={user?.username || ''}
              readOnly
              className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg bg-[#f5f2ff] text-sm text-[#747688] cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#444656]">Email</label>
            <input
              value={user?.email || ''}
              readOnly
              className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg bg-[#f5f2ff] text-sm text-[#747688] cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
