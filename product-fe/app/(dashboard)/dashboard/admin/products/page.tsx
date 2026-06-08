'use client'
import { useProducts, useDeleteProduct } from '@/lib/hooks/useProducts'
import { formatPrice } from '@/lib/utils/formatPrice'
import { useState } from 'react'
import Link from 'next/link'

function getStatus(stock: number): { label: string; variant: 'success' | 'gold' | 'error' } {
  if (stock === 0) return { label: 'Hết hàng', variant: 'error' }
  if (stock <= 10) return { label: 'Sắp hết', variant: 'gold' }
  return { label: 'Đang bán', variant: 'success' }
}

const STATUS_CLASS = {
  success: 'bg-success/10 text-success',
  gold: 'bg-gold/10 text-gold',
  error: 'bg-error/10 text-error',
}

const STATUS_DOT = {
  success: 'bg-success',
  gold: 'bg-gold',
  error: 'bg-error',
}

const PAGE_SIZE = 4

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts()
  const deleteProduct = useDeleteProduct()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const list = products || []
  const totalStock = list.reduce((s, p) => s + p.variants.reduce((ss, v) => ss + v.stock, 0), 0)
  const outOfStock = list.filter((p) => p.variants.reduce((ss, v) => ss + v.stock, 0) === 0).length

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const paged = list.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === paged.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paged.map((p) => p.id)))
    }
  }

  const allSelected = paged.length > 0 && selectedIds.size === paged.length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-m3-on-surface">Inventory Management</h2>
        <p className="text-sm text-m3-on-surface-variant">Manage your product catalog and stock levels.</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-card border border-outline-variant rounded-lg font-label-md text-sm hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined">filter_list</span> Lọc
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-card border border-outline-variant rounded-lg font-label-md text-sm hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined">sort</span> Sắp xếp
          </button>
        </div>
        <Link
          href="/dashboard/admin/products/new"
          className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.3)'
          }}
        >
          <span className="material-symbols-outlined">add</span> Thêm sản phẩm mới
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-surface-card rounded-xl shadow-sm border border-outline-variant flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-info/10 text-info flex items-center justify-center">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div>
            <p className="text-xs text-m3-on-surface-variant">Tổng sản phẩm</p>
            <h3 className="text-xl font-bold text-m3-on-surface">{list.length}</h3>
          </div>
        </div>
        <div className="p-4 bg-surface-card rounded-xl shadow-sm border border-outline-variant flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-success/10 text-success flex items-center justify-center">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
          <div>
            <p className="text-xs text-m3-on-surface-variant">Tồn kho</p>
            <h3 className="text-xl font-bold text-m3-on-surface">{totalStock}</h3>
          </div>
        </div>
        <div className="p-4 bg-surface-card rounded-xl shadow-sm border border-outline-variant flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <p className="text-xs text-m3-on-surface-variant">Hết hàng</p>
            <h3 className="text-xl font-bold text-m3-on-surface">{outOfStock}</h3>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-card rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        {isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-neutral-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-m3-outline-variant">inventory_2</span>
            <p className="text-m3-on-surface-variant mt-4">No products yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant text-xs text-m3-on-surface-variant uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="rounded text-primary focus:ring-primary-container border-outline-variant"
                    />
                  </th>
                  <th className="px-6 py-4 font-bold">Sản phẩm</th>
                  <th className="px-6 py-4 font-bold">SKU</th>
                  <th className="px-6 py-4 font-bold">Tình trạng</th>
                  <th className="px-6 py-4 font-bold">Tồn kho</th>
                  <th className="px-6 py-4 font-bold">Giá</th>
                  <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paged.map((product) => {
                  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)
                  const status = getStatus(totalStock)
                  const maxBar = 100
                  const barPercent = Math.min(totalStock, maxBar)
                  const primaryImage = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-surface-container-low/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="rounded text-primary focus:ring-primary-container border-outline-variant"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                            {primaryImage ? (
                              <img
                                src={primaryImage}
                                alt={product.productName}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=Product' }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-m3-on-surface-variant">
                                <span className="material-symbols-outlined text-[24px]">inventory_2</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-m3-on-surface">{product.productName}</p>
                            <p className="text-xs text-m3-on-surface-variant">
                              {product.description
                                ? (product.description.length > 30 ? product.description.slice(0, 30) + '...' : product.description)
                                : `${product.variants.length} phân loại`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-m3-on-surface-variant">TL-{product.id.toString().padStart(6, '0')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${STATUS_CLASS[status.variant]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status.variant]}`}></span>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm">{totalStock} đơn vị</p>
                        <div className="w-24 h-1.5 bg-surface-container rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${status.variant === 'success' ? 'bg-success' : status.variant === 'gold' ? 'bg-gold' : 'bg-error'}`}
                            style={{ width: `${Math.min(barPercent, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-lg text-m3-on-surface">{formatPrice(product.basePrice)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/admin/products/${product.id}/edit`}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-m3-on-surface-variant hover:bg-surface-variant hover:text-primary transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </Link>
                          <button
                            onClick={() => { if (confirm('Xóa sản phẩm này?')) deleteProduct.mutate(product.id) }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-m3-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
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
          <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant">
            <p className="text-xs text-m3-on-surface-variant">
              Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, list.length)} của {list.length} sản phẩm
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-card text-m3-on-surface-variant hover:bg-surface-variant disabled:opacity-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'border border-outline-variant bg-surface-card text-m3-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages > 5 && (
                <span className="px-1 text-m3-on-surface-variant">...</span>
              )}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant bg-surface-card text-m3-on-surface-variant hover:bg-surface-variant disabled:opacity-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
