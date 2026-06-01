"use client";

import React from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductFormData } from "@/lib/schema";
import { productSchema } from "@/lib/schema";
import { VariantRow } from "@/components/VariantRow";

const COLORS = {
    primary: "#1e3a6e",
    accent: "#60b4ff",
    error: "#ef4444",
} as const;


export type ProductFormProps = {
    defaultValues?: ProductFormData;
    onSubmit: (data: ProductFormData) => Promise<void> | void;
};

const DEFAULT_VALUES: ProductFormData = {
    productName: "",
    description: "",
    basePrice: 0,
    variants: [
        {
            variantName: "",
            extraPrice: 0,
            stock: 0,
        },
    ],
};

export function ProductForm({ defaultValues, onSubmit }: ProductFormProps) {
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: defaultValues ?? DEFAULT_VALUES,
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
    const totalStock = (variantsWatch ?? []).reduce(
        (sum, v) => sum + (Number(v?.stock) || 0),
        0
    );

    const productNameValue =
        (useWatch({ control, name: "productName" }) as string) ?? "";

    const onValid = async (data: ProductFormData) => {
        console.log(data);
        await onSubmit(data);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onValid)} className="w-full" noValidate>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="mb-6 flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-4">
                            <label className="text-sm font-medium text-gray-800">
                                Product name
                            </label>
                            <span className="text-xs text-gray-500">
                                {String(productNameValue).length}/100
                            </span>


                        </div>
                        <input
                            {...register("productName")}
                            className={
                                errors.productName
                                    ? "w-full rounded-md border border-[#ef4444] px-3 py-2 outline-none focus:border-[#ef4444]"
                                    : "w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:border-[#1e3a6e]"
                            }
                            placeholder="Nhập tên sản phẩm"
                            type="text"
                        />
                        {errors.productName && (
                            <p className="text-xs text-[#ef4444]">{errors.productName.message}</p>
                        )}



                    </div>

                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-800">Description</label>
                        <textarea
                            {...register("description")}
                            className={
                                errors.description
                                    ? "mt-2 w-full rounded-md border border-[#ef4444] px-3 py-2 outline-none focus:border-[#ef4444]"
                                    : "mt-2 w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:border-[#1e3a6e]"
                            }
                            placeholder="Mô tả (tuỳ chọn)"
                            rows={4}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-800">Base price</label>
                        <input
                            {...register("basePrice", { valueAsNumber: true })}
                            type="number"
                            inputMode="decimal"
                            className={
                                errors.basePrice
                                    ? "mt-2 w-full rounded-md border border-[#ef4444] px-3 py-2 outline-none focus:border-[#ef4444]"
                                    : "mt-2 w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:border-[#1e3a6e]"
                            }
                            placeholder="0"
                        />
                        {errors.basePrice && (
                            <p className="mt-2 text-xs text-[#ef4444]">{errors.basePrice.message}</p>
                        )}



                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <div className="flex flex-col gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Variants</p>
                                <p className="text-xs text-gray-600">
                                    Tổng variants: {totalVariants} • Tổng stock: {totalStock}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    append({
                                        variantName: "",
                                        extraPrice: 0,
                                        stock: 0,
                                    })
                                }

                                className="inline-flex items-center justify-center rounded-md bg-[#1e3a6e] px-3 py-2 text-sm font-medium text-white hover:opacity-95"
                            >
                                + Thêm variant
                            </button>
                        </div>

                        <div className="divide-y divide-gray-200 px-4">
                            <div className="grid grid-cols-1 gap-3 py-3 text-xs font-semibold text-gray-600 sm:grid-cols-[1.2fr_0.7fr_0.7fr_auto] sm:items-center">
                                <div>Variant name</div>
                                <div className="sm:text-right">Extra price</div>
                                <div className="sm:text-right">Stock</div>
                                <div className="sm:text-right">Actions</div>
                            </div>

                            <div className="pb-3">
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
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-3">
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md bg-[#1e3a6e] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
                        </button>
                    </div>

                    {errors.variants?.root && (
                        <p className="mt-2 text-xs text-[#ef4444]">{errors.variants.root.message}</p>
                    )}

                </div>
            </form>
        </FormProvider>
    );
}

