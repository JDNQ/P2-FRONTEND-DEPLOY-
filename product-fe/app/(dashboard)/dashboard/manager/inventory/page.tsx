'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import { formatPrice } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_48 } from '@/lib/utils/placeholder'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

function getSupplyStatus(totalStock: number): { label: string; bg: string; text: string; dot: string } {
  if (totalStock === 0) return { label: 'Hết hàng', bg: 'bg-[#ffdad6]/10', text: 'text-[#ba1a1a]', dot: 'bg-[#ba1a1a]' }
  if (totalStock <= 10) return { label: 'Tồn kho thấp', bg: 'bg-[#ffdad6]/10', text: 'text-[#ba1a1a]', dot: 'bg-[#ba1a1a]' }
  if (totalStock <= 30) return { label: 'Đang nhập hàng', bg: 'bg-[#9aa8ff]/10', text: 'text-[#4958a9]', dot: 'bg-[#4958a9]' }
  return { label: 'Ổn định', bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]', dot: 'bg-[#3b82f6]' }
}

const PLACEHOLDER = PLACEHOLDER_48

export default function ManagerInventoryPage() {
  const { data: products, isLoading } = useProducts()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OUT_OF_STOCK' | 'LOW_STOCK'>('ALL')
  const [selectedShop, setSelectedShop] = useState('ALL')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const list = products || []

  // Calculated stats
  const totalValue = list.reduce((s, p) => s + p.basePrice * p.variants.reduce((ss, v) => ss + v.stock, 0), 0)
  const lowStockCount = list.filter((p) => {
    const t = p.variants.reduce((ss, v) => ss + v.stock, 0)
    return t >= 0 && t <= 10
  }).length

  // Filtered list
  const filteredList = useMemo(() => {
    return list.filter((p) => {
      const totalStock = p.variants.reduce((ss, v) => ss + v.stock, 0)
      if (statusFilter === 'OUT_OF_STOCK') return totalStock === 0
      if (statusFilter === 'LOW_STOCK') return totalStock > 0 && totalStock <= 10
      return true
    })
  }, [list, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredList.length / 10))
  const paged = filteredList.slice((page - 1) * 10, page * 10)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d9]/30 flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start z-10">
            <div className="p-3 bg-[#dee1ff] rounded-xl text-[#3b82f6]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
            <span className="text-green-600 text-sm flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              +4.2% <span className="material-symbols-outlined text-[14px]">trending_up</span>
            </span>
          </div>
          <div className="mt-4 z-10">
            <p className="text-sm text-[#444656] uppercase tracking-wider">Tổng giá trị tồn kho</p>
            <h3 className="text-[24px] font-bold mt-1">{formatPrice(totalValue)}</h3>
          </div>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#3b82f6]/5 rounded-full blur-3xl group-hover:bg-[#3b82f6]/10 transition-colors pointer-events-none" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d9]/30 flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start z-10">
            <div className="p-3 bg-[#ffdad6] rounded-xl text-[#ba1a1a]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <button 
              onClick={() => {
                setStatusFilter('LOW_STOCK')
                setPage(1)
                toast.info('Đang lọc sản phẩm tồn kho thấp')
              }}
              className="text-[#3b82f6] text-sm font-bold hover:underline"
            >
              Chi tiết
            </button>
          </div>
          <div className="mt-4 z-10">
            <p className="text-sm text-[#444656] uppercase tracking-wider">Sản phẩm tồn thấp/hết hàng</p>
            <h3 className="text-[24px] font-bold mt-1">
              {lowStockCount} <span className="text-[20px] font-normal text-[#444656]">mã</span>
            </h3>
          </div>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#ba1a1a]/5 rounded-full blur-3xl group-hover:bg-[#ba1a1a]/10 transition-colors pointer-events-none" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d9]/30 flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start z-10">
            <div className="p-3 bg-[#e1dfff] rounded-xl text-[#3b82f6]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <span className="text-[#3b82f6] text-sm px-2 py-1 bg-[#3b82f6]/10 rounded-full">30 ngày qua</span>
          </div>
          <div className="mt-4 z-10">
            <p className="text-sm text-[#444656] uppercase tracking-wider">Sản phẩm bán chạy</p>
            <h3 className="text-[24px] font-bold mt-1 text-[#1e40af] truncate">
              {list[0]?.productName || 'TL Ultra Pro Max'}
            </h3>
          </div>
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#3b82f6]/5 rounded-full blur-3xl group-hover:bg-[#3b82f6]/10 transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Filters + Table */}
      <div className="bg-white rounded-2xl border border-[#c4c5d9]/30 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#c4c5d9]/30 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <Link
              href="/dashboard/admin/products/new"
              className="px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
              }}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Product
            </Link>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#747688]">Lọc theo Shop</label>
              <select 
                value={selectedShop} 
                onChange={(e) => {
                  setSelectedShop(e.target.value)
                  toast.info('Tính năng lọc theo cửa hàng đang được tích hợp')
                }}
                className="bg-[#f5f2ff] border-none rounded-xl text-sm py-2 px-4 focus:ring-2 focus:ring-[#3b82f6] min-w-[160px] outline-none"
              >
                <option value="ALL">Tất cả Shop</option>
                <option value="HN">Hà Nội - Flagship</option>
                <option value="HCM">TP.HCM - Quận 1</option>
                <option value="DN">Đà Nẵng - Hải Châu</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#747688]">Danh mục</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  toast.info('Tính năng lọc theo danh mục đang được tích hợp')
                }}
                className="bg-[#f5f2ff] border-none rounded-xl text-sm py-2 px-4 focus:ring-2 focus:ring-[#3b82f6] min-w-[160px] outline-none"
              >
                <option value="ALL">Tất cả danh mục</option>
                <option value="ELE">Điện tử & Công nghệ</option>
                <option value="FAS">Thời trang Nam</option>
                <option value="HOM">Gia dụng thông minh</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#747688]">Trạng thái</label>
              <div className="flex items-center bg-[#f5f2ff] rounded-xl p-1">
                {[
                  { label: 'Tất cả', value: 'ALL' },
                  { label: 'Hết hàng', value: 'OUT_OF_STOCK' },
                  { label: 'Tồn thấp', value: 'LOW_STOCK' }
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => {
                      setStatusFilter(t.value as any)
                      setPage(1)
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${statusFilter === t.value ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-[#444656] hover:bg-[#e1dfff]'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={() => toast.success('Đang tạo và xuất báo cáo tồn kho...')}
            className="flex items-center gap-2 text-[#3b82f6] border border-[#3b82f6]/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#3b82f6]/5 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">file_download</span>
            Xuất báo cáo
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse bg-[#eeecff]" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-[#c4c5d9]">inventory_2</span>
            <p className="text-[#444656] mt-4 text-sm">Không tìm thấy sản phẩm nào theo bộ lọc</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#f5f2ff]/50">
                  {['Sản phẩm', 'SKU', 'Tồn kho tổng', 'Giá trị (Đơn vị)', 'Trạng thái cung ứng', 'Hành động'].map((h) => (
                    <th key={h} className="px-6 py-4 text-sm text-[#747688] uppercase tracking-widest font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d9]/30">
                {paged.map((product) => {
                  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
                  const status = getSupplyStatus(totalStock)
                  const primaryImage = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url
                  return (
                    <tr key={product.id} className="group hover:bg-[#f5f2ff]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#e1dfff] flex-shrink-0 overflow-hidden">
                            {primaryImage ? (
                              <img
                                src={primaryImage}
                                alt={product.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#747688]">
                                <span className="material-symbols-outlined">inventory_2</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1e40af]">{product.productName}</p>
                            <p className="text-[12px] text-[#747688]">{product.variants.length} variants</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#444656]">TL-{product.id.toString().padStart(6, '0')}</td>
                      <td className={`px-6 py-4 text-center text-[20px] font-bold ${totalStock <= 10 ? 'text-[#ba1a1a]' : 'text-[#1e40af]'}`}>
                        {totalStock.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#444656]">{formatPrice(product.basePrice)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${status.bg} ${status.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => toast.info('Chức năng điều phối kho cho sản phẩm này đang được xây dựng')}
                          className="w-8 h-8 rounded-full hover:bg-[#e1dfff] flex items-center justify-center text-[#444656] mx-auto"
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredList.length > 0 && (
          <div className="p-6 border-t border-[#c4c5d9]/30 flex items-center justify-between">
            <p className="text-[12px] text-[#747688]">
              Hiển thị {((page - 1) * 10) + 1}-{Math.min(page * 10, filteredList.length)} của {filteredList.length} sản phẩm
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#c4c5d9] text-[#747688] hover:bg-[#f5f2ff] disabled:opacity-30 transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm ${
                    page === n ? 'bg-[#3b82f6] text-white shadow-sm' : 'border border-[#c4c5d9] text-[#444656] hover:bg-[#f5f2ff]'
                  }`}
                >
                  {n}
                </button>
              ))}
              {totalPages > 3 && <span className="px-2 text-[#747688]">...</span>}
              {totalPages > 3 && (
                <button 
                  onClick={() => setPage(totalPages)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border border-[#c4c5d9] text-[#444656] hover:bg-[#f5f2ff] text-sm ${page === totalPages ? 'bg-[#3b82f6] text-white shadow-sm' : ''}`}
                >
                  {totalPages}
                </button>
              )}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#c4c5d9] text-[#747688] hover:bg-[#f5f2ff] disabled:opacity-30 transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
