'use client'

import { useParams, useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useProduct, useUpdateProduct } from '@/lib/hooks/useProducts'
import { productSchema } from '@/lib/validations/productSchema'
import { uploadApi } from '@/lib/api/uploadApi'
import type { CreateProductDto } from '@/lib/types/product'
import Link from 'next/link'
import type { z } from 'zod'
import { useState, useEffect } from 'react'

type EditProductValues = z.input<typeof productSchema>

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const { data: product, isLoading, isError } = useProduct(id)
  const updateMutation = useUpdateProduct()
  const [uploading, setUploading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
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
            image: v.image || '',
          })),
          images: product.images?.map(i => i.url) || [],
        }
      : undefined,
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
    const current = (getValues('images') as string[]) || []
    setValue('images', current.filter((_, i) => i !== idx))
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

  const onSubmit = (data: EditProductValues) => {
    const payload: CreateProductDto = {
      productName: data.productName,
      description: data.description,
      basePrice: data.basePrice,
      shopId: product?.shopId || 1,
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
    updateMutation.mutate(
      { id, data: payload },
      { onSuccess: () => router.push('/dashboard/admin/products') },
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-5xl text-[#ba1a1a]">error_outline</span>
        <p className="text-[#444656] font-medium">Không thể tải sản phẩm</p>
        <Link href="/dashboard/admin/products" className="px-4 py-2 bg-[#60a5fa] text-white rounded-lg text-sm font-bold">Quay lại</Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/products" className="text-[#747688] hover:text-[#3b82f6] transition-colors flex items-center gap-2 text-sm font-medium">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Quay lại
          </Link>
          <div className="h-4 w-px bg-[#c4c5d9]" />
          <h1 className="text-[18px] font-bold text-[#1e40af]">Chỉnh sửa sản phẩm</h1>
        </div>
        <button type="submit" disabled={updateMutation.isPending || uploading}
          className="px-4 py-2 text-white rounded-lg text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
          }}>
          {(updateMutation.isPending || uploading) && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Cập nhật sản phẩm
        </button>
      </div>

      {/* Basic Info */}
      <section className="bg-[#fcf8ff] rounded-xl shadow-sm border border-[#c4c5d9]/50 p-6">
        <h2 className="text-base font-bold text-[#1e40af] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3b82f6]">info</span>
          Thông tin cơ bản
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#444656] mb-1">Tên sản phẩm <span className="text-[#ba1a1a]">*</span></label>
            <input {...register('productName')}
              className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all" />
            {errors.productName && <p className="text-[#ba1a1a] text-xs mt-1">{errors.productName.message}</p>}
            <p className="mt-1 text-[11px] text-[#747688] text-right">{productName?.length || 0}/100</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#444656] mb-1">Mô tả sản phẩm</label>
            <textarea {...register('description')} rows={4}
              className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#444656] mb-1">Giá gốc (đ) <span className="text-[#ba1a1a]">*</span></label>
            <input {...register('basePrice', { valueAsNumber: true })} type="number"
              className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all" />
            {errors.basePrice && <p className="text-[#ba1a1a] text-xs mt-1">{errors.basePrice.message}</p>}
          </div>
        </div>
      </section>

      {/* Product Images */}
      <section className="bg-[#fcf8ff] rounded-xl shadow-sm border border-[#c4c5d9]/50 p-6">
        <h2 className="text-base font-bold text-[#1e40af] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3b82f6]">photo_library</span>
          Hình ảnh sản phẩm
        </h2>
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#c4c5d9] group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute top-1 left-1 bg-[#3b82f6] text-white text-[10px] px-1.5 rounded font-bold">Chính</span>}
              <button type="button" onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">x</button>
            </div>
          ))}
          <label className="w-24 h-24 rounded-lg border-2 border-dashed border-[#c4c5d9] flex flex-col items-center justify-center cursor-pointer hover:border-[#3b82f6] transition-colors text-[#747688]">
            <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
            <span className="text-[10px] mt-1">Thêm ảnh</span>
            <input type="file" multiple accept="image/*" onChange={handleImagesUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
        {uploading && <p className="text-xs text-[#3b82f6] mt-2">Đang tải ảnh lên...</p>}
      </section>

      {/* Variants */}
      <section className="bg-[#fcf8ff] rounded-xl shadow-sm border border-[#c4c5d9]/50 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-base font-bold text-[#1e40af] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3b82f6]">inventory_2</span>
            Biến thể sản phẩm
          </h2>
          <div className="flex items-center gap-4 text-xs font-medium text-[#747688]">
            <span>Tổng biến thể: <strong className="text-[#1e40af]">{fields.length}</strong></span>
            <div className="w-px h-3 bg-[#c4c5d9]" />
            <span>Tổng tồn kho: <strong className="text-[#1e40af]">{totalStock}</strong></span>
          </div>
        </div>

        {errors.variants && !Array.isArray(errors.variants) && (
          <p className="text-[#ba1a1a] text-xs mb-3">{errors.variants.message}</p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f5f2ff] text-[#444656] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3 border-b border-[#c4c5d9] w-12">#</th>
                <th className="px-4 py-3 border-b border-[#c4c5d9]">Tên biến thể <span className="text-[#ba1a1a]">*</span></th>
                <th className="px-4 py-3 border-b border-[#c4c5d9]">Giá cộng thêm (đ)</th>
                <th className="px-4 py-3 border-b border-[#c4c5d9] w-32">Tồn kho <span className="text-[#ba1a1a]">*</span></th>
                <th className="px-4 py-3 border-b border-[#c4c5d9] w-28">Ảnh</th>
                <th className="px-4 py-3 border-b border-[#c4c5d9] w-20 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#c4c5d9]/20">
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-[#f5f2ff]/50">
                  <td className="px-4 py-4 text-[#747688]">{index + 1}</td>
                  <td className="px-4 py-4">
                    <input {...register(`variants.${index}.variantName`)}
                      className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all h-9" />
                    {errors.variants?.[index]?.variantName && (
                      <p className="text-[#ba1a1a] text-xs mt-1">{errors.variants[index]?.variantName?.message}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <input {...register(`variants.${index}.extraPrice`, { valueAsNumber: true })} type="number"
                      className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all h-9" />
                  </td>
                  <td className="px-4 py-4">
                    <input {...register(`variants.${index}.stock`, { valueAsNumber: true })} type="number"
                      className="w-full border border-[#c4c5d9] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] outline-none transition-all h-9" />
                  </td>
                  <td className="px-4 py-4">
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
                  <td className="px-4 py-4 text-center">
                    <button type="button" onClick={() => remove(index)} disabled={fields.length <= 1}
                      className="p-2 text-[#747688] hover:text-[#ba1a1a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
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
          className="mt-4 flex items-center gap-2 text-[#3b82f6] hover:text-[#60a5fa] text-sm font-medium transition-colors">
          <span className="material-symbols-outlined text-sm">add</span>
          Thêm biến thể
        </button>
      </section>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-4 py-4 border-t border-[#c4c5d9]/30">
        <Link href="/dashboard/admin/products"
          className="px-8 py-2.5 border border-[#c4c5d9] rounded-lg text-sm font-semibold text-[#444656] hover:bg-[#f5f2ff] transition-colors">
          Hủy bỏ
        </Link>
        <button type="submit" disabled={updateMutation.isPending || uploading}
          className="px-8 py-2.5 text-white rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
          }}>
          {(updateMutation.isPending || uploading) && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Cập nhật sản phẩm
        </button>
      </div>
    </form>
  )
}
