'use client'

import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateProduct } from '@/lib/hooks/useProducts'
import { productSchema } from '@/lib/validations/productSchema'
import type { CreateProductDto } from '@/lib/types/product'
import type { z } from 'zod'

type NewProductValues = z.input<typeof productSchema>

export default function NewProductPage() {
  const router = useRouter()
  const createProduct = useCreateProduct()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<NewProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: '',
      description: '',
      basePrice: 0,
      variants: [{ variantName: '', extraPrice: 0, stock: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' })
  const productName = watch('productName')
  const variants = watch('variants')
  const totalStock =
    variants?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || 0

  const onSubmit = (data: NewProductValues) => {
    const payload: CreateProductDto = {
      ...data,
      shopId: 1,
    }
    console.log(payload)
    createProduct.mutate(payload, {
      onSuccess: () => router.push('/dashboard/admin/products'),
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-[24px] font-bold text-[#08006c]">Thêm sản phẩm mới</h2>
        <p className="text-sm text-[#444656] mt-1">
          Vui lòng điền đầy đủ thông tin để tạo sản phẩm trong kho.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#c4c5d9]/50 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#08006c] pb-2 border-b border-[#c4c5d9]/30">
                Thông tin cơ bản
              </h3>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#444656]">
                  Product Name <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  {...register('productName')}
                  className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none text-sm"
                  placeholder="Nhập tên sản phẩm"
                />
                {errors.productName && (
                  <p className="text-[#ba1a1a] text-xs mt-1">
                    {errors.productName.message}
                  </p>
                )}
                <div className="flex justify-end">
                  <span className="text-[10px] text-[#747688]">
                    {productName?.length || 0}/100
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#444656]">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none resize-none text-sm"
                  placeholder="Mô tả sản phẩm..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#444656]">
                  Base Price <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register('basePrice', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none text-sm"
                    placeholder="Nhập giá gốc"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747688] text-sm">
                    VND
                  </span>
                </div>
                {errors.basePrice && (
                  <p className="text-[#ba1a1a] text-xs mt-1">
                    {errors.basePrice.message}
                  </p>
                )}
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#c4c5d9]/30">
                <h3 className="text-lg font-bold text-[#08006c]">Variants</h3>
                <div className="flex items-center gap-4 text-xs font-medium text-[#747688] bg-[#f5f2ff] px-3 py-1 rounded-full">
                  <span>
                    Tổng variants:{' '}
                    <span className="text-[#0035d1] font-bold">{fields.length}</span>
                  </span>
                  <span className="w-px h-3 bg-[#c4c5d9]" />
                  <span>
                    Tổng stock:{' '}
                    <span className="text-[#0035d1] font-bold">{totalStock}</span>
                  </span>
                </div>
              </div>

              {errors.variants && !Array.isArray(errors.variants) && (
                <p className="text-[#ba1a1a] text-xs">{errors.variants.message}</p>
              )}

              <div className="overflow-hidden border border-[#c4c5d9] rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f5f2ff] border-b border-[#c4c5d9]">
                    <tr>
                      {['#', 'Variant Name *', 'Extra Price', 'Stock *', 'Thao tác'].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-[11px] font-bold text-[#444656] uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c4c5d9]/20">
                    {fields.map((field, index) => (
                      <tr key={field.id}>
                        <td className="px-4 py-3 text-sm text-[#747688] font-medium">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            {...register(`variants.${index}.variantName`)}
                            className="w-full px-3 py-1.5 border border-[#c4c5d9] rounded-md text-sm focus:border-[#0035d1] focus:ring-1 focus:ring-[#0035d1] outline-none"
                            placeholder="VD: Đen - 64GB"
                          />
                          {errors.variants?.[index]?.variantName && (
                            <p className="text-[#ba1a1a] text-xs mt-0.5">
                              {errors.variants[index]?.variantName?.message}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            {...register(`variants.${index}.extraPrice`, {
                              valueAsNumber: true,
                            })}
                            type="number"
                            className="w-full px-3 py-1.5 border border-[#c4c5d9] rounded-md text-sm focus:border-[#0035d1] focus:ring-1 focus:ring-[#0035d1] outline-none"
                          />
                          {errors.variants?.[index]?.extraPrice && (
                            <p className="text-[#ba1a1a] text-xs mt-0.5">
                              {errors.variants[index]?.extraPrice?.message}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            {...register(`variants.${index}.stock`, {
                              valueAsNumber: true,
                            })}
                            type="number"
                            className="w-full px-3 py-1.5 border border-[#c4c5d9] rounded-md text-sm focus:border-[#0035d1] focus:ring-1 focus:ring-[#0035d1] outline-none"
                          />
                          {errors.variants?.[index]?.stock && (
                            <p className="text-[#ba1a1a] text-xs mt-0.5">
                              {errors.variants[index]?.stock?.message}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                            className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#0035d1] text-[#0035d1] font-bold text-sm rounded-lg hover:bg-[#0035d1]/5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Thêm variant
              </button>
            </div>

            {/* Submit */}
            <div className="pt-8 mt-4 border-t border-[#c4c5d9]/30">
              <button
                type="submit"
                disabled={createProduct.isPending}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
                style={{
                  background: 'linear-gradient(135deg, #0035d1 0%, #3432c8 100%)',
                  boxShadow: '0 4px 14px 0 rgba(30, 76, 253, 0.25)',
                }}
              >
                {createProduct.isPending && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Lưu sản phẩm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
