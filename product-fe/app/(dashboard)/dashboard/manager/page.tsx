'use client'
import { useManagerDashboard } from '@/lib/hooks/useDashboard'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function CardHover(e: React.MouseEvent<HTMLDivElement>, enter: boolean) {
  const el = e.currentTarget
  if (enter) {
    el.style.transform = 'translateY(-4px)'
    el.style.boxShadow = '0 10px 15px -3px rgba(71,71,208,0.15)'
  } else {
    el.style.transform = ''
    el.style.boxShadow = ''
  }
}

export default function ManagerDashboardPage() {
  const router = useRouter()
  const { data: dashboard, isLoading } = useManagerDashboard()

  if (isLoading || !dashboard) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#fcf8ff] p-6 rounded-xl animate-pulse">
              <div className="h-4 bg-[#e8e6ff] rounded w-1/2 mb-3" />
              <div className="h-8 bg-[#e8e6ff] rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { kpis, revenue, topProducts, recentActivities } = dashboard

  return (
    <>
      <style>{`@keyframes growUp{from{height:0}to{height:var(--final-height)}}.bar-animate{animation:growUp 1s ease-out forwards}`}</style>

      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-[#fcf8ff] p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 transition-all cursor-default"
              style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={(e) => CardHover(e, true)}
              onMouseLeave={(e) => CardHover(e, false)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`p-2 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] material-symbols-outlined`}>
                  {kpi.icon}
                </span>
                <span className={`font-bold text-xs flex items-center gap-1 ${kpi.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.trend >= 0 ? '+' : ''}{kpi.trend}%
                  <span className="material-symbols-outlined text-[16px]">
                    {kpi.trend >= 0 ? 'trending_up' : 'trending_down'}
                  </span>
                </span>
              </div>
              <p className="text-sm text-[#444656] font-medium">{kpi.label}</p>
              <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
            </div>
          ))}
        </div>

        {/* Revenue Chart + User Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 bg-[#fcf8ff] p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 flex flex-col"
            style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
            onMouseEnter={(e) => CardHover(e, true)}
            onMouseLeave={(e) => CardHover(e, false)}
          >
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[20px] font-semibold leading-[28px]">Revenue Overview</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => toast.info('Chế độ xem hàng tuần đang được hiển thị')}
                  className="px-3 py-1 rounded-full bg-[#60a5fa] text-white text-sm font-bold"
                >
                  Weekly
                </button>
                <button 
                  onClick={() => toast.info('Tính năng biểu đồ hàng tháng đang được phát triển!')}
                  className="px-3 py-1 rounded-full text-[#444656] text-sm font-bold hover:bg-[#eeecff]"
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-4 h-64 px-4 relative">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-[#444656] opacity-50 pr-4">
                {['50k', '40k', '30k', '20k', '10k', '0'].map((l) => (<span key={l}>{l}</span>))}
              </div>
              <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between opacity-5 pointer-events-none">
                {[1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="border-b border-[#1e40af]" />))}
              </div>
              <div className="flex-1 flex items-end justify-around h-full pl-8">
                {revenue.map((bar, i) => (
                  <div
                    key={i}
                    className="group relative w-12 bg-[#3b82f6]/20 rounded-t-lg hover:bg-[#3b82f6] transition-colors bar-animate"
                    style={{ '--final-height': `${bar.value}%`, height: 0 } as React.CSSProperties}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1e40af] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {bar.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-around mt-4 pl-12 text-[12px] font-bold text-[#444656]">
              {revenue.map((d) => (<span key={d.label}>{d.label}</span>))}
            </div>
          </div>

          {/* User Activity */}
          <div
            className="bg-[#fcf8ff] p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50"
            style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
            onMouseEnter={(e) => CardHover(e, true)}
            onMouseLeave={(e) => CardHover(e, false)}
          >
            <h4 className="text-[20px] font-semibold leading-[28px] mb-6">User Activity</h4>
            <div className="space-y-6">
              {recentActivities.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                    style={{ backgroundColor: item.initialsBg, color: '#ffffff' }}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {item.name}{' '}
                      <span className="font-normal text-[#444656] opacity-70">{item.action}</span>{' '}
                      {item.target}
                    </p>
                    <p className={`text-xs text-[#444656]`}>
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => router.push('/dashboard/manager/logs')}
              className="w-full mt-8 py-2 text-[#3b82f6] font-bold text-sm hover:underline"
            >
              View All Logs
            </button>
          </div>
        </div>

        {/* Top Performing Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[20px] font-semibold leading-[28px]">Top Performing Products</h4>
            <button 
              onClick={() => router.push('/dashboard/manager/inventory')}
              className="text-[#3b82f6] font-bold text-sm flex items-center gap-1"
            >
              Full Report <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
            </button>
          </div>

          <div className="bg-[#fcf8ff] rounded-xl border border-[#c4c5d9]/50 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#f5f2ff] border-b border-[#c4c5d9]">
                <tr>
                  {['Product', 'Category', 'Price', 'Sales', 'Stock', 'Status'].map((h) => (
                    <th key={h} className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-[#444656] opacity-80">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d9]/30">
                {topProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#3b82f6]/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#eeecff] overflow-hidden shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#4958a9]">inventory_2</span>
                        </div>
                        <span className="text-sm font-bold group-hover:text-[#3b82f6]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{p.category}</td>
                    <td className="px-6 py-4 font-bold">{p.price}</td>
                    <td className="px-6 py-4 font-bold">{p.sales}</td>
                    <td className={`px-6 py-4 text-sm ${p.stock <= 0 ? 'text-[#ba1a1a] font-medium' : 'text-[#444656]'}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
                        p.tag === 'Promoted' ? 'bg-blue-100 text-blue-700' :
                        p.tag === 'Selling Fast' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {p.tag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
