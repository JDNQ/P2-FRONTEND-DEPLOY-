'use client'
import { useProducts, useDeleteProduct } from '@/lib/hooks/useProducts'
import { formatPrice } from '@/lib/utils/formatPrice'
import { PLACEHOLDER_48 } from '@/lib/utils/placeholder'
import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

const PAGE_SIZE = 10

function getRowStatus(stock: number): { label: string; bg: string; text: string; dot: string; pulse?: boolean } {
  if (stock === 0) return { label: 'Out of Stock', bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]', dot: '' }
  if (stock <= 10) return { label: `Low Stock (${stock})`, bg: 'bg-[#e1dfff]', text: 'text-[#3432c8]', dot: '' }
  return { label: `In Stock (${stock})`, bg: 'bg-[#dee1ff]', text: 'text-[#0035d1]', dot: 'bg-[#0035d1]', pulse: true }
}

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts()
  const deleteProduct = useDeleteProduct()
  const [currentPage, setCurrentPage] = useState(1)

  const list = products || []
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

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl shadow-sm border border-[#c4c5d9]/30 flex flex-col gap-2" style={{ backgroundColor: '#ffffff' }}>
          <p className="text-[12px] leading-[16px] text-[#747688] uppercase font-bold">Total Items</p>
          <p className="text-[28px] font-extrabold leading-[1.2]">{list.length}</p>
          <div className="flex items-center gap-1 text-green-600 text-[12px] leading-[16px] font-bold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            +12% vs last month
          </div>
        </div>
        <div className="p-6 rounded-xl shadow-sm border border-[#c4c5d9]/30 flex flex-col gap-2" style={{ backgroundColor: '#ffffff' }}>
          <p className="text-[12px] leading-[16px] text-[#747688] uppercase font-bold">In Stock</p>
          <p className="text-[28px] font-extrabold leading-[1.2]" style={{ color: '#0035d1' }}>{inStockCount}</p>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#eeecff' }}>
            <div className="h-full rounded-full" style={{ width: `${list.length ? (inStockCount / list.length) * 100 : 0}%`, backgroundColor: '#0035d1' }} />
          </div>
        </div>
        <div className="p-6 rounded-xl shadow-sm border border-[#c4c5d9]/30 flex flex-col gap-2" style={{ backgroundColor: '#ffffff' }}>
          <p className="text-[12px] leading-[16px] text-[#747688] uppercase font-bold">Low Stock</p>
          <p className="text-[28px] font-extrabold leading-[1.2]" style={{ color: '#3432c8' }}>{lowStockCount}</p>
          <div className="flex items-center gap-1 text-[12px] leading-[16px] font-bold" style={{ color: '#3432c8' }}>
            <span className="material-symbols-outlined text-[16px]">warning</span>
            Requires attention
          </div>
        </div>
        <div className="p-6 rounded-xl shadow-sm border border-[#c4c5d9]/30 flex flex-col gap-2" style={{ backgroundColor: '#ffffff' }}>
          <p className="text-[12px] leading-[16px] text-[#747688] uppercase font-bold">Out of Stock</p>
          <p className="text-[28px] font-extrabold leading-[1.2]" style={{ color: '#ba1a1a' }}>{outOfStockCount}</p>
          <div className="flex items-center gap-1 text-[12px] leading-[16px] font-bold" style={{ color: '#ba1a1a' }}>
            <span className="material-symbols-outlined text-[16px]">error</span>
            Inactive listings
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-sm border border-[#c4c5d9]/50 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        {/* Header Actions */}
        <div className="px-6 py-4 border-b border-[#c4c5d9]/30 flex justify-between items-center" style={{ backgroundColor: '#f5f2ff' }}>
          <div className="flex gap-2">
            <Link
              href="/dashboard/admin/products/new"
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-[14px] leading-[20px] font-bold text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
                boxShadow: '0 4px 14px 0 rgba(30, 76, 253, 0.25)',
              }}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Product
            </Link>
            <button 
              onClick={() => toast.info('Chức năng lọc sản phẩm đang được phát triển!')}
              className="px-4 py-2 rounded-lg border border-[#c4c5d9] hover:bg-[#e1dfff] transition-colors flex items-center gap-2 text-[14px] leading-[20px] font-medium text-[#444656]" 
              style={{ backgroundColor: '#fcf8ff' }}
            >
              <span className="material-symbols-outlined text-[18px]">filter_alt</span>
              Filters
            </button>
            <button 
              onClick={() => toast.success('Đã xuất danh sách sản phẩm thành công!')}
              className="px-4 py-2 rounded-lg border border-[#c4c5d9] hover:bg-[#e1dfff] transition-colors flex items-center gap-2 text-[14px] leading-[20px] font-medium text-[#444656]" 
              style={{ backgroundColor: '#fcf8ff' }}
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
          </div>
          <p className="text-[12px] leading-[16px] text-[#747688]">
            Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, list.length)}-{Math.min(currentPage * PAGE_SIZE, list.length)} of {list.length} products
          </p>
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
            <p className="text-[#444656] mt-4 text-sm">No products yet</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[12px] leading-[16px] text-[#444656] uppercase font-bold tracking-wider" style={{ backgroundColor: '#f5f2ff' }}>
                  <th className="px-6 py-4 font-medium">
                    <span className="flex items-center gap-2 cursor-pointer hover:text-[#0035d1]">
                      Product Name
                      <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                    </span>
                  </th>
                  <th className="px-6 py-4 font-medium">SKU</th>
                  <th className="px-6 py-4 font-medium">Stock Status</th>
                  <th className="px-6 py-4 font-medium">Price</th>
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
                            className="p-2 hover:bg-[#1e4cfd] hover:text-white rounded-lg transition-all text-[#444656]"
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
            <div className="flex items-center gap-4">
              <p className="text-[12px] leading-[16px] text-[#747688]">Rows per page:</p>
              <select 
                onChange={() => toast.info('Chức năng số dòng hiển thị động sẽ sớm được cập nhật!')}
                className="bg-transparent border-none focus:ring-0 text-[14px] leading-[20px] font-bold cursor-pointer outline-none"
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
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
                        ? 'bg-[#1e4cfd] text-white'
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
