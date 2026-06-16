'use client'

import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateProduct } from '@/lib/hooks/useProducts'
import { productSchema } from '@/lib/validations/productSchema'
import { uploadApi } from '@/lib/api/uploadApi'
import type { CreateProductDto } from '@/lib/types/product'
import type { z } from 'zod'
import { useState } from 'react'

type NewProductValues = z.input<typeof productSchema>

export default function NewProductPage() {
  const router = useRouter()
  const createProduct = useCreateProduct()
  const [uploading, setUploading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<NewProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: '',
      description: '',
      basePrice: 0,
      variants: [{ variantName: '', extraPrice: 0, stock: 0, image: '' }],
      images: [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' })
  const productName = watch('productName')
  const variants = watch('variants')
  const totalStock = variants?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || 0
  const images = watch('images') || []

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    try {
      const urls = await uploadApi.productImages(files)
      const current = (getValues('images') as string[]) || []
      setValue('images', [...current, ...urls])
    } catch {
      alert('Upload ảnh thất bại')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (idx: number) => {
    setValue('images', images.filter((_, i) => i !== idx))
  }

  const handleVariantImageUpload = async (index: number, file: File) => {
    setUploading(true)
    try {
      const url = await uploadApi.variantImage(file)
      setValue(`variants.${index}.image`, url)
    } catch {
      alert('Upload ảnh variant thất bại')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: NewProductValues) => {
    const payload: CreateProductDto = {
      productName: data.productName,
      description: data.description,
      basePrice: data.basePrice,
      shopId: 1,
      variants: (data.variants || []).map(v => ({
        variantName: v.variantName,
        extraPrice: v.extraPrice,
        stock: v.stock,
        image: typeof v.image === 'string' && v.image ? v.image : undefined,
      })),
      images: Array.isArray(data.images)
        ? data.images.filter((u): u is string => typeof u === 'string').map((url, i) => ({ url, isPrimary: i === 0 }))
        : undefined,
    }
    createProduct.mutate(payload, {
      onSuccess: () => router.push('/dashboard/admin/products'),
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-[24px] font-bold text-[#1e40af]">Thêm sản phẩm mới</h2>
        <p className="text-sm text-[#444656] mt-1">
          Vui lòng điền đầy đủ thông tin để tạo sản phẩm trong kho.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#c4c5d9]/50 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#1e40af] pb-2 border-b border-[#c4c5d9]/30">
                Thông tin cơ bản
              </h3>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#444656]">
                  Product Name <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  {...register('productName')}
                  className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all outline-none text-sm"
                  placeholder="Nhập tên sản phẩm"
                />
                {errors.productName && (
                  <p className="text-[#ba1a1a] text-xs mt-1">{errors.productName.message}</p>
                )}
                <div className="flex justify-end">
                  <span className="text-[10px] text-[#747688]">{productName?.length || 0}/100</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#444656]">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all outline-none resize-none text-sm"
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
                    className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all outline-none text-sm"
                    placeholder="Nhập giá gốc"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747688] text-sm">VND</span>
                </div>
                {errors.basePrice && (
                  <p className="text-[#ba1a1a] text-xs mt-1">{errors.basePrice.message}</p>
                )}
              </div>
            </div>

            {/* Product Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#1e40af] pb-2 border-b border-[#c4c5d9]/30">
                Hình ảnh sản phẩm
              </h3>
              <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#c4c5d9] group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-[#3b82f6] text-white text-[10px] px-1.5 rounded font-bold">Chính</span>
                    )}
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      x
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-[#c4c5d9] flex flex-col items-center justify-center cursor-pointer hover:border-[#3b82f6] transition-colors text-[#747688]">
                  <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                  <span className="text-[10px] mt-1">Thêm ảnh</span>
                  <input type="file" multiple accept="image/*" onChange={handleImagesUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
              {uploading && <p className="text-xs text-[#3b82f6]">Đang tải ảnh lên...</p>}
            </div>

            {/* Variants */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#c4c5d9]/30">
                <h3 className="text-lg font-bold text-[#1e40af]">Variants</h3>
                <div className="flex items-center gap-4 text-xs font-medium text-[#747688] bg-[#f5f2ff] px-3 py-1 rounded-full">
                  <span>Tổng variants: <span className="text-[#3b82f6] font-bold">{fields.length}</span></span>
                  <span className="w-px h-3 bg-[#c4c5d9]" />
                  <span>Tổng stock: <span className="text-[#3b82f6] font-bold">{totalStock}</span></span>
                </div>
              </div>

              {errors.variants && !Array.isArray(errors.variants) && (
                <p className="text-[#ba1a1a] text-xs">{errors.variants.message}</p>
              )}

              <div className="overflow-hidden border border-[#c4c5d9] rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f5f2ff] border-b border-[#c4c5d9]">
                    <tr>
                      {['#', 'Variant Name *', 'Extra Price', 'Stock *', 'Ảnh', 'Thao tác'].map((h) => (
                        <th key={h} className="px-4 py-3 text-[11px] font-bold text-[#444656] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c4c5d9]/20">
                    {fields.map((field, index) => (
                      <tr key={field.id}>
                        <td className="px-4 py-3 text-sm text-[#747688] font-medium">{index + 1}</td>
                        <td className="px-4 py-3">
                          <input
                            {...register(`variants.${index}.variantName`)}
                            className="w-full px-3 py-1.5 border border-[#c4c5d9] rounded-md text-sm focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                            placeholder="VD: Đen - 64GB"
                          />
                          {errors.variants?.[index]?.variantName && (
                            <p className="text-[#ba1a1a] text-xs mt-0.5">{errors.variants[index]?.variantName?.message}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            {...register(`variants.${index}.extraPrice`, { valueAsNumber: true })}
                            type="number"
                            className="w-full px-3 py-1.5 border border-[#c4c5d9] rounded-md text-sm focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                            type="number"
                            className="w-full px-3 py-1.5 border border-[#c4c5d9] rounded-md text-sm focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {variants?.[index]?.image ? (
                              <div className="relative w-10 h-10 rounded overflow-hidden border group">
                                <img src={variants[index].image} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setValue(`variants.${index}.image`, '')}
                                  className="absolute top-0 right-0 w-4 h-4 bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">x</button>
                              </div>
                            ) : (
                              <label className="w-10 h-10 rounded border-2 border-dashed border-[#c4c5d9] flex items-center justify-center cursor-pointer hover:border-[#3b82f6] text-[#747688]">
                                <span className="material-symbols-outlined text-sm">add</span>
                                <input type="file" accept="image/*" onChange={e => {
                                  const file = e.target.files?.[0]
                                  if (file) handleVariantImageUpload(index, file)
                                }} className="hidden" disabled={uploading} />
                              </label>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button type="button" onClick={() => remove(index)} disabled={fields.length <= 1}
                            className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button type="button"
                onClick={() => append({ variantName: '', extraPrice: 0, stock: 0, image: '' })}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#3b82f6] text-[#3b82f6] font-bold text-sm rounded-lg hover:bg-[#3b82f6]/5 transition-colors">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Thêm variant
              </button>
            </div>

            {/* Submit */}
            <div className="pt-8 mt-4 border-t border-[#c4c5d9]/30">
              <button type="submit"
                disabled={createProduct.isPending || uploading}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
                }}>
                {(createProduct.isPending || uploading) && (
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
