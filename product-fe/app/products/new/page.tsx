"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct, getShops } from "@/lib/api";
import { ProductForm } from "@/components/ProductForm";
import type { ProductSubmitPayload } from "@/components/ProductForm";

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shops, setShops] = useState<Array<{ id: number; shopName: string }>>([]);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const shopList = await getShops();
                setShops(Array.isArray(shopList) ? shopList : []);
            } catch (err) {
                console.error("Không lấy được danh sách shop", err);
            }
        };
        fetchShops();
    }, []);

    const handleCreate = async (payload: ProductSubmitPayload) => {
        setLoading(true);
        setError(null);

        try {
            console.log("📤 Gửi create payload:", payload);
            await createProduct(payload);

            alert("✅ Tạo sản phẩm thành công!");
            router.push("/products");
        } catch (err: unknown) {
            const errorObj = err as Error & { response?: { data?: { message?: string } } };
            const message = errorObj?.response?.data?.message ||
                errorObj?.message ||
                "Tạo sản phẩm thất bại";

            setError(message);
            console.error("❌ Lỗi tạo sản phẩm:", errorObj?.response?.data || err);
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tạo sản phẩm mới</h1>
                    <p className="mt-1 text-slate-600">Điền đầy đủ thông tin sản phẩm và các biến thể</p>
                </div>
                <button
                    onClick={() => router.push("/products")}
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                    ← Quay lại danh sách
                </button>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                    <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-slate-600">Đang tạo sản phẩm...</p>
                    </div>
                </div>
            ) : (
                <ProductForm onSubmit={handleCreate} shops={shops} />
            )}
        </div>
    );
}