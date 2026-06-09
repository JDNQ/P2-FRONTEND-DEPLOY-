'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useAddToWishlist } from '@/lib/hooks/useWishlist'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter } from 'next/navigation'
import { PLACEHOLDER_400 } from '@/lib/utils/placeholder'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatPrice'
import Header from '@/components/Header'
import SidebarFilter from '@/components/SidebarFilter'
import Footer from '@/components/Footer'

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts()
  const { isAuthenticated } = useAuthStore()
  const { mutate: addToCart } = useAddToCart()
  const { mutate: addToWishlist } = useAddToWishlist()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(Infinity)
  const [currentPage, setCurrentPage] = useState(1)
  const [rangeValue, setRangeValue] = useState(50)

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

  const pageSize = 9
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const paged = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const allStocked = (product: typeof products extends undefined ? never : typeof products[number]) =>
    product.variants.some((v) => v.stock > 0)

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0">
      <Header />

      <main className="max-w-container-max mx-auto px-gutter py-stack-lg">
        <div className="flex flex-col md:flex-row gap-stack-lg">
          <SidebarFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            rangeValue={rangeValue}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onRangeValueChange={setRangeValue}
            onClearAll={() => { setMinPrice(0); setMaxPrice(Infinity); setSearchTerm(''); setRangeValue(50) }}
          />

          {/* Product Listing */}
          <div className="flex-1">
            {/* Sorting and Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-stack-lg gap-stack-sm">
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface">Sản phẩm</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Tìm thấy {filteredProducts.length} sản phẩm</p>
              </div>
              <div className="flex items-center gap-stack-md w-full sm:w-auto">
                <label className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Sắp xếp theo:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant rounded-xl py-2 px-4 focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md w-full sm:w-48 outline-none"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-stack-lg">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-surface rounded-xl animate-pulse overflow-hidden border border-outline-variant/20">
                    <div className="aspect-square bg-surface-container-high" />
                    <div className="p-stack-md space-y-3">
                      <div className="h-3 bg-surface-container-high rounded w-1/3" />
                      <div className="h-4 bg-surface-container-high rounded w-3/4" />
                      <div className="h-4 bg-surface-container-high rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-stack-lg">
                  {paged.map((product) => {
                    const minP = product.variants.length > 0
                      ? Math.min(...product.variants.map((v) => product.basePrice + v.extraPrice))
                      : product.basePrice
                    const inStock = allStocked(product)
                    return (
                      <div
                        key={product.id}
                        className="group bg-white rounded-xl shadow-sm border border-transparent hover:border-primary/20 transition-all duration-300 relative overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg"
                      >
                        <Link href={`/products/${product.id}`}>
                          <div className="relative aspect-square overflow-hidden bg-surface-container-lowest">
                            {product.images[0] ? (
                              <img
                                src={product.images[0].url}
                                alt={product.productName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_400 }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-outline">
                                <span className="material-symbols-outlined text-5xl">image</span>
                              </div>
                            )}
                            <span className="absolute top-3 left-3 bg-tertiary/10 text-tertiary font-label-md px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
                              {inStock ? 'Promoted' : 'Hết hàng'}
                            </span>
                            <button
                              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-on-surface-variant hover:text-error transition-colors shadow-sm"
                              onClick={(e) => {
                                e.preventDefault()
                                if (!isAuthenticated) { router.push('/login?from=/products'); return }
                                addToWishlist(product.id)
                              }}
                            >
                              <span className="material-symbols-outlined text-[20px]">favorite</span>
                            </button>
                            <div className="absolute inset-x-0 bottom-0 p-stack-sm bg-white/90 backdrop-blur-md flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="flex-1 orange-gradient orange-glow text-white font-label-md py-2 rounded-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                onClick={(e) => {
                                  e.preventDefault()
                                  if (!isAuthenticated) { router.push('/login?from=/products'); return }
                                  const firstVariant = product.variants[0]
                                  if (firstVariant) {
                                    addToCart({ productId: product.id, variantId: firstVariant.id, quantity: 1 })
                                  }
                                }}
                              >
                                <span className="material-symbols-outlined text-sm">shopping_cart</span>
                                Thêm giỏ
                              </button>
                              <button
                                className="w-10 h-10 flex items-center justify-center bg-surface-container-highest rounded-lg text-on-surface hover:bg-surface-variant transition-colors"
                                onClick={(e) => {
                                  e.preventDefault()
                                  router.push(`/products/${product.id}`)
                                }}
                              >
                                <span className="material-symbols-outlined">visibility</span>
                              </button>
                            </div>
                          </div>
                        </Link>
                        <div className="p-stack-md flex flex-col flex-1">
                          <span className="text-caption font-caption text-on-surface-variant mb-1">TL Market</span>
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 line-clamp-2">{product.productName}</h3>
                          </Link>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-price-display text-price-display text-primary">{formatPrice(minP)}</span>
                              <span className={`text-caption font-caption px-2 py-0.5 rounded ${inStock ? 'text-green-600 bg-green-50' : 'text-error bg-error-container/10'}`}>
                                {inStock ? 'Còn hàng' : 'Hết hàng'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              <span className="font-label-md text-label-md text-on-surface">4.8</span>
                              <span className="text-caption font-caption text-on-surface-variant">(128 đánh giá)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-section-gap flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-variant text-on-surface transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-label-md transition-all ${
                          currentPage === page
                            ? 'orange-gradient text-white shadow-sm'
                            : 'border border-outline-variant hover:bg-surface-variant text-on-surface'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    {totalPages > 5 && <span className="px-2 text-outline-variant">...</span>}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-variant text-on-surface transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
                <p className="text-on-surface-variant">Không tìm thấy sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
