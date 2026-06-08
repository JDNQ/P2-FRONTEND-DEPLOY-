'use client'
import { useAllOrders } from '@/lib/hooks/useOrders'
import { formatPrice } from '@/lib/utils/formatPrice'
import { formatDate } from '@/lib/utils/formatDate'

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

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useAllOrders()

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Quản lý đơn hàng</h1>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">
            <p className="text-neutral-500">Đang tải...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    #ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Sản phẩm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {orders?.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.status]
                        }`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary-600">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {order.items.length} sản phẩm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
