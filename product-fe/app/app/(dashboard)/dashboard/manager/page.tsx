'use client'

export default function ManagerDashboardPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Dashboard Quản lý</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Đơn hàng hôm nay</p>
          <p className="font-heading text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Người dùng</p>
          <p className="font-heading text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Doanh thu ngày</p>
          <p className="font-heading text-3xl font-bold text-primary-600">0đ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/dashboard/manager/orders"
          className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-md transition"
        >
          <h2 className="font-heading text-lg font-bold text-primary-600 mb-2">Quản lý đơn hàng</h2>
          <p className="text-neutral-600 text-sm">Xem và cập nhật trạng thái đơn hàng</p>
        </a>

        <a
          href="/dashboard/manager/users"
          className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-md transition"
        >
          <h2 className="font-heading text-lg font-bold text-primary-600 mb-2">Quản lý người dùng</h2>
          <p className="text-neutral-600 text-sm">Xem danh sách người dùng</p>
        </a>
      </div>
    </div>
  )
}
