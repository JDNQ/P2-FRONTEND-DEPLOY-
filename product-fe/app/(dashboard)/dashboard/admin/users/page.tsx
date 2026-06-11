'use client'
import { useUsers, useUserStats, useToggleUserStatus, useDeleteUser } from '@/lib/hooks/useUsers'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AdminUsersPage() {
  const { data: users = [], isLoading: usersLoading } = useUsers()
  const { data: stats } = useUserStats()
  const { mutate: toggleStatus } = useToggleUserStatus()
  const { mutate: deleteUser } = useDeleteUser()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: stats?.totalUsers ?? '—', extra: stats ? `+${stats.totalUsersTrend}%` : null, extraUp: true },
          { label: 'Active Now', value: stats?.activeNow ?? '—', pulse: true },
          { label: 'New This Week', value: stats?.newThisWeek ?? '—', extra: 'Steady' },
          { label: 'Banned', value: stats?.banned ?? '—', extra: 'Warning', isError: true },
        ].map((s) => (
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
            onClick={() => router.push('/dashboard/manager/users/new')}
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
        {usersLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-[#f5f2ff] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
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
                {users.map((u) => {
                  const roleColors: Record<string, { bg: string; text: string; initialsBg: string; initialsColor: string }> = {
                    MANAGER: { bg: 'bg-[#3432c8]/10', text: 'text-[#3432c8]', initialsBg: '#4e4fe0', initialsColor: '#ffffff' },
                    ADMIN: { bg: 'bg-[#1e4cfd]/10', text: 'text-[#0035d1]', initialsBg: '#1e4cfd', initialsColor: '#ffffff' },
                    USER: { bg: 'bg-[#9aa8ff]/30', text: 'text-[#2a3a8a]', initialsBg: '#9aa8ff', initialsColor: '#2a3a8a' },
                  }
                  const rc = roleColors[u.role] || roleColors.USER
                  return (
                    <tr key={u.id} className="hover:bg-[#f5f2ff] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 border-[#0035d1]/20" style={{ backgroundColor: rc.initialsBg, color: rc.initialsColor }}>
                          {u.username.slice(0, 2).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#08006c]">{u.username}</td>
                      <td className="px-6 py-4 text-sm text-[#444656]">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${rc.bg} ${rc.text}`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1 w-fit ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => toggleStatus({ id: u.id, status: u.status === 'Active' ? 'Banned' : 'Active' })} className="p-2 hover:bg-[#1e4cfd] hover:text-[#dbdeff] rounded-lg transition-all" title="Toggle Status">
                            <span className="material-symbols-outlined text-sm">toggle_off</span>
                          </button>
                          <button onClick={() => { if (confirm('Bạn chắc chắn muốn xoá người dùng này?')) deleteUser(u.id) }} className="p-2 hover:bg-[#ffdad6] hover:text-[#ba1a1a] rounded-lg transition-all" title="Delete">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-6 py-4 flex items-center justify-between bg-[#f5f2ff] border-t border-[#c4c5d9]">
          <span className="text-[12px] text-[#444656]">Showing {users.length} users</span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-[#e1dfff] transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#0035d1] text-white font-bold text-[12px]">1</button>
            <button className="p-2 rounded-lg hover:bg-[#e1dfff] transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
