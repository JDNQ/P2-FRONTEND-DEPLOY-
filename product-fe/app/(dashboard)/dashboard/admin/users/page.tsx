'use client'

const USERS = [
  { username: 'alex_morgan', email: 'alex.morgan@tlmarket.com', role: 'Manager', status: 'Active', initials: 'AM', roleBg: 'bg-[#3432c8]/10', roleText: 'text-[#3432c8]', initialsBg: '#4e4fe0', initialsColor: '#ffffff' },
  { username: 'sarah_k', email: 's.kim@outlook.com', role: 'Customer', status: 'Active', initials: 'SK', roleBg: 'bg-[#9aa8ff]/30', roleText: 'text-[#2a3a8a]', initialsBg: '#9aa8ff', initialsColor: '#2a3a8a' },
  { username: 'john_doe_99', email: 'j.doe@gmail.com', role: 'Customer', status: 'Banned', initials: 'JD', roleBg: 'bg-[#9aa8ff]/30', roleText: 'text-[#2a3a8a]', initialsBg: '#9aa8ff', initialsColor: '#2a3a8a' },
  { username: 'elena_tech', email: 'elena@techflow.io', role: 'Manager', status: 'Active', initials: 'ET', roleBg: 'bg-[#3432c8]/10', roleText: 'text-[#3432c8]', initialsBg: '#4e4fe0', initialsColor: '#ffffff' },
]

const STATS = [
  { label: 'Total Users', value: '12,482', extra: '+12%', extraUp: true },
  { label: 'Active Now', value: '1,204', pulse: true },
  { label: 'New This Week', value: '456', extra: 'Steady' },
  { label: 'Banned', value: '24', extra: 'Warning', isError: true },
]

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-xl shadow-sm border border-[#c4c5d9]/30 flex flex-col gap-1 hover:shadow-lg transition-all">
            <span className="text-[12px] font-bold text-[#747688] uppercase tracking-wider">{s.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-[30px] font-bold text-[#08006c]">{s.value}</span>
              {s.extra && (
                <span className={`font-bold flex items-center text-[12px] ${s.isError ? 'text-[#ba1a1a]' : 'text-green-600'}`}>
                  {!s.isError && <span className="material-symbols-outlined text-xs">trending_up</span>}
                  {s.isError && <span className="material-symbols-outlined text-xs">security</span>}
                  {s.extra}
                </span>
              )}
              {s.pulse && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mb-2" />}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#c4c5d9]/30 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c4c5d9]/20">
          <h3 className="text-[16px] font-semibold text-[#08006c]">All Users</h3>
          <button
            className="px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all active:scale-95 text-white"
            style={{
              background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
              boxShadow: '0 4px 14px 0 rgba(30, 76, 253, 0.25)',
            }}
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Create Manager
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f2ff] border-b border-[#c4c5d9]">
                {['Avatar', 'Username', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-[#444656]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c5d9]/20">
              {USERS.map((u) => (
                <tr key={u.username} className="hover:bg-[#f5f2ff] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 border-[#0035d1]/20" style={{ backgroundColor: u.initialsBg, color: u.initialsColor }}>
                      {u.initials}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#08006c]">{u.username}</td>
                  <td className="px-6 py-4 text-sm text-[#444656]">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${u.roleBg} ${u.roleText}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1 w-fit ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-[#1e4cfd] hover:text-[#dbdeff] rounded-lg transition-all" title="Edit">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button className="p-2 hover:bg-[#ffdad6] hover:text-[#ba1a1a] rounded-lg transition-all" title="Delete">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 flex items-center justify-between bg-[#f5f2ff] border-t border-[#c4c5d9]">
          <span className="text-[12px] text-[#444656]">Showing 1 to 4 of 12,482 users</span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-[#e1dfff] transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {[1, 2, 3].map((n) => (
              <button key={n} className={`w-8 h-8 rounded-lg font-bold text-[12px] ${n === 1 ? 'bg-[#0035d1] text-white' : 'hover:bg-[#e1dfff] text-[#444656]'}`}>{n}</button>
            ))}
            <span className="text-[12px] px-2 text-[#444656]">...</span>
            <button className="w-8 h-8 rounded-lg hover:bg-[#e1dfff] text-[#444656] font-bold text-[12px]">312</button>
            <button className="p-2 rounded-lg hover:bg-[#e1dfff] transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
