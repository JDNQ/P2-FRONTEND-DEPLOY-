'use client'
import { useCart, useRemoveCartItem, useUpdateCartItem } from '@/lib/hooks/useCart'
import { formatPrice } from '@/lib/utils/formatPrice'
import Link from 'next/link'

export default function CartPage() {
  const { data: cart, isLoading } = useCart()
  const { mutate: removeItem } = useRemoveCartItem()
  const { mutate: updateItem } = useUpdateCartItem()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-12 bg-neutral-200 rounded w-1/3 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const items = cart?.items || []
  const total = cart?.totalPrice || 0

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8">Giỏ hàng</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-6">Giỏ hàng của bạn trống</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-neutral-200 rounded-xl hover:shadow-md transition"
                >
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.productName}
                      className="w-24 h-24 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/96?text=Product'
                      }}
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900 mb-2">{item.product.productName}</h3>
                    <p className="text-sm text-neutral-500 mb-3">
                      {item.variant.variantName}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItem({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                          className="px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateItem({ id: item.id, quantity: item.quantity + 1 })}
                          className="px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-neutral-900">
                          {formatPrice((item.product.basePrice + item.variant.extraPrice) * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm mt-1"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-neutral-50 rounded-xl p-6 h-fit">
              <h2 className="font-heading text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
                <div className="flex justify-between text-neutral-600">
                  <span>Tổng tiền hàng</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Tổng cộng</span>
                <span className="text-primary-600">{formatPrice(total)}</span>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-3 bg-primary-600 text-white font-semibold rounded-xl text-center hover:bg-primary-700 transition"
              >
                Tiến hành thanh toán
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
