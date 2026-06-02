"use client";

import React from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductFormData } from "@/lib/schema";
import { productSchema } from "@/lib/schema";
import { VariantRow } from "@/components/VariantRow";

// Định nghĩa type cho payload gửi lên backend
export type ProductSubmitPayload = {
    productName: string;           // ← Đổi lại theo backend
    description: string;
    basePrice: number;
    shopId?: number;
    variants: Array<{
        variantName: string;       // ← Đổi lại theo backend
        extraPrice: number;
        stock: number;
    }>;
};

export type ProductFormProps = {
    defaultValues?: Partial<ProductFormData>;
    onSubmit: (data: ProductSubmitPayload) => Promise<void> | void;
    shops?: Array<{ id: number; shopName: string }>;
    isEdit?: boolean;
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
    isEdit = false
}: ProductFormProps) {

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

    const onValid = async (data: ProductFormData) => {
        console.log("📤 Dữ liệu gốc từ form:", data);

        const payload: ProductSubmitPayload = {
            productName: data.productName?.trim() || "",
            description: data.description?.trim() || "",
            basePrice: Number(data.basePrice) || 0,
            ...(!isEdit && { shopId: Number(data.shopId) || 1 }),   // Chỉ gửi shopId khi tạo mới
            variants: data.variants.map((v) => ({
                variantName: v.variantName?.trim() || "",
                extraPrice: Number(v.extraPrice) || 0,
                stock: Number(v.stock) || 0,
            })),
        };

        console.log("📤 Payload sau transform (sẽ gửi lên backend):", payload);

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
                            {errors.shopId && <p className="mt-1 text-xs text-red-500">{errors.shopId.message}</p>}
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
                            <div className="grid grid-cols-1 gap-3 py-3 text-xs font-semibold text-gray-600 sm:grid-cols-[1.2fr_0.7fr_0.7fr_auto]">
                                <div>Tên biến thể</div>
                                <div className="sm:text-right">Giá tăng thêm</div>
                                <div className="sm:text-right">Tồn kho</div>
                                <div className="sm:text-right">Actions</div>
                            </div>

                            {fields.map((field, index) => (
                                <VariantRow
                                    key={field.id}
                                    index={index}
                                    onRemove={() => remove(index)}
                                    canRemove={fields.length > 1}
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