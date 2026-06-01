"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/api";

import { ProductForm } from "@/components/ProductForm";
import type { ProductFormData } from "@/lib/schema";

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCreate = async (data: ProductFormData) => {
        setLoading(true);
        try {
            await createProduct(data);

            router.push("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8">
            <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900">Tạo sản phẩm</h1>
            </div>

            {loading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
                    Đang tạo...
                </div>
            ) : (
                <ProductForm onSubmit={handleCreate} />
            )}

            <div className="mt-4">
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                >
                    ← Quay lại
                </button>
            </div>
        </div>
    );
}

