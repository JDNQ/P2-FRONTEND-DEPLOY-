"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/api";

type ProductItem = {
    id?: string;
    productName?: string;
    basePrice?: number;
    variants?: Array<{ stock?: number }>;
};

export default function UserDashboardPage() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [username] = useState<string>(() => {
        if (typeof window === "undefined") return "Người dùng";
        const raw = localStorage.getItem("user");
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as { username?: string };
                if (parsed?.username) {
                    return parsed.username;
                }
            } catch {
                // ignore
            }
        }
        return "Người dùng";
    });

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
                setError("Không thể tải sản phẩm.");
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

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return products;
        return products.filter((product) =>
            product.productName?.toLowerCase().includes(term)
        );
    }, [products, search]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-lg font-semibold text-slate-900">Xin chào, {username}!</p>
                        <p className="mt-1 text-sm text-slate-500">Khám phá sản phẩm công khai và tìm kiếm theo tên.</p>
                    </div>
                    <div className="max-w-xs">
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#1e3a6e]"
                            placeholder="Tìm kiếm sản phẩm..."
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Đang tải sản phẩm...</div>
            ) : error ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
            ) : (
                <div className="grid gap-4 xl:grid-cols-3">
                    {filtered.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Không tìm thấy sản phẩm.</div>
                    ) : (
                        filtered.map((product) => {
                            const variantCount = product.variants?.length ?? 0;
                            const totalStock = product.variants?.reduce((sum, variant) => sum + (variant.stock ?? 0), 0) ?? 0;
                            return (
                                <div key={product.id ?? product.productName} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="mb-3">
                                        <p className="text-lg font-semibold text-slate-900">{product.productName ?? "Sản phẩm"}</p>
                                        <p className="mt-2 text-sm text-slate-500">Giá gốc: {product.basePrice ?? 0}</p>
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
                        })
                    )}
                </div>
            )}
        </div>
    );
}
