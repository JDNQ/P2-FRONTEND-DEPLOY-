'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useAddToWishlist } from '@/lib/hooks/useWishlist'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter } from 'next/navigation'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import SidebarFilter from '@/components/SidebarFilter'
import Footer from '@/components/Footer'
import type { Product } from '@/lib/types/product'

function ProductsContent() {
  const { data: products, isLoading } = useProducts()
  const { isAuthenticated } = useAuthStore()
  const { mutate: addToCart } = useAddToCart()
  const { mutate: addToWishlist } = useAddToWishlist()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(Infinity)
  const [currentPage, setCurrentPage] = useState(1)
  const [rangeValue, setRangeValue] = useState(50)

  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('searchTerm') || ''
    setSearchTerm(q)
    setCurrentPage(1)
  }, [searchParams])

  const getMinPrice = (p: Product) =>
    p.variants.length > 0 ? Math.min(...p.variants.map((v) => p.basePrice + v.extraPrice)) : p.basePrice

  const getMaxPrice = (p: Product) =>
    p.variants.length > 0 ? Math.max(...p.variants.map((v) => p.basePrice + v.extraPrice)) : p.basePrice

  const filteredProducts = useMemo(() => {
    if (!products) return []
    let result = [...products]
    if (searchTerm) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
      )
    }
    if (minPrice > 0) result = result.filter((p) => getMinPrice(p) >= minPrice)
    if (maxPrice < Infinity) result = result.filter((p) => getMaxPrice(p) <= maxPrice)
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => getMinPrice(a) - getMinPrice(b)); break
      case 'price-desc': result.sort((a, b) => getMinPrice(b) - getMinPrice(a)); break
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
    }
    return result
  }, [products, searchTerm, sortBy, minPrice, maxPrice])

  const pageSize = 9
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const paged = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const allStocked = (product: Product) =>
    product.variants.some((v) => v.stock > 0)

  return (
    <>

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
                <h1 className="font-heading text-headline-lg text-on-surface">Sản phẩm</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Tìm thấy {filteredProducts.length} sản phẩm</p>
              </div>
              <div className="flex items-center gap-stack-md w-full sm:w-auto">
                <label className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Sắp xếp theo:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant rounded-xl py-2 px-4 focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md w-full sm:w-48 outline-none"
                  title="Sắp xếp sản phẩm"
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
                    const inStock = allStocked(product)
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        badge={inStock ? 'Bán chạy' : 'Hết hàng'}
                        onAddToWishlist={(e) => {
                          e.preventDefault()
                          if (!isAuthenticated) { router.push('/login?from=/products'); return }
                          addToWishlist(product.id)
                        }}
                        onQuickView={(e) => {
                          e.preventDefault()
                          router.push(`/products/${product.id}`)
                        }}
                        onAddToCart={(e) => {
                          e.preventDefault()
                          if (!isAuthenticated) { router.push('/login?from=/products'); return }
                          const firstVariant = product.variants[0]
                          if (firstVariant) {
                            addToCart({ productId: product.id, variantId: firstVariant.id, quantity: 1 })
                          }
                        }}
                      />
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
                      title="Trang trước"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-label-md transition-all ${currentPage === page
                          ? 'orange-gradient text-white shadow-sm'
                          : 'border border-outline-variant hover:bg-surface-variant text-on-surface'
                          }`}
                        title={`Trang ${page}`}
                      >
                        {page}
                      </button>
                    ))}
                    {totalPages > 5 && <span className="px-2 text-outline-variant">...</span>}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-variant text-on-surface transition-colors disabled:opacity-50"
                      title="Trang sau"
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

    </>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-surface-page text-on-surface pb-20 md:pb-0">
      <Header />
      <Suspense fallback={
        <div className="max-w-container-max mx-auto px-gutter py-stack-lg animate-pulse">
          <div className="h-8 bg-surface-container-high rounded w-1/3 mb-stack-lg" />
          <div className="grid grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-surface-container-high rounded-2xl" />)}
          </div>
        </div>
      }>
        <ProductsContent />
      </Suspense>
      <Footer />
    </div>
  )
}