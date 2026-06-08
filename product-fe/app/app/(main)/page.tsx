'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function HomePage() {
  const { data: products, isLoading } = useProducts()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl font-bold mb-4">TL Market</h1>
          <p className="text-xl text-primary-100 mb-8">Nền tảng thương mại điện tử uy tín</p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-heading text-3xl font-bold mb-8">Sản phẩm nổi bật</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-neutral-200 h-64 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.slice(0, 8).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white border border-neutral-200 rounded-xl p-4 hover:shadow-lg transition">
                  {product.images[0] && (
                    <div className="w-full h-40 bg-neutral-100 rounded-lg mb-4 flex items-center justify-center">
                      <img
                        src={product.images[0].url}
                        alt={product.productName}
                        className="w-full h-full object-cover rounded-lg"
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
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary-600">{formatPrice(product.basePrice)}</span>
                  </div>
                  <div className="mt-2 text-sm text-neutral-500">{product.variants.length} phân loại</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
