'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter } from 'next/navigation'
import { PLACEHOLDER_400 } from '@/lib/utils/placeholder'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts()
  const { isAuthenticated } = useAuthStore()
  const { mutate: addToCart } = useAddToCart()
  const router = useRouter()
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

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const paged = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="min-h-screen bg-background text-on-background pb-20 md:pb-0">
      {/* Breadcrumb */}
      <div className="max-w-[1280px] mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-m3-on-surface-variant hover:text-primary">Trang chủ</Link>
          <span className="material-symbols-outlined text-outline-variant text-[16px]">chevron_right</span>
          <span className="text-primary font-bold">Sản phẩm</span>
        </nav>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar Filter */}
        <aside className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-3">
              {['Electronics', 'Fashion & Lifestyle', 'Home Appliances', 'Sports & Outdoors'].map((cat) => (
                <li key={cat}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                    <span className="text-sm text-m3-on-surface-variant group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Price Range</h3>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="50"
                value={maxPrice === Infinity ? 50 : Math.round(maxPrice / 1000000)}
                onChange={(e) => setMaxPrice(Number(e.target.value) * 1000000)}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: '#1e4cfd' }}
              />
              <div className="flex justify-between mt-4">
                <div className="px-3 py-1 bg-surface-container-low border border-outline-variant rounded-lg text-sm">$0</div>
                <div className="px-3 py-1 bg-surface-container-low border border-outline-variant rounded-lg text-sm">
                  ${maxPrice === Infinity ? '1000' : (maxPrice / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Brands</h3>
            <div className="grid grid-cols-2 gap-2">
              {['TL Tech', 'LuxeLine', 'Swift', 'Omni'].map((brand) => (
                <button
                  key={brand}
                  className="px-3 py-2 border border-outline-variant rounded-xl text-sm hover:border-primary hover:text-primary transition-all"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Display Area */}
        <div>
          {/* Sort & Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">
              Sản phẩm{' '}
              <span className="text-base text-outline font-normal ml-2">
                ({filteredProducts.length} items)
              </span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-m3-on-surface-variant">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface border border-outline-variant rounded-xl text-sm py-2 pl-4 pr-10 focus:ring-primary focus:border-primary cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-outline-variant/30">
                  <div className="aspect-[4/5] bg-neutral-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-neutral-200 rounded w-1/3" />
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {paged.map((product) => {
                  const minP = product.variants.length > 0
                    ? Math.min(...product.variants.map((v) => product.basePrice + v.extraPrice))
                    : product.basePrice
                  return (
                    <div
                      key={product.id}
                      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-outline-variant/30"
                    >
                      <Link href={`/products/${product.id}`}>
                        <div className="aspect-[4/5] relative bg-surface-container-low overflow-hidden">
                          {product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.productName}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_400 }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-m3-outline">
                              <span className="material-symbols-outlined text-5xl">image</span>
                            </div>
                          )}
                          <div className="absolute top-3 right-3 space-y-2">
                            <button className="opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-md transition-all duration-300 hover:text-error">
                              <span className="material-symbols-outlined">favorite</span>
                            </button>
                          </div>
                          <div className="absolute top-3 left-3">
                            <span className="bg-tertiary-container/10 text-tertiary-fixed text-xs px-3 py-1 rounded-full font-bold backdrop-blur-md"
                              style={{ background: 'rgba(78, 79, 224, 0.1)', color: '#e1dfff' }}
                            >
                              Trending
                            </span>
                          </div>
                        </div>
                      </Link>
                      <div className="p-4">
                        <p className="text-xs text-outline font-bold uppercase tracking-wider mb-1">TL Market</p>
                        <Link href={`/products/${product.id}`}>
                          <h3 className="text-lg font-bold text-m3-on-surface truncate mb-2 group-hover:text-primary transition-colors">
                            {product.productName}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xl text-primary">{formatPrice(minP)}</span>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-amber-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-sm font-bold">4.8</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <button
                          className="w-full py-3 rounded-xl font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 text-sm opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                          style={{
                            background: 'linear-gradient(135deg, #0035d1 0%, #4958a9 100%)',
                            boxShadow: '0 10px 15px -3px rgba(30, 76, 253, 0.25)'
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                            if (!isAuthenticated) { router.push('/login?from=/products'); return }
                            const firstVariant = product.variants[0]
                            if (firstVariant) {
                              addToCart({ productId: product.id, variantId: firstVariant.id, quantity: 1 })
                            }
                          }}
                        >
                          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                          Quick Add
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant text-m3-on-surface-variant hover:border-primary hover:text-primary transition-all disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                        currentPage === page
                          ? 'bg-primary text-white shadow-md'
                          : 'border border-outline-variant text-m3-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="px-2 text-outline-variant">...</span>}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant text-m3-on-surface-variant hover:border-primary hover:text-primary transition-all disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-m3-outline-variant mb-4">search_off</span>
              <p className="text-m3-on-surface-variant">Không tìm thấy sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
