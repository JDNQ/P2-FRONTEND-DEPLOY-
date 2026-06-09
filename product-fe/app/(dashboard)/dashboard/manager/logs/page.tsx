'use client'

const LOGS = [
  { time: '14:23:45', date: '28/10/2023', user: 'minh.nguyen', role: 'Super Admin', actionDot: 'bg-[#0035d1]', action: 'Thay đổi giá sản phẩm', note: 'Tăng giá niêm yết +10%', target: 'iPhone 15 Pro Max', targetIcon: 'inventory', ip: '192.168.1.42', device: 'Chrome (MacOS)', status: 'Thành công', statusBg: 'bg-green-100', statusText: 'text-green-700', border: 'border-green-200' },
  { time: '13:10:02', date: '28/10/2023', user: 'hoang.le', role: 'Manager', actionDot: 'bg-[#ba1a1a]', action: 'Xóa người dùng', target: 'customer_id_9921', targetIcon: 'person_remove', targetError: true, ip: '203.113.168.21', device: 'Firefox (Windows)', status: 'Thành công', statusBg: 'bg-green-100', statusText: 'text-green-700', border: 'border-green-200' },
  { time: '10:45:12', date: '28/10/2023', user: 'trang.dang', role: 'Operator', actionDot: 'bg-[#c4c5d9]', action: 'Cập nhật cấu hình site', target: 'Giao diện (Dark Mode)', targetIcon: 'settings', ip: '118.69.190.154', device: 'Safari (iPhone)', status: 'Thất bại', statusBg: 'bg-red-100', statusText: 'text-red-700', border: 'border-red-200' },
  { time: '09:12:33', date: '28/10/2023', user: 'security_bot', role: 'System Automated', actionDot: 'bg-[#4958a9]', action: 'Khóa phiên đăng nhập', target: 'U_ID_4522', targetIcon: 'lock', ip: 'N/A', device: 'Cron Job #12', status: 'Hệ thống', statusBg: 'bg-blue-100', statusText: 'text-blue-700', border: 'border-blue-200' },
]

const STATS = [
  { icon: 'history', bg: 'bg-blue-100', color: 'text-blue-600', label: 'Hành động 24h', value: '1,284' },
  { icon: 'check_circle', bg: 'bg-green-100', color: 'text-green-600', label: 'Thành công', value: '99.8%' },
  { icon: 'warning', bg: 'bg-red-100', color: 'text-red-600', label: 'Cảnh báo bảo mật', value: '3' },
  { icon: 'shield', bg: 'bg-purple-100', color: 'text-purple-600', label: 'Địa chỉ IP lạ', value: '0' },
]

export default function ManagerLogsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-bold leading-[32px] text-[#08006c]">Nhật Ký Hoạt Động</h2>
        <button className="flex items-center gap-2 bg-[#1e4cfd] text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-transform active:scale-95">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c4c5d9] focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] bg-[#fcf8ff]/50 text-sm outline-none transition-all"
              />
            </div>
          </div>
          <div className="w-48">
            <label className="block text-sm text-[#747688] mb-2">Loại hành động</label>
            <select className="w-full py-2.5 px-4 rounded-xl border border-[#c4c5d9] bg-[#fcf8ff]/50 text-sm outline-none appearance-none">
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
            <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#e8e6ff] text-[#08006c] hover:bg-[#e1dfff] transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="bg-[#f5f2ff] p-6 rounded-xl border border-[#c4c5d9]/30 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center ${s.color}`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div>
              <p className="text-[12px] text-[#747688]">{s.label}</p>
              <p className="text-[20px] font-bold text-[#08006c]">{s.value}</p>
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
              {LOGS.map((log, i) => (
                <tr key={i} className="hover:bg-[#f5f2ff] transition-all cursor-default">
                  <td className="px-6 py-5 align-top">
                    <p className="text-sm text-[#08006c]">{log.time}</p>
                    <p className="text-[12px] text-[#747688]">{log.date}</p>
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
                      <span className={`w-2 h-2 rounded-full shrink-0 ${log.actionDot}`} />
                      <span className="text-sm font-medium">{log.action}</span>
                    </div>
                    {log.note && <p className="text-[12px] text-[#747688] mt-1 italic">{log.note}</p>}
                  </td>
                  <td className="px-6 py-5">
                    <div className={`px-3 py-1 rounded-lg inline-flex items-center gap-2 ${log.targetError ? 'bg-[#ffdad6]' : 'bg-[#e8e6ff]'}`}>
                      <span className={`material-symbols-outlined text-sm ${log.targetError ? 'text-[#ba1a1a]' : 'text-[#08006c]'}`}>
                        {log.targetIcon}
                      </span>
                      <span className={`text-sm ${log.targetError ? 'text-[#ba1a1a]' : 'text-[#08006c]'}`}>
                        {log.target}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm">{log.ip}</p>
                    <p className="text-[12px] text-[#747688]">{log.device}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`px-3 py-1 text-sm rounded-full border ${log.statusBg} ${log.statusText} ${log.border}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-[#f5f2ff] flex items-center justify-between border-t border-[#c4c5d9]">
          <p className="text-[12px] text-[#747688]">Hiển thị 1 - 20 trong tổng số 1,284 hành động</p>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#c4c5d9] text-[#747688] hover:bg-white transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold text-sm ${
                  n === 1 ? 'bg-[#0035d1] text-white' : 'text-[#08006c] hover:bg-white transition-colors'
                }`}
              >
                {n}
              </button>
            ))}
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#c4c5d9] text-[#747688] hover:bg-white transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
