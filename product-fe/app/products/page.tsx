"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { api, getProducts } from "@/lib/api";

function readUserRole() {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { role?: string };
        return parsed?.role ?? null;
    } catch {
        return null;
    }
}


type ProductItem = {
    id?: string;
    productName?: string;
    basePrice?: number;
    shopId?: string;
    images?: Array<{ id?: number; url: string }>;
    variants?: Array<{ stock?: number }>;
};

type SortBy = "default" | "price_asc" | "price_desc";

function formatVnd(value: number) {
    return `${Math.round(value).toLocaleString("vi-VN")} ₫`;
}

const isAdminOrManager = (role: string | null) => role === "ADMIN" || role === "MANAGER";

async function handleDelete(id: string, setProducts: React.Dispatch<React.SetStateAction<ProductItem[]>>) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
        await api.delete("/products/" + id);
        setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
        alert("Xóa thất bại");
    }
}

export default function ProductsPage() {
    const router = useRouter();

    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortBy>("default");

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (!raw) return;
            const parsed = JSON.parse(raw) as { role?: string };
            setUserRole(parsed?.role ?? null);
        } catch {
            setUserRole(null);
        }
    }, []);


    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                const productRes = await getProducts();
                if (!mounted) return;
                setProducts(Array.isArray(productRes) ? (productRes as ProductItem[]) : []);
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

    const filteredAndSorted = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        const filtered = products.filter((product) => {
            const matchesSearch = !term || product.productName?.toLowerCase().includes(term);
            return matchesSearch;
        });

        if (sortBy === "price_asc") {
            return [...filtered].sort((a, b) => (a.basePrice ?? 0) - (b.basePrice ?? 0));
        }

        if (sortBy === "price_desc") {
            return [...filtered].sort((a, b) => (b.basePrice ?? 0) - (a.basePrice ?? 0));
        }

        return filtered;
    }, [products, searchTerm, sortBy]);

    const canCreate = userRole === "MANAGER" || userRole === "ADMIN";
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Search bar: sticky for regular users, static for admin/manager */}
            <div className={isAdminOrManager(userRole) ? "bg-white border-b mb-4" : "sticky top-0 z-10 bg-white border-b shadow-sm"}>
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-[#1e3a6e]"
                                placeholder="Tìm kiếm sản phẩm..."
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select
                                    title="Sắp xếp"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                                    className="rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-[#1e3a6e]"
                                >
                                    <option value="default">Mặc định</option>
                                    <option value="price_asc">Giá thấp  cao</option>
                                    <option value="price_desc">Giá cao  thấp</option>
                                </select>
                            </div>

                            {canCreate ? (
                                <button
                                    type="button"
                                    onClick={() => router.push("/products/new")}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#f97316] text-white px-4 py-2 text-sm font-bold hover:bg-[#f56a11]"
                                >
                                    <Plus className="h-4 w-4" />
                                    + Tạo sản phẩm mới
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4">
                <div className="max-w-6xl mx-auto">
                    {error ? (
                        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    ) : null}

                    {/* Loading skeleton */}
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="rounded-xl bg-white border border-gray-100 p-3 animate-pulse">
                                    <div className="h-44 rounded-lg bg-gray-200" />
                                    <div className="mt-3 h-4 w-4/5 rounded bg-gray-200" />
                                    <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />
                                    <div className="mt-3 h-5 w-1/2 rounded bg-gray-200" />
                                    <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />
                                </div>
                            ))}
                        </div>
                    ) : filteredAndSorted.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="text-5xl">🛍️</div>
                            <div className="mt-2 text-gray-600 font-semibold">Không tìm thấy sản phẩm nào</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {filteredAndSorted.map((product) => {
                                const id = product.id ?? "";
                                const basePrice = product.basePrice ?? 0;
                                const originalPrice = Math.round(basePrice * 1.15);
                                const discountPercent = 13;

                                // deterministic random seed from id
                                let seed = 0;
                                for (let i = 0; i < id.length; i++) seed += id.charCodeAt(i) * (i + 1);
                                const rating = 4.5 + (seed % 50) / 100;
                                const sold = 50 + (seed % 350);

                                const imgUrl = product.images?.[0]?.url;

                                const cardContent = (
                                    <>
                                        <div className="relative">
                                            {imgUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={imgUrl.startsWith("http") ? imgUrl : `${apiBase}${imgUrl}`}
                                                    alt={product.productName ?? "Sản phẩm"}
                                                    className="w-full h-44 rounded-lg object-cover bg-gradient-to-br from-gray-100 to-gray-200"
                                                />
                                            ) : (
                                                <div className="h-44 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200" />
                                            )}

                                            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs rounded px-1 py-0.5 font-bold">
                                                -{discountPercent}%
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <div className="text-sm font-medium text-gray-800 line-clamp-2">
                                                {product.productName ?? "Sản phẩm"}
                                            </div>

                                            <div className="mt-1 text-xs text-gray-500">⭐ {rating.toFixed(1)} | Đã bán {sold}</div>

                                            <div className="mt-2 flex items-baseline gap-2">
                                                <div className="text-lg font-black text-red-600">{formatVnd(basePrice)}</div>
                                                <div className="text-xs line-through text-gray-400">{formatVnd(originalPrice)}</div>
                                            </div>
                                        </div>
                                    </>
                                );

                                if (isAdminOrManager(userRole)) {
                                    return (
                                        <div
                                            key={product.id ?? product.productName}
                                            className="rounded-xl border border-gray-100 bg-white p-3"
                                        >
                                            {cardContent}
                                            <div className="mt-3 flex gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => router.push("/products/" + product.id)}
                                                    className="flex-1 rounded-md border border-blue-500 px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                                                >
                                                    Xem chi tiết
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => router.push("/products/" + product.id + "/edit")}
                                                    className="flex-1 rounded-md bg-[#1e3a6e] px-2 py-1.5 text-xs font-medium text-white hover:bg-[#173359]"
                                                >
                                                    Chỉnh sửa
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(product.id ?? "", setProducts)}
                                                    className="flex-1 rounded-md bg-red-500 px-2 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={product.id ?? product.productName}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => router.push(`/products/${product.id}`)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") router.push(`/products/${product.id}`);
                                        }}
                                        className="cursor-pointer rounded-xl border border-gray-100 bg-white p-3 hover:shadow-md hover:scale-[1.01] transition duration-200"
                                    >
                                        {cardContent}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

