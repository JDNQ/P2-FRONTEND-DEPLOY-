"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { ProductFormData } from "@/lib/schema";
import { api } from "@/lib/api";

export type VariantRowProps = {
    index: number;
    onRemove: () => void;
    canRemove: boolean;
    variantImage?: string | null;
    onImageUploaded?: (url: string) => void;
};

export function VariantRow({ index, onRemove, canRemove, variantImage, onImageUploaded }: VariantRowProps) {
    const resolvedOnImageUploaded = onImageUploaded ?? (() => { });
    const {
        register,
        formState: { errors },
    } = useFormContext<ProductFormData>();

    const [uploading, setUploading] = useState(false);

    // watch values to ensure UI can respond if needed (not required by spec, but fine)
    const variant = useWatch({
        name: `variants.${index}` as const,
    });

    const variantErrors = errors.variants?.[index];

    const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post("/upload/variant-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const body = response.data;
            const url: string = body?.data?.url ?? body?.url ?? "";
            resolvedOnImageUploaded(url);
        } catch (err) {
            console.error("❌ Lỗi upload ảnh variant:", err);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <div className="grid grid-cols-1 items-start gap-3 py-3 sm:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr_auto] sm:items-center">
            <div>
                <input
                    {...register(`variants.${index}.variantName` as const)}
                    className={
                        variantErrors?.variantName
                            ? "w-full rounded-md border border-red-500 px-3 py-2 outline-none focus:border-red-500"
                            : "w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:border-[#533AB7]"
                    }
                    placeholder="Tên variant"
                    type="text"
                />
                {variantErrors?.variantName && (
                    <p className="mt-1 text-xs text-red-600">
                        {variantErrors.variantName.message}
                    </p>
                )}
            </div>

            <div>
                <input
                    {...register(`variants.${index}.extraPrice` as const, { valueAsNumber: true })}
                    type="number"

                    inputMode="decimal"
                    className={
                        variantErrors?.extraPrice
                            ? "w-full rounded-md border border-red-500 px-3 py-2 text-right outline-none focus:border-red-500"
                            : "w-full rounded-md border border-gray-200 px-3 py-2 text-right outline-none focus:border-[#533AB7]"
                    }
                    placeholder="0"
                />
                {variantErrors?.extraPrice && (
                    <p className="mt-1 text-xs text-red-600">
                        {variantErrors.extraPrice.message}
                    </p>
                )}
            </div>

            <div>
                <input
                    {...register(`variants.${index}.stock` as const, { valueAsNumber: true })}
                    type="number"

                    inputMode="numeric"
                    className={
                        variantErrors?.stock
                            ? "w-full rounded-md border border-red-500 px-3 py-2 text-right outline-none focus:border-red-500"
                            : "w-full rounded-md border border-gray-200 px-3 py-2 text-right outline-none focus:border-[#533AB7]"
                    }
                    placeholder="0"
                />
                {variantErrors?.stock && (
                    <p className="mt-1 text-xs text-red-600">
                        {variantErrors.stock.message}
                    </p>
                )}
            </div>

            {/* Variant Image Upload */}
            <div className="flex flex-col items-center gap-1">
                {variantImage ? (
                    <div className="relative">
                        <img
                            src={variantImage.startsWith("http") ? variantImage : `${process.env.NEXT_PUBLIC_API_URL}${variantImage}`}
                            alt="Variant"
                            className="w-12 h-12 object-cover rounded border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={() => resolvedOnImageUploaded("")}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleVariantImageUpload}
                            className="hidden"
                        />
                        <span className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                            {uploading ? (
                                <span className="text-gray-500">Đang tải...</span>
                            ) : (
                                "Chọn ảnh"
                            )}
                        </span>
                    </label>
                )}
            </div>

            <div className="sm:text-right">
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={!canRemove}
                    className="rounded-md border border-red-500 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Xoá
                </button>
            </div>

            {/* keep lint quiet about unused watch */}
            <div className="hidden">{variant?.variantName}</div>
        </div>
    );
}