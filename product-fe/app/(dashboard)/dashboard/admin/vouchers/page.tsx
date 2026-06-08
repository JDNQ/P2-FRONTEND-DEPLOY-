'use client'

export default function AdminVouchersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold">Quản lý Voucher</h1>
        <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium">
          Thêm Voucher
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-neutral-500">Chức năng quản lý voucher sẽ được cập nhật</p>
        </div>
      </div>
    </div>
  )
}
