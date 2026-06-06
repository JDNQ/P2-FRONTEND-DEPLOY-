"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/api";
import { ProductForm } from "@/components/ProductForm";
import type { ProductFormData } from "@/lib/schema";
import type { ProductSubmitPayload } from "@/components/ProductForm";

type ProductResponse = {
    id: string;
    productName: string;
    description?: string;
    basePrice: number;
    shopId?: number;
    images?: Array<{ id: number; url: string; isPrimary: boolean }>;
    variants: Array<{
        variantName: string;
        extraPrice: number;
        stock: number;
    }>;
};

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ProductFormData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [initialImages, setInitialImages] = useState<Array<{ url: string; isPrimary: boolean }>>([]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                if (!id) return;
                const p = (await getProductById(id)) as ProductResponse;

                if (!mounted) return;

                setData({
                    productName: p.productName ?? "",
                    description: p.description ?? "",
                    basePrice: p.basePrice ?? 0,
                    shopId: p.shopId ?? 1,
                    variants: p.variants?.map((v) => ({
                        variantName: v.variantName ?? "",
                        extraPrice: v.extraPrice ?? 0,
                        stock: v.stock ?? 0,
                    })) ?? [{ variantName: "", extraPrice: 0, stock: 0 }],
                });

                setInitialImages(p.images?.map(img => ({ url: img.url, isPrimary: img.isPrimary })) ?? []);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Không thể tải dữ liệu";
                if (!mounted) return;
                setError(message);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [id]);

    const handleUpdate = async (payload: ProductSubmitPayload) => {
        if (!id) return;
        try {
            console.log("📤 Gửi update payload:", payload);
            await updateProduct(id, payload);

            alert("✅ Cập nhật sản phẩm thành công!");
            router.push(`/products/${id}`);
        } catch (err: unknown) {
            const errorObj = err as Error & { response?: { data?: { message?: string } } };
            const message = errorObj?.response?.data?.message ||
                errorObj?.message ||
                "Cập nhật thất bại";

            alert(message);
            console.error("❌ Lỗi cập nhật:", errorObj?.response?.data || err);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-8 text-sm text-gray-600">
                Đang tải...
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-8">
                <div className="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-600">
                    {error ?? "Không thể tải dữ liệu"}
                </div>
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => router.push(`/products/${id}`)}
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                    >
                        ← Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
                <button
                    onClick={() => router.push(`/products/${id}`)}
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                    ← Quay lại
                </button>
            </div>

            <ProductForm defaultValues={data} onSubmit={handleUpdate} initialImages={initialImages} isEdit />
        </div>
    );
}