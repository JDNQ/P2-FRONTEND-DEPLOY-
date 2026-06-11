'use client'

import { useParams, useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useProduct, useUpdateProduct } from '@/lib/hooks/useProducts'
import { productSchema } from '@/lib/validations/productSchema'
import type { CreateProductDto } from '@/lib/types/product'
import Link from 'next/link'
import type { z } from 'zod'

type EditProductValues = z.input<typeof productSchema>

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const { data: product, isLoading, isError } = useProduct(id)
  const updateMutation = useUpdateProduct()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EditProductValues>({
    resolver: zodResolver(productSchema),
    values: product
      ? {
          productName: product.productName,
          description: product.description || '',
          basePrice: product.basePrice,
          variants: product.variants.map((v) => ({
            variantName: v.variantName,
            extraPrice: v.extraPrice,
            stock: v.stock,
          })),
        }
      : undefined,
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' })
  const productName = watch('productName')
  const variants = watch('variants')
  const totalStock =
    variants?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#0035d1] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-5xl text-[#ba1a1a]">
          error_outline
        </span>
        <p className="text-[#444656] font-medium">Không thể tải sản phẩm</p>
        <Link
          href="/dashboard/admin/products"
          className="px-4 py-2 bg-[#1e4cfd] text-white rounded-lg text-sm font-bold"
        >
          Quay lại
        </Link>
      </div>
    )
  }

  const onSubmit = (data: EditProductValues) => {
    const payload: CreateProductDto = {
      ...data,
      shopId: 1,
    }
    console.log(payload)
    updateMutation.mutate(
      { id, data: payload },
      { onSuccess: () => router.push('/dashboard/admin/products') },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin/products"
            className="text-[#747688] hover:text-[#0035d1] transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Quay lại
          </Link>
          <div className="h-4 w-px bg-[#c4c5d9]" />
          <h1 className="text-[18px] font-bold text-[#08006c]">
            Chỉnh sửa sản phẩm
          </h1>
        </div>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="px-4 py-2 text-white rounded-lg text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
            boxShadow: '0 4px 14px 0 rgba(30, 76, 253, 0.25)',
          }}
        >
          {updateMutation.isPending && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Cập nhật sản phẩm
        </button>
      </div>

      {/* Basic Info */}
      <section className="bg-[#fcf8ff] rounded-xl shadow-sm border border-[#c4c5d9]/50 p-6">
        <h2 className="text-base font-bold text-[#08006c] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0035d1]">info</span>
          Thông tin cơ bản
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#444656] mb-1">
              Tên sản phẩm <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              {...register('productName')}
              className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] outline-none transition-all"
              placeholder="Nhập tên sản phẩm"
            />
            {errors.productName && (
              <p className="text-[#ba1a1a] text-xs mt-1">
                {errors.productName.message}
              </p>
            )}
            <p className="mt-1 text-[11px] text-[#747688] text-right">
              {productName?.length || 0}/100
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#444656] mb-1">
              Mô tả sản phẩm
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] outline-none transition-all resize-none"
              placeholder="Mô tả sản phẩm (không bắt buộc)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#444656] mb-1">
              Giá gốc (đ) <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              {...register('basePrice', { valueAsNumber: true })}
              type="number"
              className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] outline-none transition-all"
            />
            {errors.basePrice && (
              <p className="text-[#ba1a1a] text-xs mt-1">
                {errors.basePrice.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="bg-[#fcf8ff] rounded-xl shadow-sm border border-[#c4c5d9]/50 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-base font-bold text-[#08006c] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0035d1]">
              inventory_2
            </span>
            Biến thể sản phẩm
          </h2>
          <div className="flex items-center gap-4 text-xs font-medium text-[#747688]">
            <span>
              Tổng biến thể:{' '}
              <strong className="text-[#08006c]">{fields.length}</strong>
            </span>
            <div className="w-px h-3 bg-[#c4c5d9]" />
            <span>
              Tổng tồn kho:{' '}
              <strong className="text-[#08006c]">{totalStock}</strong>
            </span>
          </div>
        </div>

        {errors.variants && !Array.isArray(errors.variants) && (
          <p className="text-[#ba1a1a] text-xs mb-3">
            {errors.variants.message}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f5f2ff] text-[#444656] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3 border-b border-[#c4c5d9] w-12">#</th>
                <th className="px-4 py-3 border-b border-[#c4c5d9]">
                  Tên biến thể <span className="text-[#ba1a1a]">*</span>
                </th>
                <th className="px-4 py-3 border-b border-[#c4c5d9]">
                  Giá cộng thêm (đ)
                </th>
                <th className="px-4 py-3 border-b border-[#c4c5d9] w-32">
                  Tồn kho <span className="text-[#ba1a1a]">*</span>
                </th>
                <th className="px-4 py-3 border-b border-[#c4c5d9] w-20 text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#c4c5d9]/20">
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-[#f5f2ff]/50">
                  <td className="px-4 py-4 text-[#747688]">{index + 1}</td>
                  <td className="px-4 py-4">
                    <input
                      {...register(`variants.${index}.variantName`)}
                      className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] outline-none transition-all h-9"
                    />
                    {errors.variants?.[index]?.variantName && (
                      <p className="text-[#ba1a1a] text-xs mt-1">
                        {errors.variants[index]?.variantName?.message}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <input
                      {...register(`variants.${index}.extraPrice`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] outline-none transition-all h-9"
                    />
                    {errors.variants?.[index]?.extraPrice && (
                      <p className="text-[#ba1a1a] text-xs mt-1">
                        {errors.variants[index]?.extraPrice?.message}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <input
                      {...register(`variants.${index}.stock`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] outline-none transition-all h-9"
                    />
                    {errors.variants?.[index]?.stock && (
                      <p className="text-[#ba1a1a] text-xs mt-1">
                        {errors.variants[index]?.stock?.message}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                      className="p-2 text-[#747688] hover:text-[#ba1a1a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={() =>
            append({ variantName: '', extraPrice: 0, stock: 0 })
          }
          className="mt-4 flex items-center gap-2 text-[#0035d1] hover:text-[#1e4cfd] text-sm font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Thêm biến thể
        </button>
      </section>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-4 py-4 border-t border-[#c4c5d9]/30">
        <Link
          href="/dashboard/admin/products"
          className="px-8 py-2.5 border border-[#c4c5d9] rounded-lg text-sm font-semibold text-[#444656] hover:bg-[#f5f2ff] transition-colors"
        >
          Hủy bỏ
        </Link>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="px-8 py-2.5 text-white rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
            boxShadow: '0 4px 14px 0 rgba(30, 76, 253, 0.25)',
          }}
        >
          {updateMutation.isPending && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Cập nhật sản phẩm
        </button>
      </div>
    </form>
  )
}
