'use client'
import { useAllOrders } from '@/lib/hooks/useOrders'
import { useProducts } from '@/lib/hooks/useProducts'
import { formatPrice } from '@/lib/utils/formatPrice'
import Link from 'next/link'

const ORDER_STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING:   { label: 'Pending',   className: 'bg-gold/10 text-gold' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-info/10 text-info' },
  SHIPPING:  { label: 'Shipping',  className: 'bg-primary/10 text-primary' },
  DELIVERED: { label: 'Delivered', className: 'bg-success/10 text-success' },
  CANCELLED: { label: 'Cancelled', className: 'bg-error/10 text-error' },
}

export default function AdminDashboardPage() {
  const { data: ordersData } = useAllOrders()
  const { data: products } = useProducts()

  const orders = ordersData || []
  const totalRevenue = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalPrice, 0)
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-m3-primary-container/10 rounded-lg text-m3-primary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="flex items-center gap-1 text-success text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +12.5%
            </span>
          </div>
          <div>
            <p className="text-m3-on-surface-variant text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold text-m3-primary">{formatPrice(totalRevenue)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-m3-secondary-container/10 rounded-lg text-m3-secondary">
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
            <span className="flex items-center gap-1 text-success text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +8.2%
            </span>
          </div>
          <div>
            <p className="text-m3-on-surface-variant text-sm">Total Orders</p>
            <h3 className="text-2xl font-bold text-m3-on-surface">{orders.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-m3-tertiary-container/10 rounded-lg text-m3-tertiary">
              <span className="material-symbols-outlined">inventory</span>
            </div>
            <span className="flex items-center gap-1 text-m3-on-surface-variant text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">remove</span>
              0%
            </span>
          </div>
          <div>
            <p className="text-m3-on-surface-variant text-sm">Live Products</p>
            <h3 className="text-2xl font-bold text-m3-on-surface">{products?.length || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-info/10 rounded-lg text-info">
              <span className="material-symbols-outlined">person</span>
            </div>
            <span className="flex items-center gap-1 text-error text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
              -2.4%
            </span>
          </div>
          <div>
            <p className="text-m3-on-surface-variant text-sm">Pending Orders</p>
            <h3 className="text-2xl font-bold text-m3-on-surface">{pendingOrders}</h3>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/admin/products" className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-m3-primary-fixed rounded-lg flex items-center justify-center text-m3-primary">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div>
            <p className="font-bold text-sm">Products</p>
            <p className="text-xs text-m3-on-surface-variant">Manage inventory</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/orders" className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-m3-secondary-fixed rounded-lg flex items-center justify-center text-m3-secondary">
            <span className="material-symbols-outlined">package</span>
          </div>
          <div>
            <p className="font-bold text-sm">Orders</p>
            <p className="text-xs text-m3-on-surface-variant">View all orders</p>
          </div>
        </Link>
        <Link href="/dashboard/admin/vouchers" className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-m3-tertiary-fixed rounded-lg flex items-center justify-center text-m3-tertiary">
            <span className="material-symbols-outlined">monetization_on</span>
          </div>
          <div>
            <p className="font-bold text-sm">Vouchers</p>
            <p className="text-xs text-m3-on-surface-variant">Manage discounts</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-m3-outline-variant/30">
        <div className="px-6 py-4 border-b border-m3-outline-variant flex justify-between items-center bg-m3-surface-container-low">
          <h4 className="font-bold text-lg">Recent Orders</h4>
          <button className="text-m3-primary font-bold text-sm flex items-center gap-1 hover:underline">
            Export CSV <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-m3-surface-container-low/50">
              <tr className="text-m3-on-surface-variant text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Items</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-m3-outline-variant/30">
              {orders.slice(0, 5).map((order) => {
                const statusStyle = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING
                return (
                  <tr key={order.id} className="hover:bg-m3-surface-container-low transition-colors">
                    <td className="px-6 py-4 font-bold text-sm">#{order.id}</td>
                    <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                    <td className="px-6 py-4 font-bold text-m3-primary text-sm">{formatPrice(order.totalPrice)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle.className}`}>
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-m3-on-surface-variant opacity-70">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                )
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-m3-on-surface-variant text-sm">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {orders.length > 5 && (
          <div className="px-6 py-4 bg-m3-surface-container-lowest flex items-center justify-between">
            <span className="text-xs text-m3-on-surface-variant opacity-70 font-bold">
              Showing 5 of {orders.length} orders
            </span>
            <div className="flex gap-2">
              <button className="p-2 border border-m3-outline-variant rounded-lg hover:bg-m3-surface-container transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 border border-m3-outline-variant rounded-lg hover:bg-m3-surface-container transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
