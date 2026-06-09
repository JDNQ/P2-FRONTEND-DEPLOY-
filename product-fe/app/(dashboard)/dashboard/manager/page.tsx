'use client'

const KPI_CARDS = [
  { icon: 'payments', iconBg: 'bg-[#0035d1]/10', iconColor: 'text-[#0035d1]', trend: '+12.5%', trendUp: true, label: 'Total Revenue', value: '$45,280.00' },
  { icon: 'shopping_bag', iconBg: 'bg-[#3432c8]/10', iconColor: 'text-[#3432c8]', trend: '+8.2%', trendUp: true, label: 'Total Orders', value: '1,240' },
  { icon: 'person_add', iconBg: 'bg-[#4958a9]/10', iconColor: 'text-[#4958a9]', trend: '-2.1%', trendUp: false, label: 'New Customers', value: '182' },
  { icon: 'ads_click', iconBg: 'bg-[#ba1a1a]/10', iconColor: 'text-[#ba1a1a]', trend: '+24.0%', trendUp: true, label: 'Conversion Rate', value: '3.42%' },
]

const BARS = [
  { h: '45%', val: '$22k' },
  { h: '65%', val: '$32k' },
  { h: '55%', val: '$28k' },
  { h: '85%', val: '$42k' },
  { h: '70%', val: '$35k' },
  { h: '95%', val: '$48k' },
]

const Y_LABELS = ['50k', '40k', '30k', '20k', '10k', '0']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const ACTIVITIES = [
  { initials: 'JS', name: 'James Smith', action: 'purchased', target: 'Blue Tech Sneaker', time: '2 minutes ago', bg: '#9aa8ff', color: '#2a3a8a' },
  { initials: 'LW', name: 'Lisa Wong', action: 'added', target: '2 items to Wishlist', time: '15 minutes ago', bg: '#4e4fe0', color: '#ffffff' },
  { initials: 'MT', name: 'Marcus Tan', action: 'reviewed', target: 'Leather Backpack', time: '1 hour ago', bg: '#1e4cfd', color: '#dbdeff' },
  { initials: 'EK', name: 'Elena K.', action: 'returned', target: 'Wireless Headphones', time: 'Processing Return', bg: '#9aa8ff', color: '#2a3a8a', isReturn: true },
]

const PRODUCTS = [
  { name: 'Neon Sprint Runners', category: 'Footwear', price: '$129.00', sales: '452 units', stock: '12 in stock', tag: 'Promoted', tagBg: 'bg-blue-100', tagText: 'text-blue-700' },
  { name: 'Urban Leather Pack', category: 'Accessories', price: '$89.50', sales: '328 units', stock: '45 in stock', tag: 'Selling Fast', tagBg: 'bg-green-100', tagText: 'text-green-700' },
  { name: 'Sonic Pro Wireless', category: 'Electronics', price: '$199.99', sales: '295 units', stock: 'Out of Stock', tag: 'Best Value', tagBg: 'bg-purple-100', tagText: 'text-purple-700', stockError: true },
]

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
  return (
    <>
      <style>{`@keyframes growUp{from{height:0}to{height:var(--final-height)}}.bar-animate{animation:growUp 1s ease-out forwards}`}</style>

      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {KPI_CARDS.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-[#fcf8ff] p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 transition-all cursor-default"
              style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={(e) => CardHover(e, true)}
              onMouseLeave={(e) => CardHover(e, false)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`p-2 rounded-lg ${kpi.iconBg} ${kpi.iconColor} material-symbols-outlined`}>
                  {kpi.icon}
                </span>
                <span className={`font-bold text-xs flex items-center gap-1 ${kpi.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.trend}
                  <span className="material-symbols-outlined text-[16px]">
                    {kpi.trendUp ? 'trending_up' : 'trending_down'}
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
          {/* Revenue Overview Chart */}
          <div
            className="lg:col-span-2 bg-[#fcf8ff] p-6 rounded-xl shadow-sm border border-[#c4c5d9]/50 flex flex-col"
            style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
            onMouseEnter={(e) => CardHover(e, true)}
            onMouseLeave={(e) => CardHover(e, false)}
          >
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[20px] font-semibold leading-[28px]">Revenue Overview</h4>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-full bg-[#1e4cfd] text-white text-sm font-bold">Weekly</button>
                <button className="px-3 py-1 rounded-full text-[#444656] text-sm font-bold hover:bg-[#eeecff]">Monthly</button>
              </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-4 h-64 px-4 relative">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-[#444656] opacity-50 pr-4">
                {Y_LABELS.map((l) => (<span key={l}>{l}</span>))}
              </div>
              <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between opacity-5 pointer-events-none">
                {[1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="border-b border-[#08006c]" />))}
              </div>
              <div className="flex-1 flex items-end justify-around h-full pl-8">
                {BARS.map((bar, i) => (
                  <div
                    key={i}
                    className="group relative w-12 bg-[#0035d1]/20 rounded-t-lg hover:bg-[#0035d1] transition-colors bar-animate"
                    style={{ '--final-height': bar.h, height: 0 } as React.CSSProperties}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#08006c] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {bar.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-around mt-4 pl-12 text-[12px] font-bold text-[#444656]">
              {DAYS.map((d) => (<span key={d}>{d}</span>))}
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
              {ACTIVITIES.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {item.name}{' '}
                      <span className="font-normal text-[#444656] opacity-70">{item.action}</span>{' '}
                      {item.target}
                    </p>
                    <p className={`text-xs ${item.isReturn ? 'text-[#ba1a1a] font-medium' : 'text-[#444656]'}`}>
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-2 text-[#0035d1] font-bold text-sm hover:underline">View All Logs</button>
          </div>
        </div>

        {/* Top Performing Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[20px] font-semibold leading-[28px]">Top Performing Products</h4>
            <button className="text-[#0035d1] font-bold text-sm flex items-center gap-1">
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
                {PRODUCTS.map((p, i) => (
                  <tr key={i} className="hover:bg-[#0035d1]/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#eeecff] overflow-hidden shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#4958a9]">inventory_2</span>
                        </div>
                        <span className="text-sm font-bold group-hover:text-[#0035d1]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{p.category}</td>
                    <td className="px-6 py-4 font-bold">{p.price}</td>
                    <td className="px-6 py-4 font-bold">{p.sales}</td>
                    <td className={`px-6 py-4 text-sm ${p.stockError ? 'text-[#ba1a1a] font-medium' : 'text-[#444656]'}`}>
                      {p.stock}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${p.tagBg} ${p.tagText}`}>
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
