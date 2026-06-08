'use client'

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Tổng đơn hàng</p>
          <p className="font-heading text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Tổng sản phẩm</p>
          <p className="font-heading text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Doanh thu</p>
          <p className="font-heading text-3xl font-bold text-primary-600">0đ</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <h2 className="font-heading text-xl font-bold mb-4">Quản lý nhanh</h2>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/dashboard/admin/products"
            className="p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition"
          >
            <p className="font-medium text-primary-900">Quản lý sản phẩm</p>
          </a>
          <a
            href="/dashboard/admin/orders"
            className="p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition"
          >
            <p className="font-medium text-primary-900">Quản lý đơn hàng</p>
          </a>
          <a
            href="/dashboard/admin/vouchers"
            className="p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition"
          >
            <p className="font-medium text-primary-900">Quản lý Voucher</p>
          </a>
        </div>
      </div>
    </div>
  )
}
