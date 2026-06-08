'use client'
import { useProduct } from '@/lib/hooks/useProducts'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useAuthStore } from '@/lib/stores/authStore'
import { formatPrice } from '@/lib/utils/formatPrice'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const productId = parseInt(params.id)
  const { data: product, isLoading } = useProduct(productId)
  const { mutate: addToCart } = useAddToCart()

  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!selectedVariant) {
      toast.error('Vui lòng chọn phân loại')
      return
    }

    addToCart({
      productId,
      variantId: selectedVariant,
      quantity,
    })

    setQuantity(1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-96 bg-neutral-200 rounded-xl mb-8" />
          <div className="h-12 bg-neutral-200 rounded w-1/2 mb-4" />
          <div className="h-8 bg-neutral-200 rounded w-1/4" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sản phẩm không tìm thấy</h1>
          <Link href="/products" className="text-primary-500 hover:underline">
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/products" className="text-primary-500 hover:underline mb-6 inline-block">
          ← Quay lại
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            {product.images[0] && (
              <div className="bg-neutral-100 rounded-xl p-4 mb-4">
                <img
                  src={product.images[0].url}
                  alt={product.productName}
                  className="w-full h-96 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/400?text=Product'
                  }}
                />
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <div key={idx} className="bg-neutral-100 rounded p-1">
                  <img
                    src={img.url}
                    alt={`Product ${idx}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/80?text=Product'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-2">
                {product.productName}
              </h1>
              <p className="text-neutral-600">{product.description}</p>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-primary-600">{formatPrice(product.basePrice)}</div>

            {/* Variants */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Chọn phân loại
              </label>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <label
                    key={variant.id}
                    className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-primary-50 transition"
                  >
                    <input
                      type="radio"
                      name="variant"
                      value={variant.id}
                      checked={selectedVariant === variant.id}
                      onChange={() => setSelectedVariant(variant.id)}
                      className="mr-3"
                    />
                    <span className="flex-1">
                      {variant.variantName} (+{formatPrice(variant.extraPrice)})
                    </span>
                    <span className="text-sm text-neutral-500">
                      {variant.stock > 0 ? `${variant.stock} sẵn` : 'Hết hàng'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Số lượng
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-3 py-2 border border-neutral-200 rounded-lg text-center"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition"
            >
              Thêm vào giỏ hàng
            </button>

            {/* Stock Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p>
                {product.variants.reduce((sum, v) => sum + v.stock, 0)} sản phẩm sẵn có trong tất cả
                phân loại
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
