"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { ProductFormData } from "@/lib/schema";
import { VariantRow } from "@/components/VariantRow";

export type VariantListProps = {
    header?: React.ReactNode;
};

export function VariantList({ header }: VariantListProps) {
    const { control } = useFormContext<ProductFormData>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    return (
        <div>
            {header}
            <div>
                {fields.map((field, index) => (
                    <VariantRow
                        key={field.id}
                        index={index}
                        onRemove={() => remove(index)}
                        canRemove={fields.length > 1}
                    />
                ))}
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
                className="inline-flex items-center justify-center rounded-md bg-[#533AB7] px-3 py-2 text-sm font-medium text-white hover:opacity-95"
            >
                + Thêm variant
            </button>
        </div>
    );
}

