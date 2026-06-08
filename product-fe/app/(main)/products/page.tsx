'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(Infinity)

  const filteredProducts = useMemo(() => {
    if (!products) return []
    let result = [...products]

    if (searchTerm) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (minPrice > 0) result = result.filter((p) => p.basePrice >= minPrice)
    if (maxPrice < Infinity) result = result.filter((p) => p.basePrice <= maxPrice)

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.basePrice - b.basePrice); break
      case 'price-desc': result.sort((a, b) => b.basePrice - a.basePrice); break
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
    }
    return result
  }, [products, searchTerm, sortBy, minPrice, maxPrice])

  return (
    <div className="min-h-screen bg-surface-page pb-20 md:pb-0">
      {/* Breadcrumb */}
      <div className="max-w-[1280px] mx-auto px-4 py-4">
        <nav className="flex items-center gap-2">
          <Link href="/" className="text-xs text-m3-on-surface-variant hover:text-m3-primary">Trang chủ</Link>
          <span className="material-symbols-outlined text-xs text-m3-outline-variant">chevron_right</span>
          <span className="text-xs text-m3-primary font-bold">Sản phẩm</span>
        </nav>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Filter */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-m3-outline-variant">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-m3-primary">filter_list</span>
              Bộ lọc
            </h2>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold text-sm mb-3 text-m3-on-surface">Khoảng giá</h3>
              <input
                type="range"
                min="0"
                max="50"
                value={maxPrice === Infinity ? 50 : Math.round(maxPrice / 1000000)}
                onChange={(e) => setMaxPrice(Number(e.target.value) * 1000000)}
                className="w-full h-2 bg-m3-surface-container-high rounded-lg appearance-none cursor-pointer accent-m3-primary"
              />
              <div className="flex items-center justify-between text-xs text-m3-on-surface-variant mt-2">
                <span>0đ</span>
                <span className="text-m3-primary font-bold">{maxPrice === Infinity ? '50tr+' : `${maxPrice / 1000000}tr`}</span>
                <span>50tr</span>
              </div>
            </div>

            <button
              onClick={() => { setMinPrice(0); setMaxPrice(Infinity); setSearchTerm(''); setSortBy('newest') }}
              className="w-full py-2 rounded-lg border-2 border-m3-primary text-m3-primary font-bold hover:bg-m3-primary-fixed transition-colors text-sm"
            >
              Xoá tất cả
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-m3-outline-variant mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant text-[20px]">search</span>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-m3-surface-container-low border border-m3-outline-variant rounded-lg focus:ring-m3-primary focus:border-m3-primary text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-m3-on-surface-variant whitespace-nowrap">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-m3-outline-variant rounded-lg text-sm px-3 py-2 focus:ring-m3-primary"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-m3-outline-variant overflow-hidden animate-pulse">
                  <div className="h-64 bg-neutral-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
                    <div className="h-10 bg-neutral-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-xl border border-m3-outline-variant overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="relative h-64 overflow-hidden bg-m3-surface-container-lowest">
                        {product.images[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Product' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-m3-outline">
                            <span className="material-symbols-outlined text-5xl">image</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-m3-on-surface hover:text-error transition-colors opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-sm text-m3-on-surface mb-1 truncate">
                          {product.productName}
                        </h3>
                        <div className="text-lg font-bold text-m3-primary">
                          {formatPrice(product.basePrice)}
                        </div>
                      </div>
                    </Link>

                    <div className="px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-full py-2.5 rounded-lg font-bold text-white flex items-center justify-center gap-2 text-sm"
                        style={{
                          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                          boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.3)'
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          const firstVariant = product.variants[0]
                          if (firstVariant) {
                            import('@/lib/hooks/useCart').then(({ useAddToCart }) => {
                              const { mutate } = useAddToCart()
                              mutate({ productId: product.id, variantId: firstVariant.id, quantity: 1 })
                            })
                          }
                        }}
                      >
                        <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-16 flex justify-center items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-m3-outline-variant text-m3-on-surface-variant hover:bg-m3-primary hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-m3-primary text-white font-bold text-sm">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-m3-outline-variant text-m3-on-surface-variant hover:bg-m3-surface-container transition-all text-sm">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-m3-outline-variant text-m3-on-surface-variant hover:bg-m3-surface-container transition-all text-sm">3</button>
                <span className="px-1 text-m3-outline-variant text-sm">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-m3-outline-variant text-m3-on-surface-variant hover:bg-m3-surface-container transition-all text-sm">10</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-m3-outline-variant text-m3-on-surface-variant hover:bg-m3-primary hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-m3-outline-variant mb-4">search_off</span>
              <p className="text-m3-on-surface-variant">Không tìm thấy sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex items-center justify-around py-2 z-50">
        <Link href="/" className="flex flex-col items-center text-m3-primary font-bold">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px]">Trang chủ</span>
        </Link>
        <Link href="/products" className="flex flex-col items-center text-m3-primary font-bold">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-[10px]">Danh mục</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center text-m3-on-surface-variant">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-[10px]">Giỏ hàng</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-m3-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Cá nhân</span>
        </Link>
      </nav>
    </div>
  )
}
