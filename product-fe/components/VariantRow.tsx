"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { ProductFormData } from "@/lib/schema";

export type VariantRowProps = {
    index: number;
    onRemove: () => void;
    canRemove: boolean;
};

export function VariantRow({ index, onRemove, canRemove }: VariantRowProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext<ProductFormData>();

    // watch values to ensure UI can respond if needed (not required by spec, but fine)
    const variant = useWatch({
        name: `variants.${index}` as const,
    });

    const variantErrors = errors.variants?.[index];

    return (
        <div className="grid grid-cols-1 items-start gap-3 py-3 sm:grid-cols-[1.2fr_0.7fr_0.7fr_auto] sm:items-center">
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

