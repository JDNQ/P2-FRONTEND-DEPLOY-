'use client'
import { useState, useMemo } from 'react'
import { useActivityLogs, useLogStats } from '@/lib/hooks/useActivityLogs'
import { toast } from 'sonner'

export default function ManagerLogsPage() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('Tất cả')
  const { data: logs = [], isLoading } = useActivityLogs(
    actionFilter !== 'Tất cả' ? { action: actionFilter } : undefined
  )
  const { data: stats } = useLogStats()

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    if (!search.trim()) return logs
    const term = search.toLowerCase()
    return logs.filter(
      (log) =>
        log.user.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.target.toLowerCase().includes(term) ||
        log.role.toLowerCase().includes(term)
    )
  }, [logs, search])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-bold leading-[32px] text-[#1e40af]">Nhật Ký Hoạt Động</h2>
        <button 
          onClick={() => toast.success('Đang chuẩn bị file xuất và tải xuống...') }
          className="flex items-center gap-2 bg-[#60a5fa] text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined">cloud_download</span>
          <span className="text-sm">Xuất File</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-[#fcf8ff]/80 p-6 rounded-xl border border-[#c4c5d9]/50 flex flex-wrap items-end gap-4"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-[#747688] mb-2">Tìm kiếm hành động</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747688]">search</span>
              <input
                type="text"
                placeholder="Nhập tên người dùng hoặc đối tượng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c4c5d9] focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] bg-[#fcf8ff]/50 text-sm outline-none transition-all"
              />
            </div>
          </div>
          <div className="w-48">
            <label className="block text-sm text-[#747688] mb-2">Loại hành động</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full py-2.5 px-4 rounded-xl border border-[#c4c5d9] bg-[#fcf8ff]/50 text-sm outline-none appearance-none cursor-pointer"
            >
              <option>Tất cả</option>
              <option>Sửa đổi</option>
              <option>Xóa bỏ</option>
              <option>Đăng nhập</option>
              <option>Bảo mật</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-4 bg-[#fcf8ff]/80 p-6 rounded-xl border border-[#c4c5d9]/50"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <label className="block text-sm text-[#747688] mb-2">Khoảng thời gian</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747688] text-sm">calendar_month</span>
              <input
                type="text"
                className="w-full pl-9 pr-2 py-2.5 rounded-xl border border-[#c4c5d9] bg-[#fcf8ff]/50 text-sm outline-none"
                value="01/10/2023 - 31/10/2023"
                readOnly
              />
            </div>
            <button 
              onClick={() => toast.info('Bộ lọc khoảng thời gian sẽ khả dụng khi kết nối với kho dữ liệu đầy đủ!')}
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#e8e6ff] text-[#1e40af] hover:bg-[#e1dfff] transition-colors"
            >
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: 'history', bg: 'bg-blue-100', color: 'text-blue-600', label: 'Hành động 24h', value: stats?.total24h?.toLocaleString() ?? '—' },
          { icon: 'check_circle', bg: 'bg-green-100', color: 'text-green-600', label: 'Thành công', value: stats ? `${stats.successRate}%` : '—' },
          { icon: 'warning', bg: 'bg-red-100', color: 'text-red-600', label: 'Cảnh báo bảo mật', value: stats?.securityWarnings?.toLocaleString() ?? '—' },
          { icon: 'shield', bg: 'bg-purple-100', color: 'text-purple-600', label: 'Địa chỉ IP lạ', value: stats?.unknownIps?.toLocaleString() ?? '—' },
        ].map((s) => (
          <div key={s.label} className="bg-[#f5f2ff] p-6 rounded-xl border border-[#c4c5d9]/30 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center ${s.color}`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div>
              <p className="text-[12px] text-[#747688]">{s.label}</p>
              <p className="text-[20px] font-bold text-[#1e40af]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#c4c5d9]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f2ff] border-b border-[#c4c5d9]">
                {['Thời gian', 'Người thực hiện', 'Hành động', 'Đối tượng', 'IP / Thiết bị', 'Trạng thái'].map((h) => (
                  <th key={h} className="px-6 py-4 text-sm text-[#747688] uppercase tracking-wider font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c5d9]/30">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#747688]">Đang tải...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#747688]">Không có dữ liệu phù hợp</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f5f2ff] transition-all cursor-default">
                    <td className="px-6 py-5 align-top">
                      <p className="text-sm text-[#1e40af]">{new Date(log.timestamp).toLocaleTimeString('vi-VN')}</p>
                      <p className="text-[12px] text-[#747688]">{new Date(log.timestamp).toLocaleDateString('vi-VN')}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-[#eeecff] flex items-center justify-center text-sm font-bold text-[#4958a9]">
                          {log.user.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{log.user}</p>
                          <p className="text-[12px] text-[#747688]">{log.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          log.action.includes('giá') || log.action.includes('Thay đổi') ? 'bg-[#3b82f6]' :
                          log.action.includes('Xóa') ? 'bg-[#ba1a1a]' :
                          log.action.includes('Khóa') ? 'bg-[#4958a9]' :
                          'bg-[#c4c5d9]'
                        }`} />
                        <span className="text-sm font-medium">{log.action}</span>
                      </div>
                      {log.note && <p className="text-[12px] text-[#747688] mt-1 italic">{log.note}</p>}
                    </td>
                    <td className="px-6 py-5">
                      <div className={`px-3 py-1 rounded-lg inline-flex items-center gap-2 ${log.status === 'Failed' ? 'bg-[#ffdad6]' : 'bg-[#e8e6ff]'}`}>
                        <span className={`material-symbols-outlined text-sm ${log.status === 'Failed' ? 'text-[#ba1a1a]' : 'text-[#1e40af]'}`}>
                          {log.target.includes('U_ID') ? 'lock' : log.target.includes('iPhone') ? 'inventory' : 'settings'}
                        </span>
                        <span className={`text-sm ${log.status === 'Failed' ? 'text-[#ba1a1a]' : 'text-[#1e40af]'}`}>
                          {log.target}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm">{log.ip}</p>
                      <p className="text-[12px] text-[#747688]">{log.device}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className={`px-3 py-1 text-sm rounded-full border ${
                        log.status === 'Success' ? 'bg-green-100 text-green-700 border-green-200' :
                        log.status === 'Failed' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {log.status === 'Success' ? 'Thành công' : log.status === 'Failed' ? 'Thất bại' : 'Hệ thống'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-[#f5f2ff] flex items-center justify-between border-t border-[#c4c5d9]">
          <p className="text-[12px] text-[#747688]">Hiển thị {filteredLogs.length} trong tổng số {stats?.total24h ?? 0} hành động</p>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#c4c5d9] text-[#747688] hover:bg-white transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#3b82f6] text-white font-bold text-sm">1</button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#c4c5d9] text-[#747688] hover:bg-white transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
