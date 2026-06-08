'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import { useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products?.filter((p) =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl font-bold mb-8">Tất cả sản phẩm</h1>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-neutral-200 h-64 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white border border-neutral-200 rounded-xl p-4 hover:shadow-lg transition cursor-pointer">
                  {product.images[0] && (
                    <div className="w-full h-40 bg-neutral-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.images[0].url}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/150?text=Product'
                        }}
                      />
                    </div>
                  )}
                  <h3 className="font-medium text-neutral-900 line-clamp-2 mb-2">
                    {product.productName}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(product.basePrice)}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-500">{product.variants.length} phân loại</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
