'use client'
import { useProducts, useDeleteProduct } from '@/lib/hooks/useProducts'
import { formatPrice } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_48 } from '@/lib/utils/placeholder'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

const PAGE_SIZE = 10

type SortField = 'name' | 'price' | 'stock' | 'newest'
type SortDir = 'asc' | 'desc'
type StockFilter = 'all' | 'instock' | 'low' | 'outofstock'

function getRowStatus(stock: number): { label: string; bg: string; text: string; dot: string; pulse?: boolean } {
  if (stock === 0) return { label: 'Out of Stock', bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]', dot: '' }
  if (stock <= 10) return { label: `Low Stock (${stock})`, bg: 'bg-[#e1dfff]', text: 'text-[#3b82f6]', dot: '' }
  return { label: `In Stock (${stock})`, bg: 'bg-[#dee1ff]', text: 'text-[#3b82f6]', dot: 'bg-[#3b82f6]', pulse: true }
}

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts()
  const deleteProduct = useDeleteProduct()
  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('newest')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')

  const list = useMemo(() => {
    let result = products || []

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          `TL-${p.id.toString().padStart(6, '0')}`.toLowerCase().includes(q),
      )
    }

    // Stock filter
    if (stockFilter === 'instock') {
      result = result.filter((p) => p.variants.reduce((s, v) => s + v.stock, 0) > 10)
    } else if (stockFilter === 'low') {
      result = result.filter((p) => {
        const t = p.variants.reduce((s, v) => s + v.stock, 0)
        return t > 0 && t <= 10
      })
    } else if (stockFilter === 'outofstock') {
      result = result.filter((p) => p.variants.reduce((s, v) => s + v.stock, 0) === 0)
    }

    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sortField === 'name') cmp = a.productName.localeCompare(b.productName)
      else if (sortField === 'price') cmp = a.basePrice - b.basePrice
      else if (sortField === 'stock') {
        const sa = a.variants.reduce((s, v) => s + v.stock, 0)
        const sb = b.variants.reduce((s, v) => s + v.stock, 0)
        cmp = sa - sb
      }
      else cmp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [products, search, sortField, sortDir, stockFilter])

  const totalUnits = list.reduce((s, p) => s + p.variants.reduce((ss, v) => ss + v.stock, 0), 0)
  const inStockCount = list.filter((p) => p.variants.reduce((ss, v) => ss + v.stock, 0) > 10).length
  const lowStockCount = list.filter((p) => {
    const t = p.variants.reduce((ss, v) => ss + v.stock, 0)
    return t > 0 && t <= 10
  }).length
  const outOfStockCount = list.filter((p) => p.variants.reduce((ss, v) => ss + v.stock, 0) === 0).length

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const paged = list.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('ellipsis')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('ellipsis')
      pages.push(totalPages)
    }
    return pages
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('asc') }
    setCurrentPage(1)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="material-symbols-outlined text-[16px]">swap_vert</span>
    return (
      <span className="material-symbols-outlined text-[16px]">
        {sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl shadow-sm border border-[#c4c5d9]/30 flex flex-col gap-2 bg-white">
          <p className="text-[12px] leading-[16px] text-[#747688] uppercase font-bold">Total Items</p>
          <p className="text-[28px] font-extrabold leading-[1.2]">{list.length}</p>
          <div className="flex items-center gap-1 text-green-600 text-[12px] leading-[16px] font-bold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            +{(products?.length || 0) > 0 ? ((list.length / (products?.length || 1)) * 100).toFixed(0) : 0}% filtered
          </div>
        </div>
        <div className="p-6 rounded-xl shadow-sm border border-[#c4c5d9]/30 flex flex-col gap-2 bg-white">
          <p className="text-[12px] leading-[16px] text-[#747688] uppercase font-bold">In Stock</p>
          <p className="text-[28px] font-extrabold leading-[1.2]" style={{ color: '#3b82f6' }}>{inStockCount}</p>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#eeecff' }}>
            <div className="h-full rounded-full" style={{ width: `${list.length ? (inStockCount / list.length) * 100 : 0}%`, backgroundColor: '#3b82f6' }} />
          </div>
        </div>
        <div className="p-6 rounded-xl shadow-sm border border-[#c4c5d9]/30 flex flex-col gap-2 bg-white">
          <p className="text-[12px] leading-[16px] text-[#747688] uppercase font-bold">Low Stock</p>
          <p className="text-[28px] font-extrabold leading-[1.2]" style={{ color: '#3b82f6' }}>{lowStockCount}</p>
          <div className="flex items-center gap-1 text-[12px] leading-[16px] font-bold" style={{ color: '#3b82f6' }}>
            <span className="material-symbols-outlined text-[16px]">warning</span> Requires attention
          </div>
        </div>
        <div className="p-6 rounded-xl shadow-sm border border-[#c4c5d9]/30 flex flex-col gap-2 bg-white">
          <p className="text-[12px] leading-[16px] text-[#747688] uppercase font-bold">Out of Stock</p>
          <p className="text-[28px] font-extrabold leading-[1.2]" style={{ color: '#ba1a1a' }}>{outOfStockCount}</p>
          <div className="flex items-center gap-1 text-[12px] leading-[16px] font-bold" style={{ color: '#ba1a1a' }}>
            <span className="material-symbols-outlined text-[16px]">error</span> Inactive listings
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-sm border border-[#c4c5d9]/50 overflow-hidden bg-white">
        {/* Header Actions */}
        <div className="px-6 py-4 border-b border-[#c4c5d9]/30 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between" style={{ backgroundColor: '#f5f2ff' }}>
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/dashboard/admin/products/new"
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-[14px] leading-[20px] font-bold text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #3b82f6 100%)',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
              }}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Product
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747688] text-[18px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                placeholder="Tìm sản phẩm..."
                className="w-48 pl-9 pr-3 py-1.5 rounded-lg border border-[#c4c5d9] text-sm outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 transition-all bg-white"
              />
            </div>
            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => { setStockFilter(e.target.value as StockFilter); setCurrentPage(1) }}
              className="px-3 py-1.5 rounded-lg border border-[#c4c5d9] text-sm outline-none focus:border-[#3b82f6] bg-white text-[#444656]"
            >
              <option value="all">Tất cả</option>
              <option value="instock">Còn hàng</option>
              <option value="low">Sắp hết</option>
              <option value="outofstock">Hết hàng</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: '#eeecff' }} />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-[#c4c5d9]">inventory_2</span>
            <p className="text-[#444656] mt-4 text-sm">Không tìm thấy sản phẩm nào</p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-2 text-[#3b82f6] text-sm font-bold hover:underline">
                Xoá bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[12px] leading-[16px] text-[#444656] uppercase font-bold tracking-wider" style={{ backgroundColor: '#f5f2ff' }}>
                  <th className="px-6 py-4 font-medium">
                    <button onClick={() => toggleSort('name')} className="flex items-center gap-2 hover:text-[#3b82f6] transition-colors">
                      Product Name <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    <button onClick={() => toggleSort('newest')} className="flex items-center gap-2 hover:text-[#3b82f6] transition-colors">
                      SKU <SortIcon field="newest" />
                    </button>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    <button onClick={() => toggleSort('stock')} className="flex items-center gap-2 hover:text-[#3b82f6] transition-colors">
                      Stock Status <SortIcon field="stock" />
                    </button>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    <button onClick={() => toggleSort('price')} className="flex items-center gap-2 hover:text-[#3b82f6] transition-colors">
                      Price <SortIcon field="price" />
                    </button>
                  </th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d9]/20">
                {paged.map((product) => {
                  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
                  const status = getRowStatus(totalStock)
                  const primaryImage = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url

                  return (
                    <tr key={product.id} className="hover:bg-[#dee1ff]/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-[#c4c5d9]/20" style={{ backgroundColor: '#e1dfff' }}>
                            {primaryImage ? (
                              <img
                                src={primaryImage}
                                alt={product.productName}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_48 }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#747688]">
                                <span className="material-symbols-outlined text-[24px]">inventory_2</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[14px] leading-[20px] font-bold">{product.productName}</p>
                            <p className="text-[12px] leading-[16px] text-[#747688]">
                              {product.description
                                ? (product.description.length > 30 ? product.description.slice(0, 30) + '...' : product.description)
                                : `${product.variants.length} variants`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[16px] leading-[24px] text-[#444656]">TL-{product.id.toString().padStart(6, '0')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${status.bg} ${status.text}`}>
                          {status.dot && <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`} />}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[20px] font-bold leading-[1]">{formatPrice(product.basePrice)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/dashboard/admin/products/${product.id}/edit`}
                            className="p-2 hover:bg-[#60a5fa] hover:text-white rounded-lg transition-all text-[#444656]"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </Link>
                          <button
                            onClick={() => { if (confirm('Bạn chắc chắn muốn xoá sản phẩm này?')) deleteProduct.mutate(product.id) }}
                            className="p-2 hover:bg-[#ffdad6] hover:text-[#93000a] rounded-lg transition-all text-[#444656]"
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

        {/* Pagination Footer */}
        {list.length > 0 && (
          <div className="px-6 py-4 border-t border-[#c4c5d9]/30 flex justify-between items-center" style={{ backgroundColor: '#f5f2ff' }}>
            <p className="text-[12px] leading-[16px] text-[#747688]">
              Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, list.length)}-{Math.min(currentPage * PAGE_SIZE, list.length)} of {list.length} products
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#e1dfff] text-[#747688] disabled:opacity-30 transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {getPageNumbers().map((page, idx) =>
                page === 'ellipsis' ? (
                  <span key={`e${idx}`} className="px-2 text-[#747688]">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold shadow-sm transition-colors ${
                      currentPage === page
                        ? 'bg-[#60a5fa] text-white'
                        : 'hover:bg-[#e1dfff] text-[#444656]'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#e1dfff] text-[#747688] disabled:opacity-30 transition-colors"
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
