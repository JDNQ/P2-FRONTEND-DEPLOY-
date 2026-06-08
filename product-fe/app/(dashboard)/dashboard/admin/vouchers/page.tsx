'use client'
import { useState } from 'react'

interface Voucher {
  id: number
  code: string
  icon: string
  iconBg: string
  iconColor: string
  textColor: string
  value: string
  subValue: string
  usagePct: number
  usageLabel: string
  expiry: string
  expirySub: string
  expiryColor: string
  active: boolean
  faded?: boolean
}

const MOCK_VOUCHERS: Voucher[] = [
  { id: 1, code: 'SUMMER24', icon: 'confirmation_number', iconBg: 'bg-[#1e4cfd]/20', iconColor: 'text-[#0035d1]', textColor: 'text-[#0035d1]', value: '15% OFF', subValue: 'Min: $120', usagePct: 65, usageLabel: '325 / 500', expiry: 'Oct 12, 2024', expirySub: '12 days left', expiryColor: 'text-[#303f90]', active: true },
  { id: 2, code: 'FREESHIP', icon: 'local_shipping', iconBg: 'bg-[#4e4fe0]/20', iconColor: 'text-[#3432c8]', textColor: 'text-[#3432c8]', value: '$0.00', subValue: 'Free Delivery', usagePct: 90, usageLabel: '912 / 1000', expiry: 'Sep 30, 2024', expirySub: 'Expiring tomorrow', expiryColor: 'text-[#ba1a1a]', active: true },
  { id: 3, code: 'WELCOME50', icon: 'history', iconBg: 'bg-[#e1dfff]', iconColor: 'text-[#747688]', textColor: 'text-[#747688]', value: '$50.00', subValue: 'Fixed Discount', usagePct: 100, usageLabel: 'Fully Redeemed', expiry: 'Aug 20, 2024', expirySub: 'Ended', expiryColor: 'text-[#747688]', active: false, faded: true },
  { id: 4, code: 'FLASH30', icon: 'new_releases', iconBg: 'bg-[#9aa8ff]/20', iconColor: 'text-[#4958a9]', textColor: 'text-[#4958a9]', value: '30% OFF', subValue: 'Flash Sale', usagePct: 25, usageLabel: '25 / 100', expiry: 'Nov 01, 2024', expirySub: '32 days left', expiryColor: 'text-[#303f90]', active: true },
]

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState(MOCK_VOUCHERS)

  const toggleActive = (id: number) => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, active: !v.active } : v))
  }

  const deleteVoucher = (id: number) => {
    if (confirm('Delete this voucher?')) {
      setVouchers(prev => prev.filter(v => v.id !== id))
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left: Create Form */}
      <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="rounded-2xl shadow-sm border border-[#c4c5d9]/20 p-6 flex-1 overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
          <div className="flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-[#0035d1]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            <h3 className="text-[20px] font-semibold leading-[28px]">Create New Voucher</h3>
          </div>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Voucher Code</label>
              <input
                type="text"
                placeholder="e.g. SUMMER24"
                className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#0035d1] transition-all uppercase placeholder:normal-case outline-none border border-[#c4c5d9]"
                style={{ backgroundColor: '#f5f2ff' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Discount Type</label>
                <select className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#0035d1] transition-all outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }}>
                  <option>Percentage (%)</option>
                  <option>Fixed Amount ($)</option>
                  <option>Free Shipping</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Discount Value</label>
                <input type="number" placeholder="15" className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#0035d1] transition-all outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Min. Order ($)</label>
                <input type="number" placeholder="50" className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#0035d1] transition-all outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Max. Discount ($)</label>
                <input type="number" placeholder="100" className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#0035d1] transition-all outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Validity Period</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="rounded-xl p-3 text-[16px] leading-[24px] outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
                <input type="date" className="rounded-xl p-3 text-[16px] leading-[24px] outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Usage Limit</label>
              <input type="number" placeholder="500 total redemptions" className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#0035d1] transition-all outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #0035d1 0%, #4958a9 100%)',
                  boxShadow: '0 4px 14px 0 rgba(0, 53, 209, 0.25)'
                }}
              >
                Generate Voucher Code
              </button>
              <p className="text-center text-[12px] leading-[16px] text-[#747688] mt-3">Preview: 15% OFF for orders over $50</p>
            </div>
          </form>
        </div>
      </section>

      {/* Right: Vouchers List */}
      <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl flex items-center gap-4 border" style={{ backgroundColor: 'rgba(30, 76, 253, 0.05)', borderColor: 'rgba(0, 53, 209, 0.2)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 53, 209, 0.1)' }}>
              <span className="material-symbols-outlined text-[#0035d1]">analytics</span>
            </div>
            <div>
              <p className="text-[12px] leading-[16px] text-[#0035d1]">Active Now</p>
              <p className="text-[20px] font-semibold leading-[28px]">{vouchers.filter(v => v.active).length} Vouchers</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl flex items-center gap-4 border" style={{ backgroundColor: 'rgba(78, 79, 224, 0.05)', borderColor: 'rgba(52, 50, 200, 0.2)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(52, 50, 200, 0.1)' }}>
              <span className="material-symbols-outlined text-[#3432c8]">payments</span>
            </div>
            <div>
              <p className="text-[12px] leading-[16px] text-[#3432c8]">Total Redeemed</p>
              <p className="text-[20px] font-semibold leading-[28px]">$12,450</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl flex items-center gap-4 border" style={{ backgroundColor: 'rgba(154, 168, 255, 0.05)', borderColor: 'rgba(73, 88, 169, 0.2)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(73, 88, 169, 0.1)' }}>
              <span className="material-symbols-outlined text-[#4958a9]">schedule</span>
            </div>
            <div>
              <p className="text-[12px] leading-[16px] text-[#4958a9]">Expiring Soon</p>
              <p className="text-[20px] font-semibold leading-[28px]">4 Days</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl shadow-sm border border-[#c4c5d9]/20 flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
          <div className="px-6 py-4 border-b border-[#c4c5d9]/10 flex items-center justify-between">
            <h3 className="text-[20px] font-semibold leading-[28px]">Active Vouchers</h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-[#e1dfff] transition-colors text-[#747688]">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-[#e1dfff] transition-colors text-[#747688]">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#dee0ff transparent' }}>
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10" style={{ backgroundColor: '#f5f2ff' }}>
                <tr>
                  <th className="px-6 py-4 text-[14px] leading-[20px] font-medium uppercase tracking-wider">Code</th>
                  <th className="px-6 py-4 text-[14px] leading-[20px] font-medium uppercase tracking-wider">Value</th>
                  <th className="px-6 py-4 text-[14px] leading-[20px] font-medium uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-4 text-[14px] leading-[20px] font-medium uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-4 text-[14px] leading-[20px] font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[14px] leading-[20px] font-medium uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d9]/10">
                {vouchers.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-[#f5f2ff] transition-colors group"
                    style={{ opacity: v.faded ? 0.6 : 1 }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)' }}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${v.iconBg} flex items-center justify-center`}>
                          <span className={`material-symbols-outlined text-sm ${v.iconColor}`}>{v.icon}</span>
                        </div>
                        <span className={`font-bold tracking-wide ${v.textColor}`}>{v.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[16px] leading-[24px] font-semibold">{v.value}</p>
                      <p className="text-[12px] leading-[16px] text-[#747688]">{v.subValue}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: '#e1dfff' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${v.usagePct}%`, backgroundColor: v.active ? '#0035d1' : '#747688' }}
                        />
                      </div>
                      <p className="text-[12px] leading-[16px] text-[#444656] mt-1">{v.usageLabel}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[16px] leading-[24px]">{v.expiry}</p>
                      <p className={`text-[12px] leading-[16px] ${v.expiryColor}`}>{v.expirySub}</p>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => toggleActive(v.id)}
                        className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${v.active ? 'bg-[#0035d1]' : 'bg-[#c4c5d9]'}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white absolute top-0.5 left-0.5 transition-transform duration-200 ${v.active ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-[#747688] hover:text-[#0035d1] hover:bg-[#0035d1]/10 rounded-lg transition-all">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          onClick={() => deleteVoucher(v.id)}
                          className="p-2 text-[#747688] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#f5f2ff' }}>
            <p className="text-[12px] leading-[16px] text-[#444656]">Showing {vouchers.length} of 24 vouchers</p>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#c4c5d9] text-[#747688] hover:text-[#0035d1] hover:border-[#0035d1] transition-all" style={{ backgroundColor: '#ffffff' }}>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-white font-bold text-sm" style={{ backgroundColor: '#0035d1' }}>1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#c4c5d9] hover:bg-[#e1dfff] transition-all font-bold text-sm" style={{ backgroundColor: '#ffffff' }}>2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#c4c5d9] hover:bg-[#e1dfff] transition-all font-bold text-sm" style={{ backgroundColor: '#ffffff' }}>3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#c4c5d9] text-[#747688] hover:text-[#0035d1] hover:border-[#0035d1] transition-all" style={{ backgroundColor: '#ffffff' }}>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
