"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api, getProductById } from "@/lib/api";

type ProductDetail = {
    id: string;
    productName: string;
    description?: string;
    basePrice: number;
    createdAt?: string;
    variants: Array<{
        variantName: string;
        extraPrice: number;
        stock: number;
    }>;
};

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ProductDetail | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const product = (await getProductById(id)) as ProductDetail;
                if (!mounted) return;
                setData(product);
            } catch (e: unknown) {
                if (!mounted) return;
                const message = e instanceof Error ? e.message : "Không thể tải chi tiết";
                setError(message);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        const ok = window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?");
        if (!ok) return;

        await api.delete(`/products/${id}`);
        router.push("/");
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
                    {error ?? "Không tìm thấy sản phẩm"}
                </div>
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

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">{data.productName}</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Base price: <span className="font-semibold">{data.basePrice}</span>
                    </p>
                    {data.createdAt ? (
                        <p className="mt-1 text-xs text-gray-500">Ngày tạo: {new Date(data.createdAt).toLocaleString()}</p>
                    ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => router.push(`/products/${data.id}/edit`)}
                        className="rounded-md bg-[#533AB7] px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
                    >
                        Chỉnh sửa
                    </button>
                    <button
                        onClick={handleDelete}
                        className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                        Xoá
                    </button>
                </div>
            </div>

            {data.description ? (
                <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Description</div>
                    <p className="mt-2 whitespace-pre-wrap">{data.description}</p>
                </div>
            ) : null}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">Variants</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600">
                            <tr>
                                <th className="px-4 py-3">Variant name</th>
                                <th className="px-4 py-3">Extra price</th>
                                <th className="px-4 py-3">Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.variants?.map((v, idx) => (
                                <tr key={`${v.variantName}-${idx}`}>
                                    <td className="px-4 py-3 font-medium text-gray-900">{v.variantName}</td>
                                    <td className="px-4 py-3">{v.extraPrice}</td>
                                    <td className="px-4 py-3">{v.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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

