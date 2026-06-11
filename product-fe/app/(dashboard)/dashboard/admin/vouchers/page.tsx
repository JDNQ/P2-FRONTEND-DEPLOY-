'use client'
import { useVouchers, useCreateVoucher, useDeactivateVoucher } from '@/lib/hooks/useVouchers'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AdminVouchersPage() {
  const { data: vouchers = [], isLoading } = useVouchers()
  const { mutate: createVoucher, isPending: isCreating } = useCreateVoucher()
  const { mutate: deactivate } = useDeactivateVoucher()
  const [page, setPage] = useState(0)
  const [form, setForm] = useState({
    code: '',
    discountType: 'PERCENT',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
  })

  const activeVouchers = vouchers.filter(v => v.isActive)
  const totalUsage = vouchers.reduce((s, v) => s + v.usageCount, 0)
  const paged = vouchers.slice(page * 10, (page + 1) * 10)
  const totalPages = Math.max(1, Math.ceil(vouchers.length / 10))

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left: Create Form */}
      <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="rounded-2xl shadow-sm border border-[#c4c5d9]/20 p-6 flex-1 overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
          <div className="flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-[#3b82f6]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            <h3 className="text-[20px] font-semibold leading-[28px]">Create New Voucher</h3>
          </div>
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault()
            createVoucher({
              code: form.code,
              discountType: form.discountType as 'PERCENT' | 'FIXED',
              discountValue: Number(form.discountValue),
              minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
              maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
              usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
              expiresAt: form.endDate || undefined,
            })
          }}>
            <div className="space-y-2">
              <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Voucher Code</label>
              <input
                type="text"
                placeholder="e.g. SUMMER24"
                value={form.code}
                onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#3b82f6] transition-all uppercase placeholder:normal-case outline-none border border-[#c4c5d9]"
                style={{ backgroundColor: '#f5f2ff' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm(f => ({ ...f, discountType: e.target.value }))}
                  className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#3b82f6] transition-all outline-none border border-[#c4c5d9]"
                  style={{ backgroundColor: '#f5f2ff' }}
                >
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount ($)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Discount Value</label>
                <input type="number" placeholder="15" value={form.discountValue} onChange={(e) => setForm(f => ({ ...f, discountValue: e.target.value }))} className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#3b82f6] transition-all outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Min. Order ($)</label>
                <input type="number" placeholder="50" value={form.minOrderValue} onChange={(e) => setForm(f => ({ ...f, minOrderValue: e.target.value }))} className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#3b82f6] transition-all outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Max. Discount ($)</label>
                <input type="number" placeholder="100" value={form.maxDiscount} onChange={(e) => setForm(f => ({ ...f, maxDiscount: e.target.value }))} className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#3b82f6] transition-all outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Validity Period</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={form.startDate} onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))} className="rounded-xl p-3 text-[16px] leading-[24px] outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
                <input type="date" value={form.endDate} onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))} className="rounded-xl p-3 text-[16px] leading-[24px] outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] leading-[20px] font-medium text-[#444656] block">Usage Limit</label>
              <input type="number" placeholder="500 total redemptions" value={form.usageLimit} onChange={(e) => setForm(f => ({ ...f, usageLimit: e.target.value }))} className="w-full rounded-xl p-3 text-[16px] leading-[24px] focus:ring-2 focus:ring-[#3b82f6] transition-all outline-none border border-[#c4c5d9]" style={{ backgroundColor: '#f5f2ff' }} />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={isCreating}
                className="w-full text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                  boxShadow: '0 4px 14px 0 rgba(0, 53, 209, 0.25)'
                }}
              >
                {isCreating ? 'Creating...' : 'Generate Voucher Code'}
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
              <span className="material-symbols-outlined text-[#3b82f6]">analytics</span>
            </div>
            <div>
              <p className="text-[12px] leading-[16px] text-[#3b82f6]">Active Now</p>
              <p className="text-[20px] font-semibold leading-[28px]">{activeVouchers.length} Vouchers</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl flex items-center gap-4 border" style={{ backgroundColor: 'rgba(78, 79, 224, 0.05)', borderColor: 'rgba(52, 50, 200, 0.2)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(52, 50, 200, 0.1)' }}>
              <span className="material-symbols-outlined text-[#3b82f6]">payments</span>
            </div>
            <div>
              <p className="text-[12px] leading-[16px] text-[#3b82f6]">Total Redeemed</p>
              <p className="text-[20px] font-semibold leading-[28px]">{totalUsage.toLocaleString()}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl flex items-center gap-4 border" style={{ backgroundColor: 'rgba(154, 168, 255, 0.05)', borderColor: 'rgba(73, 88, 169, 0.2)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(73, 88, 169, 0.1)' }}>
              <span className="material-symbols-outlined text-[#4958a9]">schedule</span>
            </div>
            <div>
              <p className="text-[12px] leading-[16px] text-[#4958a9]">Expiring Soon</p>
              <p className="text-[20px] font-semibold leading-[28px]">—</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl shadow-sm border border-[#c4c5d9]/20 flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
          <div className="px-6 py-4 border-b border-[#c4c5d9]/10 flex items-center justify-between">
            <h3 className="text-[20px] font-semibold leading-[28px]">Active Vouchers</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => toast.info('Bộ lọc đang được phát triển!')}
                className="p-2 rounded-lg hover:bg-[#e1dfff] transition-colors text-[#747688]"
              >
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button 
                onClick={() => toast.success('Đã xuất danh sách Voucher thành công!')}
                className="p-2 rounded-lg hover:bg-[#e1dfff] transition-colors text-[#747688]"
              >
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-[#f5f2ff] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
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
                  {paged.map((v) => {
                    const usagePct = v.usageLimit ? Math.min(Math.round((v.usageCount / v.usageLimit) * 100), 100) : 0
                    const isExpired = v.expiresAt ? new Date(v.expiresAt) < new Date() : false
                    const iconName = v.discountType === 'PERCENT' ? 'confirmation_number' : v.discountType === 'FIXED' ? 'local_shipping' : 'new_releases'
                    return (
                      <tr
                        key={v.id}
                        className="hover:bg-[#f5f2ff] transition-colors group"
                        style={{ opacity: !v.isActive || isExpired ? 0.6 : 1 }}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${v.isActive ? 'bg-[#60a5fa]/20' : 'bg-[#e1dfff]'}`}>
                              <span className={`material-symbols-outlined text-sm ${v.isActive ? 'text-[#3b82f6]' : 'text-[#747688]'}`}>{iconName}</span>
                            </div>
                            <span className={`font-bold tracking-wide ${v.isActive ? 'text-[#3b82f6]' : 'text-[#747688]'}`}>{v.code}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-[16px] leading-[24px] font-semibold">
                            {v.discountType === 'PERCENT' ? `${v.discountValue}% OFF` : `$${v.discountValue.toFixed(2)}`}
                          </p>
                          <p className="text-[12px] leading-[16px] text-[#747688]">
                            {v.minOrderValue ? `Min: $${v.minOrderValue}` : 'No minimum'}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: '#e1dfff' }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${usagePct}%`, backgroundColor: v.isActive ? '#3b82f6' : '#747688' }}
                            />
                          </div>
                          <p className="text-[12px] leading-[16px] text-[#444656] mt-1">
                            {v.usageCount}{v.usageLimit ? ` / ${v.usageLimit}` : ''}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-[16px] leading-[24px]">
                            {v.expiresAt ? new Date(v.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No expiry'}
                          </p>
                          <p className={`text-[12px] leading-[16px] ${isExpired ? 'text-[#747688]' : 'text-[#303f90]'}`}>
                            {isExpired ? 'Ended' : v.expiresAt ? `${Math.ceil((new Date(v.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left` : '—'}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => { if (v.isActive) deactivate(v.id) }}
                            className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${v.isActive ? 'bg-[#3b82f6]' : 'bg-[#c4c5d9]'}`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white absolute top-0.5 left-0.5 transition-transform duration-200 ${v.isActive ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => toast.info('Tính năng chỉnh sửa Voucher đang được phát triển!')}
                              className="p-2 text-[#747688] hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-lg transition-all"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button
                              onClick={() => { if (v.isActive) deactivate(v.id) }}
                              className="p-2 text-[#747688] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-lg transition-all"
                            >
                              <span className="material-symbols-outlined">delete</span>
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

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#f5f2ff' }}>
            <p className="text-[12px] leading-[16px] text-[#444656]">Showing {paged.length} of {vouchers.length} vouchers</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#c4c5d9] text-[#747688] hover:text-[#3b82f6] hover:border-[#3b82f6] transition-all disabled:opacity-50"
                style={{ backgroundColor: '#ffffff' }}
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n - 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${
                    page === n - 1 ? 'text-white' : 'border border-[#c4c5d9] hover:bg-[#e1dfff]'
                  }`}
                  style={{ backgroundColor: page === n - 1 ? '#3b82f6' : '#ffffff' }}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#c4c5d9] text-[#747688] hover:text-[#3b82f6] hover:border-[#3b82f6] transition-all disabled:opacity-50"
                style={{ backgroundColor: '#ffffff' }}
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
