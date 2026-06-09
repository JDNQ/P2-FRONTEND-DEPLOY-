'use client'

import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateProduct } from '@/lib/hooks/useProducts'
import { useRef, useState, useEffect } from 'react'
import { productSchema } from '@/lib/validations/productSchema'
import type { ProductImageDto } from '@/lib/types/product'
import type { z } from 'zod'

type NewProductValues = z.infer<typeof productSchema>

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export default function NewProductPage() {
  const router = useRouter()
  const createProduct = useCreateProduct()

  const [mainImages, setMainImages] = useState<File[]>([])
  const [variantImages, setVariantImages] = useState<(File | null)[]>([null])
  const [previews, setPreviews] = useState<string[]>([])
  const [variantPreviews, setVariantPreviews] = useState<(string | null)[]>([null])
  const mainFileInputRef = useRef<HTMLInputElement>(null)
  const variantFileRefs = useRef<(HTMLInputElement | null)[]>([])

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
      shopId: 1,
      variants: [{ variantName: '', extraPrice: 0, stock: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' })
  const productName = watch('productName')
  const variants = watch('variants')
  const totalStock = variants?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || 0

  useEffect(() => {
    const urls = mainImages.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [mainImages])

  useEffect(() => {
    const urls = variantImages.map((f) => (f ? URL.createObjectURL(f) : null))
    setVariantPreviews(urls)
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u))
  }, [variantImages])

  const handleMainFiles = (files: FileList | null) => {
    if (!files) return
    setMainImages((prev) => [...prev, ...Array.from(files)])
  }

  const removeMainImage = (index: number) => {
    setMainImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVariantFile = (index: number, file: File | null) => {
    setVariantImages((prev) => {
      const next = [...prev]
      next[index] = file
      return next
    })
  }

  const clearVariantImage = (index: number) => {
    setVariantImages((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
    if (variantFileRefs.current[index]) {
      variantFileRefs.current[index]!.value = ''
    }
  }

  const handleAddVariant = () => {
    append({ variantName: '', extraPrice: 0, stock: 0 })
    setVariantImages((prev) => [...prev, null])
  }

  const handleRemoveVariant = (index: number) => {
    remove(index)
    setVariantImages((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: NewProductValues) => {
    const imageDtos: ProductImageDto[] = await Promise.all(
      mainImages.map(async (file, i) => ({
        url: await fileToBase64(file),
        isPrimary: i === 0,
      }))
    )
    const variantDtos = await Promise.all(
      data.variants.map(async (v, i) => ({
        ...v,
        image: variantImages[i] ? await fileToBase64(variantImages[i]!) : undefined,
      }))
    )
    createProduct.mutate(
      {
        ...data,
        ...(imageDtos.length ? { images: imageDtos } : {}),
        variants: variantDtos,
      },
      { onSuccess: () => router.push('/dashboard/admin/products') }
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-[24px] font-bold text-[#08006c]">Thêm sản phẩm mới</h2>
        <p className="text-sm text-[#444656] mt-1">Vui lòng điền đầy đủ thông tin để tạo sản phẩm trong kho.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#c4c5d9]/50 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#08006c] pb-2 border-b border-[#c4c5d9]/30">Thông tin cơ bản</h3>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#444656]">Product Name *</label>
                <input
                  {...register('productName')}
                  className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none text-sm"
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
                  className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none resize-none text-sm"
                  placeholder="Mô tả sản phẩm..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#444656]">Base Price *</label>
                  <div className="relative">
                    <input
                      {...register('basePrice', { valueAsNumber: true })}
                      type="number"
                      className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none text-sm"
                      placeholder="Nhập giá gốc"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747688] text-sm">VND</span>
                  </div>
                  {errors.basePrice && (
                    <p className="text-[#ba1a1a] text-xs mt-1">{errors.basePrice.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#444656]">Category</label>
                  <select className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none text-sm bg-white appearance-none">
                    <option>Thời trang nam</option>
                    <option>Thời trang nữ</option>
                    <option>Phụ kiện</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#444656]">Shop</label>
                  <select
                    {...register('shopId', { valueAsNumber: true })}
                    className="w-full px-4 py-2.5 border border-[#c4c5d9] rounded-lg focus:ring-2 focus:ring-[#0035d1]/20 focus:border-[#0035d1] transition-all outline-none text-sm bg-white appearance-none"
                  >
                    <option value={1}>Shop chính</option>
                  </select>
                  {errors.shopId && (
                    <p className="text-[#ba1a1a] text-xs mt-1">{errors.shopId.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Media: Multi-image upload */}
            <div className="space-y-6 pt-2">
              <h3 className="text-lg font-bold text-[#08006c] pb-2 border-b border-[#c4c5d9]/30">Hình ảnh sản phẩm</h3>

              <input
                ref={mainFileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleMainFiles(e.target.files)}
              />

              <div
                onClick={() => mainFileInputRef.current?.click()}
                className="border-2 border-dashed border-[#c4c5d9] rounded-xl p-8 flex flex-col items-center justify-center bg-[#f5f2ff] hover:bg-[#eeecff] hover:border-[#0035d1] transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#0035d1]">cloud_upload</span>
                </div>
                <p className="text-sm font-bold text-[#444656]">Kéo thả hoặc click để chọn nhiều ảnh</p>
                <p className="text-xs text-[#747688] mt-1">Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB mỗi ảnh)</p>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className="aspect-square rounded-lg border border-[#c4c5d9] overflow-hidden relative group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeMainImage(i)}
                        className="absolute top-1 right-1 bg-white/90 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-[#ba1a1a] shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 bg-[#0035d1] text-white text-[10px] px-2 py-0.5 rounded font-bold">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => mainFileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-[#c4c5d9] flex items-center justify-center text-[#747688] hover:text-[#0035d1] hover:border-[#0035d1] transition-colors"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              )}
            </div>

            {/* Variants with per-variant image */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#c4c5d9]/30">
                <h3 className="text-lg font-bold text-[#08006c]">Variants</h3>
                <div className="flex items-center gap-4 text-xs font-medium text-[#747688] bg-[#f5f2ff] px-3 py-1 rounded-full">
                  <span>Tổng variants: <span className="text-[#0035d1] font-bold">{fields.length}</span></span>
                  <span className="w-px h-3 bg-[#c4c5d9]" />
                  <span>Tổng stock: <span className="text-[#0035d1] font-bold">{totalStock}</span></span>
                </div>
              </div>

              {errors.variants && !Array.isArray(errors.variants) && (
                <p className="text-[#ba1a1a] text-xs">{errors.variants.message}</p>
              )}

              <div className="overflow-hidden border border-[#c4c5d9] rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f5f2ff] border-b border-[#c4c5d9]">
                    <tr>
                      {['#', 'Image', 'Variant Name *', 'Extra Price', 'Stock *', 'Thao tác'].map((h) => (
                        <th key={h} className="px-4 py-3 text-[11px] font-bold text-[#444656] uppercase tracking-wider text-center first:text-center">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c4c5d9]/20">
                    {fields.map((field, index) => (
                      <tr key={field.id}>
                        <td className="px-4 py-3 text-sm text-[#747688] font-medium text-center">{index + 1}</td>
                        <td className="px-4 py-3">
                          <input
                            ref={(el) => { variantFileRefs.current[index] = el }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null
                              handleVariantFile(index, file)
                            }}
                          />
                          <div
                            onClick={() => variantFileRefs.current[index]?.click()}
                            className="w-12 h-12 rounded-lg border border-dashed border-[#c4c5d9] flex items-center justify-center cursor-pointer hover:border-[#0035d1] hover:bg-[#0035d1]/5 transition-all overflow-hidden"
                          >
                            {variantPreviews[index] ? (
                              <div className="relative w-full h-full group">
                                <img src={variantPreviews[index]!} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); clearVariantImage(index) }}
                                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                  <span className="material-symbols-outlined text-white text-sm">close</span>
                                </button>
                              </div>
                            ) : (
                              <span className="material-symbols-outlined text-[#747688] text-lg">add_a_photo</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            {...register(`variants.${index}.variantName`)}
                            className="w-full px-3 py-1.5 border border-[#c4c5d9] rounded-md text-sm focus:border-[#0035d1] focus:ring-1 focus:ring-[#0035d1] outline-none"
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
                            className="w-full px-3 py-1.5 border border-[#c4c5d9] rounded-md text-sm text-center focus:border-[#0035d1] focus:ring-1 focus:ring-[#0035d1] outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                            type="number"
                            className="w-full px-3 py-1.5 border border-[#c4c5d9] rounded-md text-sm text-center focus:border-[#0035d1] focus:ring-1 focus:ring-[#0035d1] outline-none"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(index)}
                            disabled={fields.length <= 1}
                            className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={handleAddVariant}
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
