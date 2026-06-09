'use client'
import { useServices, useAlerts, useInfrastructure } from '@/lib/hooks/useSystemHealth'

export default function ManagerHealthPage() {
  const { data: services = [], isLoading: servicesLoading } = useServices()
  const { data: alerts = [] } = useAlerts()
  const { data: infra } = useInfrastructure()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold leading-[32px] text-[#08006c]">System Health</h2>
          <p className="text-[14px] leading-[20px] text-[#444656]">Real-time infrastructure monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#e8e6ff] rounded-full text-sm font-bold hover:bg-[#e1dfff] transition-colors">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Update Now
          </button>
          <span className="text-[12px] text-[#747688]">Last checked: Just now</span>
        </div>
      </div>

      {/* Service Status Cards */}
      {servicesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#fcf8ff]/80 p-6 rounded-xl animate-pulse border border-[#c4c5d9]/50">
              <div className="h-4 bg-[#e8e6ff] rounded w-1/2 mb-4" />
              <div className="h-8 bg-[#e8e6ff] rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc) => {
            const statusColors: Record<string, string> = {
              Stable: 'text-green-600 bg-green-50',
              Warning: 'text-yellow-600 bg-yellow-50',
              Active: 'text-green-600 bg-green-50',
              Critical: 'text-[#ba1a1a] bg-red-50',
            }
            const iconBgColors: Record<string, string> = {
              Stable: 'bg-blue-50',
              Warning: 'bg-indigo-50',
              Active: 'bg-blue-50',
              Critical: 'bg-red-50',
            }
            const iconColors: Record<string, string> = {
              Stable: 'text-[#0035d1]',
              Warning: 'text-[#3432c8]',
              Active: 'text-[#4958a9]',
              Critical: 'text-[#ba1a1a]',
            }
            return (
              <div
                key={svc.id}
                className="bg-[#fcf8ff]/80 p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 hover:shadow-lg transition-all duration-300"
                style={{ backdropFilter: 'blur(12px)' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 ${iconBgColors[svc.status] || 'bg-blue-50'} ${iconColors[svc.status] || 'text-[#0035d1]'} rounded-lg`}>
                    <span className="material-symbols-outlined">
                      {svc.name.includes('API') ? 'hub' : svc.name.includes('DB') ? 'database' : svc.name.includes('Cloud') ? 'cloud_done' : 'mail'}
                    </span>
                  </div>
                  <span className={`flex items-center gap-1.5 text-sm font-bold ${statusColors[svc.status] || 'text-green-600 bg-green-50'} px-2 py-0.5 rounded-full`}>
                    <span className="w-2 h-2 rounded-full bg-current relative">
                      <span className="absolute inset-0 rounded-full bg-current animate-ping opacity-75" />
                    </span>
                    {svc.status}
                  </span>
                </div>
                <h3 className="text-[20px] font-semibold mb-1">{svc.name}</h3>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[12px] text-[#444656]">Latency</p>
                    <p className="text-[20px] font-bold leading-[1]">{svc.latency}</p>
                  </div>
                  <div className="h-10 w-full max-w-[100px]">
                    <svg className="w-full h-full fill-none stroke-[2]" viewBox="0 0 100 40">
                      <path d={svc.sparkline} stroke={svc.status === 'Critical' ? '#ba1a1a' : svc.status === 'Warning' ? '#eab308' : svc.status === 'Active' ? '#4958a9' : '#0035d1'} />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Alerts + Infrastructure Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[20px] font-semibold">System Alerts</h4>
            <a className="text-sm text-[#0035d1] hover:underline" href="#">View History</a>
          </div>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-[#747688]">No active alerts</p>
            ) : (
              alerts.map((alert) => {
                const borderColor = alert.type === 'error' ? 'border-[#ba1a1a]' : alert.type === 'warning' ? 'border-yellow-500' : 'border-[#0035d1]'
                const bgColor = alert.type === 'error' ? 'bg-[#ffdad6]/20' : 'bg-[#eeecff]'
                const iconColor = alert.type === 'error' ? 'text-[#ba1a1a]' : alert.type === 'warning' ? 'text-yellow-600' : 'text-[#0035d1]'
                const icon = alert.type === 'error' ? 'report' : alert.type === 'warning' ? 'warning' : 'info'
                return (
                  <div
                    key={alert.id}
                    className={`flex gap-4 p-4 ${bgColor} border-l-4 ${borderColor} rounded-r-xl`}
                  >
                    <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-bold text-[#08006c]">{alert.title}</p>
                        <span className="text-[12px] text-[#747688]">{alert.timestamp}</span>
                      </div>
                      <p className="text-sm text-[#444656] mt-1">{alert.description}</p>
                      {alert.actions && alert.actions.length > 0 && (
                        <div className="mt-3 flex gap-2">
                          {alert.actions.map((action) => (
                            <button
                              key={action.label}
                              className={`px-3 py-1 rounded-lg text-sm font-bold ${
                                action.action === 'restart' ? 'bg-[#ba1a1a] text-white' : 'bg-[#e8e6ff]'
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Infrastructure Stats */}
        <div className="space-y-4">
          <h4 className="text-[20px] font-semibold">Infrastructure Stats</h4>
          <div className="bg-[#f5f2ff] rounded-2xl p-6 border border-[#c4c5d9]/30 space-y-6">
            {/* Disk Usage */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Disk Usage</span>
                <span className="text-[#08006c] font-bold">{infra?.diskUsage ?? '—'}%</span>
              </div>
              <div className="h-2 w-full bg-[#e8e6ff] rounded-full overflow-hidden">
                <div className="h-full bg-[#0035d1] transition-all duration-1000 rounded-full" style={{ width: `${infra?.diskUsage ?? 0}%` }} />
              </div>
              <p className="text-[12px] text-[#444656]">Storage utilization</p>
            </div>

            {/* Network Traffic */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network Traffic</span>
                <span className="text-[#08006c] font-bold">Stable</span>
              </div>
              <div className="flex items-center gap-4 py-2 px-3 bg-[#fcf8ff] rounded-lg">
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#747688] uppercase tracking-wider">Download</span>
                  <span className="text-sm text-green-600">↑ {infra?.networkIn ?? 0} MB/s</span>
                </div>
                <div className="w-px h-8 bg-[#c4c5d9]" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#747688] uppercase tracking-wider">Upload</span>
                  <span className="text-sm text-[#0035d1]">↓ {infra?.networkOut ?? 0} MB/s</span>
                </div>
              </div>
            </div>

            {/* Active Regions */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold pt-2">Active Regions</h5>
              {(infra?.regions ?? []).length === 0 ? (
                <p className="text-sm text-[#747688]">No data</p>
              ) : (
                (infra?.regions ?? []).map((r) => (
                  <div key={r.name} className={`flex items-center justify-between ${r.status === 'offline' ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${r.status === 'active' ? 'bg-green-500' : 'bg-[#747688]'}`} />
                      <span className="text-sm">{r.name}</span>
                    </div>
                    <span className="text-sm capitalize">{r.status}</span>
                  </div>
                ))
              )}
            </div>

            <button className="w-full py-3 bg-[#0035d1] text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">analytics</span>
              Detailed Infrastructure Report
            </button>
          </div>
        </div>
      </div>

      {/* Global Map */}
      <div className="relative w-full h-[300px] bg-[#08006c] rounded-3xl overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center opacity-30">
            <span className="material-symbols-outlined text-8xl text-white">globe</span>
          </div>
        </div>
        <div className="absolute top-10 left-10 z-20">
          <h3 className="text-[24px] font-bold text-white">Global Edge Presence</h3>
          <p className="text-sm text-white/70">Monitoring {infra?.regions?.length ?? 0} edge nodes</p>
        </div>
        <div className="absolute bottom-10 left-10 right-10 z-20 flex justify-between items-end">
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
              <p className="text-[12px] text-white/60">Global Latency</p>
              <p className="text-[20px] font-bold text-white">{infra?.globalLatency ?? '—'}ms Avg</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
              <p className="text-[12px] text-white/60">Node Health</p>
              <p className="text-[20px] font-bold text-green-400">{infra?.nodeHealth ?? '—'}%</p>
            </div>
          </div>
          <button className="bg-white text-[#08006c] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#0035d1] hover:text-white transition-all">
            View Server Map
          </button>
        </div>
      </div>
    </div>
  )
}
