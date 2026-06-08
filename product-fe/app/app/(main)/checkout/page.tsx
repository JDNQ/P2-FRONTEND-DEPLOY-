'use client'
import { useCart } from '@/lib/hooks/useCart'
import { useCreateOrder } from '@/lib/hooks/useOrders'
import { formatPrice } from '@/lib/utils/formatPrice'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: cart, isLoading: cartLoading } = useCart()
  const { mutate: createOrder, isPending } = useCreateOrder()

  const [voucherCode, setVoucherCode] = useState('')
  const [note, setNote] = useState('')

  const items = cart?.items || []
  const total = cart?.totalPrice || 0

  const handleSubmitOrder = () => {
    if (items.length === 0) return

    createOrder({
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      voucherCode: voucherCode || undefined,
      note: note || undefined,
    })
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto animate-pulse">
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-500 mb-4">Giỏ hàng của bạn trống</p>
          <a
            href="/cart"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
          >
            Quay lại giỏ hàng
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Review */}
            <div className="bg-neutral-50 rounded-xl p-6">
              <h2 className="font-heading text-lg font-bold mb-4">Các sản phẩm đặt hàng</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b">
                    <div>
                      <p className="font-medium">{item.product.productName}</p>
                      <p className="text-sm text-neutral-500">{item.variant.variantName}</p>
                      <p className="text-sm text-neutral-500">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice((item.product.basePrice + item.variant.extraPrice) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Voucher */}
            <div className="bg-neutral-50 rounded-xl p-6">
              <h2 className="font-heading text-lg font-bold mb-4">Mã giảm giá</h2>
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Notes */}
            <div className="bg-neutral-50 rounded-xl p-6">
              <h2 className="font-heading text-lg font-bold mb-4">Ghi chú đơn hàng</h2>
              <textarea
                placeholder="Nhập ghi chú cho người bán..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
          </div>

          {/* Summary & Place Order */}
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

            <button
              onClick={handleSubmitOrder}
              disabled={isPending}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-60 transition"
            >
              {isPending ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>

            <a
              href="/cart"
              className="block w-full py-3 text-center text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-100 transition mt-3"
            >
              Quay lại giỏ hàng
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
