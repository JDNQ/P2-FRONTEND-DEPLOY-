"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/api";

type ProductItem = {
    id?: string;
    productName?: string;
    basePrice?: number;
    shopId?: string;
    variants?: Array<{ stock?: number }>;
};

export default function ProductsPage() {
    const router = useRouter();
    const [shopId] = useState<string | undefined>(() => {
        if (typeof window === "undefined") return undefined;
        const params = new URLSearchParams(window.location.search);
        return params.get("shopId") ?? undefined;
    });
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                setLoading(true);
                const productRes = await getProducts();
                if (!mounted) return;
                setProducts(Array.isArray(productRes) ? productRes : []);
            } catch {
                if (!mounted) return;
                setError("Không thể tải danh sách sản phẩm.");
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, []);

    const filteredProducts = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return products.filter((product) => {
            const matchesShop = !shopId || product.shopId === shopId;
            const matchesSearch = !term || product.productName?.toLowerCase().includes(term);
            return matchesShop && matchesSearch;
        });
    }, [products, searchTerm, shopId]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">Sản phẩm</h1>
                        <p className="mt-1 text-sm text-slate-500">Xem tất cả sản phẩm công khai trong hệ thống.</p>
                    </div>
                    <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="max-w-sm rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#1e3a6e]"
                        placeholder="Tìm theo tên sản phẩm..."
                    />
                </div>
            </div>

            {shopId ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                    Hiển thị sản phẩm của shop <span className="font-semibold">{shopId}</span>
                </div>
            ) : null}

            {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Đang tải sản phẩm...</div>
            ) : error ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
            ) : filteredProducts.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Không tìm thấy sản phẩm.</div>
            ) : (
                <div className="grid gap-4 xl:grid-cols-3">
                    {filteredProducts.map((product) => {
                        const variantCount = product.variants?.length ?? 0;
                        const totalStock = product.variants?.reduce((sum, variant) => sum + (variant.stock ?? 0), 0) ?? 0;
                        return (
                            <div key={product.id ?? product.productName} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-3">
                                    <p className="text-lg font-semibold text-slate-900">{product.productName ?? "Sản phẩm"}</p>
                                    <p className="mt-1 text-sm text-slate-500">Giá gốc: {product.basePrice ?? 0}</p>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <p>Số variants: {variantCount}</p>
                                    <p>Tổng stock: {totalStock}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => router.push(`/products/${product.id}`)}
                                    className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#1e3a6e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#173359]"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
