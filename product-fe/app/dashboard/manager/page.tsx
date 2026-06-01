"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createShop, getMyShops, getProducts } from "@/lib/api";

type ShopItem = {
    id?: string;
    _id?: string;
    shopName?: string;
    name?: string;
    description?: string;
};

type ProductItem = {
    id?: string;
    productName?: string;
    variants?: Array<{ stock?: number }>;
};

const shopSchema = z.object({
    shopName: z.string().min(3, "Tên shop phải có ít nhất 3 ký tự"),
    description: z.string().optional(),
});

type ShopForm = z.infer<typeof shopSchema>;

export default function ManagerDashboardPage() {
    const router = useRouter();
    const [shops, setShops] = useState<ShopItem[]>([]);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ShopForm>({
        resolver: zodResolver(shopSchema),
        defaultValues: {
            shopName: "",
            description: "",
        },
    });

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                setLoading(true);
                const [shopRes, productRes] = await Promise.all([getMyShops(), getProducts()]);
                if (!mounted) return;
                setShops(Array.isArray(shopRes) ? shopRes : []);
                setProducts(Array.isArray(productRes) ? productRes : []);
            } catch {
                if (!mounted) return;
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
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

    const totalShops = shops.length;
    const totalProducts = products.length;
    const totalVariants = products.reduce((sum, product) => sum + (product.variants?.length ?? 0), 0);
    const totalStock = products.reduce(
        (sum, product) =>
            sum +
            (product.variants?.reduce((variantSum, variant) => variantSum + (variant.stock ?? 0), 0) ?? 0),
        0
    );

    const normalizedShops = shops.map((shop) => ({
        id: shop.id ?? shop._id ?? "",
        name: shop.shopName ?? shop.name ?? "Shop chưa có tên",
        description: shop.description ?? "",
    }));

    const onCreateShop = async (data: ShopForm) => {
        setToast(null);
        try {
            await createShop({ shopName: data.shopName, description: data.description ?? "" });
            setToast({ type: "success", message: "Shop mới đã được tạo." });
            reset();
            const shopRes = await getMyShops();
            setShops(Array.isArray(shopRes) ? shopRes : []);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Không thể tạo shop.";
            setToast({ type: "error", message });
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-lg font-semibold text-slate-900">Xin chào, Manager!</p>
                        <p className="mt-1 text-sm text-slate-500">Quản lý shop của bạn và theo dõi hàng tồn kho.</p>
                    </div>
                </div>
            </div>

            {toast ? (
                <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
                        }`}
                >
                    {toast.message}
                </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Tổng shops</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-900">{totalShops}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Tổng sản phẩm</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-900">{totalProducts}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Tổng variants</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-900">{totalVariants}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Tổng stock</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-900">{totalStock}</p>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Shop của tôi</h2>
                            <p className="mt-1 text-sm text-slate-500">Danh sách shop liên kết với tài khoản của bạn.</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">Đang tải shop...</div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
                    ) : normalizedShops.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">Bạn chưa có shop nào.</div>
                    ) : (
                        <div className="space-y-4">
                            {normalizedShops.map((shop) => (
                                <div key={shop.id} className="rounded-3xl border border-slate-200 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-900">{shop.name}</p>
                                            <p className="mt-2 text-sm text-slate-500">{shop.description || "Chưa có mô tả."}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/products?shopId=${shop.id}`)}
                                            className="rounded-xl bg-[#1e3a6e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#173359]"
                                        >
                                            Xem sản phẩm
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-slate-900">Tạo shop mới</h2>
                        <p className="mt-1 text-sm text-slate-500">Thêm shop mới để bắt đầu quản lý sản phẩm.</p>
                    </div>
                    <form onSubmit={handleSubmit(onCreateShop)} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-800">Tên shop</label>
                            <input
                                {...register("shopName")}
                                className={`w-full rounded-md border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#1e3a6e] ${errors.shopName ? "border-red-400" : ""
                                    }`}
                                placeholder="Ví dụ: Shop ABC"
                            />
                            {errors.shopName ? <p className="mt-2 text-sm text-red-600">{errors.shopName.message}</p> : null}
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-800">Mô tả</label>
                            <textarea
                                {...register("description")}
                                className="h-28 w-full rounded-md border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#1e3a6e]"
                                placeholder="Mô tả ngắn cho shop"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center rounded-xl bg-[#1e3a6e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#173359]"
                        >
                            Tạo shop
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
