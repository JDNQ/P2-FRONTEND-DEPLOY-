'use client'

const SERVICES = [
  { name: 'API Gateway', icon: 'hub', iconBg: 'bg-blue-50', iconColor: 'text-[#0035d1]', status: 'Stable', statusColor: 'text-green-600 bg-green-50', metric: 'Latency', value: '42ms', path: 'M0 35 L10 32 L20 38 L30 30 L40 33 L50 25 L60 28 L70 20 L80 25 L90 22 L100 15', stroke: '#0035d1' },
  { name: 'DB Cluster', icon: 'database', iconBg: 'bg-indigo-50', iconColor: 'text-[#3432c8]', status: 'Warning', statusColor: 'text-yellow-600 bg-yellow-50', metric: 'Load', value: '84%', path: 'M0 15 L15 12 L30 25 L45 28 L60 10 L75 8 L100 5', stroke: '#eab308' },
  { name: 'Cloudinary', icon: 'cloud_done', iconBg: 'bg-blue-50', iconColor: 'text-[#4958a9]', status: 'Active', statusColor: 'text-green-600 bg-green-50', metric: 'Uptime', value: '99.98%', path: 'M0 20 L20 20 L40 18 L60 20 L80 20 L100 20', stroke: '#4958a9' },
  { name: 'Email Service', icon: 'mail', iconBg: 'bg-red-50', iconColor: 'text-[#ba1a1a]', status: 'Critical', statusColor: 'text-[#ba1a1a] bg-red-50', metric: 'Fail Rate', value: '12.4%', path: 'M0 10 L20 30 L40 15 L60 38 L80 12 L100 35', stroke: '#ba1a1a' },
]

const ALERTS = [
  { severity: 'error', icon: 'report', iconColor: 'text-[#ba1a1a]', border: 'border-[#ba1a1a]', bg: 'bg-[#ffdad6]/20', title: 'Email Queue Overflow', time: '2 mins ago', desc: 'SMTP server is responding slowly. Over 1,500 transactional emails are currently queued in the primary outbound buffer.', actions: true },
  { severity: 'warning', icon: 'warning', iconColor: 'text-yellow-600', border: 'border-yellow-500', bg: 'bg-[#eeecff]', title: 'Database CPU Usage High', time: '15 mins ago', desc: "Cluster 'db-main-01' reached 84% CPU utilization. Auto-scaling triggered. New node initialization in progress.", actions: false },
  { severity: 'info', icon: 'info', iconColor: 'text-[#0035d1]', border: 'border-[#0035d1]', bg: 'bg-[#eeecff]', title: 'Scheduled Maintenance Complete', time: '1 hour ago', desc: 'Routine security patches applied to API Gateway. No downtime recorded during the operation.', actions: false, dim: true },
]

const REGIONS = [
  { name: 'US East (N. Virginia)', status: 'Active', dot: 'bg-green-500' },
  { name: 'EU (Frankfurt)', status: 'Active', dot: 'bg-green-500' },
  { name: 'Asia Pacific (Singapore)', status: 'Offline', dot: 'bg-[#747688]', dim: true },
]

export default function ManagerHealthPage() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((svc) => (
          <div
            key={svc.name}
            className="bg-[#fcf8ff]/80 p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 hover:shadow-lg transition-all duration-300"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 ${svc.iconBg} ${svc.iconColor} rounded-lg`}>
                <span className="material-symbols-outlined">{svc.icon}</span>
              </div>
              <span className={`flex items-center gap-1.5 text-sm font-bold ${svc.statusColor} px-2 py-0.5 rounded-full`}>
                <span className="w-2 h-2 rounded-full bg-current relative">
                  <span className="absolute inset-0 rounded-full bg-current animate-ping opacity-75" />
                </span>
                {svc.status}
              </span>
            </div>
            <h3 className="text-[20px] font-semibold mb-1">{svc.name}</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[12px] text-[#444656]">{svc.metric}</p>
                <p className="text-[20px] font-bold leading-[1]">{svc.value}</p>
              </div>
              <div className="h-10 w-full max-w-[100px]">
                <svg className="w-full h-full fill-none stroke-[2]" viewBox="0 0 100 40">
                  <path d={svc.path} stroke={svc.stroke} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts + Infrastructure Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[20px] font-semibold">System Alerts</h4>
            <a className="text-sm text-[#0035d1] hover:underline" href="#">View History</a>
          </div>
          <div className="space-y-3">
            {ALERTS.map((alert, i) => (
              <div
                key={i}
                className={`flex gap-4 p-4 ${alert.bg} border-l-4 ${alert.border} rounded-r-xl ${alert.dim ? 'opacity-60' : ''}`}
              >
                <span className={`material-symbols-outlined ${alert.iconColor}`}>{alert.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-bold text-[#08006c]">{alert.title}</p>
                    <span className="text-[12px] text-[#747688]">{alert.time}</span>
                  </div>
                  <p className="text-sm text-[#444656] mt-1">{alert.desc}</p>
                  {alert.actions && (
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1 bg-[#ba1a1a] text-white rounded-lg text-sm font-bold">Restart Service</button>
                      <button className="px-3 py-1 bg-[#e8e6ff] rounded-lg text-sm font-bold">Ignore</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
                <span className="text-[#08006c] font-bold">64.2%</span>
              </div>
              <div className="h-2 w-full bg-[#e8e6ff] rounded-full overflow-hidden">
                <div className="h-full bg-[#0035d1] transition-all duration-1000 rounded-full" style={{ width: '64.2%' }} />
              </div>
              <p className="text-[12px] text-[#444656]">2.4 TB / 4 TB utilized</p>
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
                  <span className="text-sm text-green-600">↑ 142 MB/s</span>
                </div>
                <div className="w-px h-8 bg-[#c4c5d9]" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#747688] uppercase tracking-wider">Upload</span>
                  <span className="text-sm text-[#0035d1]">↓ 89 MB/s</span>
                </div>
              </div>
            </div>

            {/* Active Regions */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold pt-2">Active Regions</h5>
              {REGIONS.map((r) => (
                <div key={r.name} className={`flex items-center justify-between ${r.dim ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${r.dot}`} />
                    <span className="text-sm">{r.name}</span>
                  </div>
                  <span className="text-sm">{r.status}</span>
                </div>
              ))}
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
          <p className="text-sm text-white/70">Monitoring 24 edge nodes across 12 countries</p>
        </div>
        <div className="absolute bottom-10 left-10 right-10 z-20 flex justify-between items-end">
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
              <p className="text-[12px] text-white/60">Global Latency</p>
              <p className="text-[20px] font-bold text-white">128ms Avg</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
              <p className="text-[12px] text-white/60">Node Health</p>
              <p className="text-[20px] font-bold text-green-400">96.5%</p>
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
