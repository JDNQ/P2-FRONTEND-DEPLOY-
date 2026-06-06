"use client";

import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductFormData } from "@/lib/schema";
import { productSchema } from "@/lib/schema";
import { VariantRow } from "@/components/VariantRow";
import { api } from "@/lib/api";

export type ProductSubmitPayload = {
    productName: string;
    description?: string;
    basePrice: number;
    shopId?: number;
    images?: Array<{ url: string; isPrimary: boolean }>;
    variants: Array<{
        variantName: string;
        extraPrice: number;
        stock: number;
        image?: string;
    }>;
};

export type ProductFormProps = {
    defaultValues?: Partial<ProductFormData>;
    onSubmit: (data: ProductSubmitPayload) => Promise<void> | void;
    shops?: Array<{ id: number; shopName: string }>;
    isEdit?: boolean;
    initialImages?: Array<{ url: string; isPrimary: boolean }>;
};

const DEFAULT_VALUES: Partial<ProductFormData> = {
    productName: "",
    description: "",
    basePrice: 0,
    shopId: undefined,
    variants: [{ variantName: "", extraPrice: 0, stock: 0 }],
};

export function ProductForm({
    defaultValues,
    onSubmit,
    shops = [],
    isEdit = false,
    initialImages = []
}: ProductFormProps) {

    const [productImages, setProductImages] = useState<Array<{ url: string; isPrimary: boolean }>>(initialImages ?? []);

    useEffect(() => {
        if (initialImages && initialImages.length > 0) {
            setProductImages(initialImages);
        }
    }, [initialImages]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [variantImages, setVariantImages] = useState<string[]>([]);
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: { ...DEFAULT_VALUES, ...defaultValues },
        mode: "onSubmit",
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    const variantsWatch = useWatch({ control, name: "variants" });
    const totalVariants = variantsWatch?.length ?? 0;
    const totalStock = (variantsWatch ?? []).reduce((sum, v) => sum + (Number(v?.stock) || 0), 0);
    const productNameValue = (useWatch({ control, name: "productName" }) as string) ?? "";

    const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }

            const response = await api.post("/upload/product-images", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const body = response.data;
            const urls: string[] = body?.data?.urls ?? body?.urls ?? [];
            const newImages = urls.map((url: string) => ({ url, isPrimary: false }));

            if (productImages.length === 0 && newImages.length > 0) {
                newImages[0].isPrimary = true;
            }

            setProductImages(prev => [...prev, ...newImages]);
        } catch (err) {
            console.error("❌ Lỗi upload ảnh sản phẩm:", err);
        } finally {
            setUploadingImages(false);
            // Reset input value so the same file can be re-selected
            e.target.value = "";
        }
    };

    const handleSetPrimary = (url: string) => {
        setProductImages(prev => prev.map(img => ({ ...img, isPrimary: img.url === url })));
    };

    const handleRemoveImage = (url: string) => {
        setProductImages(prev => {
            const filtered = prev.filter(img => img.url !== url);
            if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
                filtered[0].isPrimary = true;
            }
            return filtered;
        });
    };

    const handleVariantImageUploaded = (index: number, url: string) => {
        setVariantImages(prev => {
            const updated = [...prev];
            updated[index] = url;
            return updated;
        });
    };

    const onValid = async (data: ProductFormData) => {
        console.log("📤 Dữ liệu gốc từ form:", data);

        const payload: ProductSubmitPayload = {
            productName: data.productName?.trim() || "",
            description: data.description?.trim() || "",
            basePrice: Number(data.basePrice) || 0,
            shopId: data.shopId ?? undefined,
            images: productImages.length > 0 ? productImages : undefined,
            variants: data.variants
                .filter(v => v.variantName?.trim())
                .map((v, idx) => ({
                    variantName: v.variantName?.trim() || "",
                    extraPrice: Number(v.extraPrice) || 0,
                    stock: Number(v.stock) || 0,
                    image: variantImages[idx] ?? undefined,
                })),
        };

        console.log("📤 Payload sau transform (TẠO MỚI):", payload);
        await onSubmit(payload);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onValid)} className="w-full" noValidate>
                <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">

                    {/* Chọn Shop - Chỉ hiển thị khi tạo mới */}
                    {!isEdit && shops.length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-gray-800">Chọn Shop <span className="text-red-500">*</span></label>
                            <select
                                {...register("shopId", { valueAsNumber: true })}
                                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:border-[#1e3a6e]"
                            >
                                <option value="">-- Chọn shop --</option>
                                {shops.map((shop) => (
                                    <option key={shop.id} value={shop.id}>
                                        {shop.shopName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Product Name */}
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-800">Tên sản phẩm</label>
                            <span className="text-xs text-gray-500">{String(productNameValue).length}/100</span>
                        </div>
                        <input
                            {...register("productName")}
                            className={errors.productName ? "w-full rounded-md border border-red-500 px-3 py-2" : "w-full rounded-md border border-gray-200 px-3 py-2 focus:border-[#1e3a6e]"}
                            placeholder="Nhập tên sản phẩm"
                        />
                        {errors.productName && <p className="text-xs text-red-500 mt-1">{errors.productName.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-800">Mô tả</label>
                        <textarea
                            {...register("description")}
                            className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 focus:border-[#1e3a6e]"
                            placeholder="Mô tả sản phẩm (tuỳ chọn)"
                            rows={4}
                        />
                    </div>

                    {/* Base Price */}
                    <div>
                        <label className="text-sm font-medium text-gray-800">Giá gốc (Base price)</label>
                        <input
                            {...register("basePrice", { valueAsNumber: true })}
                            type="number"
                            className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 focus:border-[#1e3a6e]"
                            placeholder="0"
                        />
                        {errors.basePrice && <p className="text-xs text-red-500 mt-1">{errors.basePrice.message}</p>}
                    </div>

                    {/* Product Images Upload Section */}
                    <div>
                        <label className="text-sm font-medium text-gray-800">Ảnh sản phẩm</label>
                        <div
                            className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-orange-400 transition"
                            onClick={() => document.getElementById("product-image-upload")?.click()}
                        >
                            <input
                                id="product-image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleProductImageUpload}
                                className="hidden"
                            />
                            {uploadingImages ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                                    <span className="ml-2 text-sm text-gray-500">Đang tải ảnh lên...</span>
                                </div>
                            ) : (
                                <>
                                    <span className="text-3xl">📷</span>
                                    <p className="mt-2 text-sm text-gray-600">Nhấn để chọn ảnh hoặc kéo thả vào đây</p>
                                    <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP tối đa 10 ảnh</p>
                                </>
                            )}
                        </div>

                        {productImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-3 mt-4">
                                {productImages.map((img) => (
                                    <div key={img.url} className="relative">
                                        <img
                                            src={img.url.startsWith("http") ? img.url : `${apiBase}${img.url}`}
                                            alt="Sản phẩm"
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        {img.isPrimary && (
                                            <span className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                                                Ảnh chính
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(img.url)}
                                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-opacity-70"
                                        >
                                            ✕
                                        </button>
                                        {!img.isPrimary && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetPrimary(img.url)}
                                                className="mt-1 text-xs text-orange-500 hover:text-orange-700 font-medium"
                                            >
                                                Đặt làm ảnh chính
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Variants Section */}
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <div className="flex flex-col gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Biến thể (Variants)</p>
                                <p className="text-xs text-gray-600">
                                    Tổng variants: {totalVariants} • Tổng stock: {totalStock}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => append({ variantName: "", extraPrice: 0, stock: 0 })}
                                className="inline-flex items-center justify-center rounded-md bg-[#1e3a6e] px-4 py-2 text-sm font-medium text-white hover:bg-[#173359]"
                            >
                                + Thêm variant
                            </button>
                        </div>

                        <div className="divide-y divide-gray-200 px-4">
                            <div className="grid grid-cols-1 gap-3 py-3 text-xs font-semibold text-gray-600 sm:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr_auto]">
                                <div>Tên biến thể</div>
                                <div className="sm:text-right">Giá tăng thêm</div>
                                <div className="sm:text-right">Tồn kho</div>
                                <div className="sm:text-center">Ảnh variant</div>
                                <div className="sm:text-right">Actions</div>
                            </div>

                            {fields.map((field, index) => (
                                <VariantRow
                                    key={field.id}
                                    index={index}
                                    onRemove={() => remove(index)}
                                    canRemove={fields.length > 1}
                                    variantImage={variantImages[index] ?? null}
                                    onImageUploaded={(url) => handleVariantImageUploaded(index, url)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="px-6 py-3 bg-[#1e3a6e] text-white font-semibold rounded-lg hover:bg-[#173359] disabled:opacity-60"
                        >
                            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
                        </button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}