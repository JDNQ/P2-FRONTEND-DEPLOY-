'use client'
import { useProducts } from '@/lib/hooks/useProducts'
import { formatPrice } from '@/lib/utils/formatPrice'
import Link from 'next/link'

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold">Quản lý sản phẩm</h1>
        <Link
          href="/dashboard/admin/products/new"
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
        >
          Thêm sản phẩm
        </Link>
      </div>

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
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Phân loại
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Tổng kho
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {products?.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-neutral-900">{product.productName}</p>
                        <p className="text-sm text-neutral-500">ID: {product.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary-600">
                      {formatPrice(product.basePrice)}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {product.variants.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {product.variants.reduce((sum, v) => sum + v.stock, 0)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/admin/products/${product.id}/edit`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        Sửa
                      </Link>
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
