'use client'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-neutral-500 mb-8">
          Cảm ơn bạn đã mua sắm tại TL Market. Đơn hàng của bạn đang được xử lý.
        </p>

        <div className="bg-neutral-50 rounded-xl p-6 mb-6">
          <p className="text-sm text-neutral-600 mb-2">Bạn sẽ nhận được email xác nhận trong vài phút</p>
          <p className="text-sm text-neutral-600">Theo dõi đơn hàng của bạn tại trang Đơn hàng của tôi</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/orders"
            className="block py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition"
          >
            Xem đơn hàng của tôi
          </Link>
          <Link
            href="/products"
            className="block py-3 text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  )
}
