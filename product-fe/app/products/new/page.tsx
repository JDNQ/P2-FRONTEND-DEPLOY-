"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
            alert("Tạo sản phẩm thành công!");
            router.push("/products");   // Quay về danh sách sản phẩm
        } catch (error) {
            alert("Tạo sản phẩm thất bại. Vui lòng thử lại.");
            console.error(error);
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
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                    ← Quay lại danh sách
                </button>
            </div>

            {loading ? (
                <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                    <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-slate-600">Đang tạo sản phẩm...</p>
                    </div>
                </div>
            ) : (
                <ProductForm onSubmit={handleCreate} />
            )}
        </div>
    );
}