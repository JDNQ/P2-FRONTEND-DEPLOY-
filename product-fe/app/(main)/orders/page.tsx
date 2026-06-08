'use client'
import { useMyOrders } from '@/lib/hooks/useOrders'
import { formatPrice } from '@/lib/utils/formatPrice'
import { formatDate } from '@/lib/utils/formatDate'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useMyOrders()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-12 bg-neutral-200 rounded w-1/3 mb-8 animate-pulse" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const orderList = orders || []

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

        {orderList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-6">Bạn chưa có đơn hàng nào</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
            >
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orderList.map((order) => (
              <div
                key={order.id}
                className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      Đơn hàng #{order.id}
                    </h3>
                    <p className="text-sm text-neutral-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b border-neutral-200">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="text-sm text-neutral-600 mb-1">
                      {item.product?.productName} ({item.quantity}x) -{' '}
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div className="text-sm text-neutral-500">
                      ...và {order.items.length - 2} sản phẩm khác
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-600">Tổng cộng:</p>
                    <p className="font-bold text-primary-600">{formatPrice(order.totalPrice)}</p>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
