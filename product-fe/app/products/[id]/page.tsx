"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, getProductById, addToCart } from "@/lib/api";

type ProductDetail = {
    id: string;
    productName: string;
    description?: string;
    basePrice: number;
    createdAt?: string;
    images?: Array<{ id: number; url: string; isPrimary: boolean }>;
    variants: Array<{
        id: number;
        variantName: string;
        extraPrice: number;
        stock: number;
        image?: string;
    }>;
};

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ProductDetail | null>(null);

    const [activeImg, setActiveImg] = useState(0);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const parsed = JSON.parse(raw);
                setUserRole(parsed?.role ?? null);
            } else {
                setUserRole(null);
            }
        } catch {
            setUserRole(null);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                const product = (await getProductById(id)) as ProductDetail;
                if (!mounted) return;
                setData(product);
                setActiveImg(0);
                setSelectedVariant(0);
                setQuantity(1);
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

    const handleAddToCart = async (): Promise<boolean> => {
        const tokenExists = typeof document !== "undefined" && document.cookie.includes("token=");
        if (!tokenExists) {
            router.push("/login");
            return false;
        }
        if (!data?.variants?.[selectedVariant]) return false;
        setAddingToCart(true);
        try {
            await addToCart({
                productId: Number(data.id),
                variantId: data.variants[selectedVariant].id as number,
                quantity,
            });
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
            return true;
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Không thể thêm vào giỏ hàng";
            alert(message);
            return false;
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        const ok = await handleAddToCart();
        if (ok) {
            router.push("/cart");
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        const ok = window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?");
        if (!ok) return;

        await api.delete(`/products/${id}`);
        router.push("/products");
    };

    if (loading) {
        return <div className="mx-auto w-full max-w-4xl px-4 py-8 text-sm text-gray-600">Đang tải...</div>;
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
                        onClick={() => router.push("/products")}
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                    >
                        ← Quay lại
                    </button>
                </div>
            </div>
        );
    }

    const currentVariant = data?.variants?.[selectedVariant];
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
    const getUrl = (url?: string) => !url ? null : url.startsWith("http") ? url : `${apiBase}${url}`;
    const primaryImg = data.images?.find(i => i.isPrimary)?.url ?? data.images?.[0]?.url;
    const variantImg = currentVariant?.image ?? null;
    const displayImg = getUrl(variantImg ?? data.images?.[activeImg]?.url ?? primaryImg ?? "");
    const allThumbs = [
        ...(data.images ?? []).map(i => ({ url: i.url, id: String(i.id) })),
        ...(data.variants ?? []).filter(v => v.image).map((v, idx) => ({ url: v.image!, id: `v-${idx}` }))
    ];
    const salePrice = (data?.basePrice ?? 0) + (currentVariant?.extraPrice ?? 0);
    const originalPrice = Math.round(salePrice * 1.2);
    const discountPercent = Math.round(((originalPrice - salePrice) / Math.max(1, originalPrice)) * 100);
    const stock = currentVariant?.stock ?? 0;

    // deterministic from id
    let seed = 0;
    const pid = data?.id ?? "";
    for (let i = 0; i < pid.length; i++) seed += pid.charCodeAt(i) * (i + 1);
    const rating = 4.8 + ((seed % 20) / 100);
    const sold = 100 + (seed % 250);

    const formatVnd = (value: number) => `${Math.round(value).toLocaleString("vi-VN")} ₫`;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 1. Breadcrumb */}
            <div className="max-w-6xl mx-auto px-4 pt-4">
                <div className="text-sm text-gray-500">
                    <span className="hover:text-gray-700 cursor-pointer" onClick={() => router.push("/")}>Trang chủ</span>
                    <span className="px-2">{'>'}</span>
                    <span className="hover:text-gray-700 cursor-pointer" onClick={() => router.push("/products")}>Sản phẩm</span>
                    <span className="px-2">{'>'}</span>
                    <span className="truncate text-gray-800">{data.productName}</span>
                </div>
            </div>

            {/* 2. Main content */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* CỘT TRÁI - Ảnh */}
                        <div>
                            <div className="h-80 md:h-96 rounded-xl overflow-hidden bg-gray-100">
                                {data.images && data.images.length > 0 ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={displayImg ?? ""}
                                        alt={data.productName}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <div className="text-gray-400 text-3xl">🖼️</div>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail strip */}
                            {allThumbs.length > 1 ? (
                                <div className="flex gap-2 overflow-x-auto mt-3">
                                    {allThumbs.map((thumb, idx) => (
                                        <button
                                            key={thumb.id}
                                            type="button"
                                            onClick={() => setActiveImg(idx)}
                                            className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition ${idx === activeImg ? "border-orange-500" : "border-gray-200"
                                                }`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={getUrl(thumb.url) ?? ""}
                                                alt={`Ảnh ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        {/* CỘT PHẢI - Thông tin */}
                        <div>
                            <div className="text-2xl font-black text-gray-900">{data.productName}</div>

                            <div className="mt-2 text-sm text-gray-500">
                                ⭐ {rating.toFixed(1)} | Đã bán {sold}
                            </div>

                            <div className="my-4 border-t border-gray-200" />

                            <div>
                                <div className="text-3xl font-black text-red-600">{formatVnd(salePrice)}</div>
                                <div className="text-sm line-through text-gray-400">{formatVnd(originalPrice)}</div>

                                <div className="mt-2 inline-flex bg-red-500 text-white rounded px-2 py-0.5 text-xs font-bold">
                                    -{discountPercent >= 0 ? discountPercent : 0}%
                                </div>
                            </div>

                            <div className="my-4 border-t border-gray-200" />

                            {/* Chọn phân loại */}
                            {data.variants && data.variants.length > 0 ? (
                                <>
                                    <div className="text-sm font-semibold text-gray-700">Phân loại:</div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {data.variants.map((v, idx) => {
                                            const disabled = stock === 0 ? (v.stock ?? 0) === 0 : (v.stock ?? 0) === 0;
                                            const active = idx === selectedVariant;
                                            const isDisabled = (v.stock ?? 0) === 0;

                                            return (
                                                <button
                                                    key={`${v.variantName}-${idx}`}
                                                    type="button"
                                                    disabled={isDisabled}
                                                    onClick={() => {
                                                        setSelectedVariant(idx);
                                                        setQuantity(1);
                                                        if (v.image) {
                                                            const variantThumbIdx = (data.images?.length ?? 0) + idx;
                                                            setActiveImg(variantThumbIdx);
                                                        } else {
                                                            setActiveImg(0);
                                                        }
                                                    }}
                                                    className={`border rounded-xl px-4 py-2 text-sm font-medium transition ${isDisabled
                                                        ? "opacity-50 cursor-not-allowed border-gray-200"
                                                        : active
                                                            ? "border-orange-500 bg-orange-50 text-orange-600"
                                                            : "border-gray-200 text-gray-700 hover:border-gray-400"
                                                        }`}
                                                >
                                                    {v.variantName}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="my-4 border-t border-gray-200" />
                                </>
                            ) : null}

                            {/* Số lượng */}
                            {data.variants && data.variants.length > 0 ? (
                                <>
                                    <div className="text-sm font-semibold text-gray-700">Số lượng:</div>
                                    <div className="mt-2 flex items-center gap-3">
                                        <button
                                            type="button"
                                            disabled={quantity <= 1}
                                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            −
                                        </button>
                                        <div className="min-w-10 text-center text-sm font-semibold text-gray-900">{quantity}</div>
                                        <button
                                            type="button"
                                            disabled={quantity >= stock}
                                            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                                            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            +
                                        </button>

                                        <div className="text-xs text-gray-500">Còn {stock} sản phẩm</div>
                                    </div>

                                    <div className="my-4 border-t border-gray-200" />
                                </>
                            ) : null}

                            {/* Actions */}
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    type="button"
                                    disabled={addingToCart}
                                    onClick={handleAddToCart}
                                    className="w-full border-2 border-orange-500 text-orange-600 bg-orange-50 hover:bg-orange-100 py-3 rounded-2xl font-bold disabled:opacity-50"
                                >
                                    {addingToCart ? "Đang thêm..." : addedToCart ? "✓ Đã thêm!" : "🛒 Thêm vào giỏ hàng"}
                                </button>
                                <button
                                    type="button"
                                    disabled={addingToCart}
                                    onClick={handleBuyNow}
                                    className="w-full bg-orange-500 text-white hover:bg-orange-600 py-3 rounded-2xl font-bold disabled:opacity-50"
                                >
                                    ⚡ Mua ngay
                                </button>
                            </div>

                            {/* Admin controls */}
                            {userRole !== "USER" && userRole !== null ? (
                                <div className="mt-3 flex items-center gap-4 text-sm">
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/products/${data.id}/edit`)}
                                        className="text-gray-700 hover:text-gray-900 underline decoration-gray-300 hover:decoration-gray-500"
                                    >
                                        [Chỉnh sửa]
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="text-gray-700 hover:text-red-600 underline decoration-gray-300 hover:decoration-red-300"
                                    >
                                        [Xoá]
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* 3. Mô tả */}
                    <div className="mt-4 bg-white rounded-2xl shadow-sm p-6">
                        <div className="font-black text-gray-900 border-b pb-3">MÔ TẢ SẢN PHẨM</div>
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mt-3">
                            {data.description || "Chưa có mô tả cho sản phẩm này."}
                        </div>
                    </div>

                    {/* 4. Quay lại */}
                    <button
                        type="button"
                        onClick={() => router.push("/products")}
                        className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mt-4"
                    >
                        ← Quay lại danh sách
                    </button>
                </div>
            </div>
        </div>
    );
}

