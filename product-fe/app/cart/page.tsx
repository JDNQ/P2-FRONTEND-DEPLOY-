"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, removeCartItem, updateCartItem, applyVoucher } from "@/lib/api";

type CartItem = {
    id: number;
    productId: number;
    variantId: number;
    quantity: number;
    product: {
        productName: string;
        basePrice: number;
        images: { url: string }[];
    };
    variant: {
        variantName: string;
        extraPrice: number;
        stock: number;
    };
};

export default function CartPage() {
    const router = useRouter();

    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [voucherInput, setVoucherInput] = useState("");
    const [voucherCode, setVoucherCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [voucherError, setVoucherError] = useState<string | null>(null);
    const [voucherLoading, setVoucherLoading] = useState(false);

    const loadCart = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getCart();
            const cartItems = Array.isArray(res) ? (res as CartItem[]) : ((res as Record<string, unknown>)?.items as CartItem[] ?? []);
            setItems(cartItems);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Không thể tải giỏ hàng";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Defer to avoid react-hooks/set-state-in-effect lint issues
        const t = window.setTimeout(() => {
            loadCart()
        }, 0)
        return () => window.clearTimeout(t)
    }, [loadCart]);


    const subtotal = items.reduce((sum, item) => {
        const unitPrice = (item.product.basePrice ?? 0) + (item.variant.extraPrice ?? 0);
        return sum + unitPrice * item.quantity;
    }, 0);

    const formatVND = (value: number) => `${Math.round(value).toLocaleString("vi-VN")} ₫`;

    const handleQuantityChange = async (item: CartItem, newQty: number) => {
        if (newQty < 1 || newQty > item.variant.stock) return;
        setUpdatingId(item.id);
        try {
            await updateCartItem(item.id, { quantity: newQty });
            await loadCart();
        } catch {
            // ignore
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemove = async (itemId: number) => {
        setUpdatingId(itemId);
        try {
            await removeCartItem(itemId);
            await loadCart();
        } catch {
            // ignore
        } finally {
            setUpdatingId(null);
        }
    };

    const handleApplyVoucher = async () => {
        if (!voucherInput.trim()) return;
        setVoucherLoading(true);
        setVoucherError(null);
        try {
            const res = await applyVoucher({ code: voucherInput.trim(), orderTotal: subtotal });
            const data = res as { discountAmount: number; code: string };
            setDiscountAmount(data.discountAmount ?? 0);
            setVoucherCode(data.code ?? voucherInput.trim());
            setVoucherInput("");
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Mã giảm giá không hợp lệ";
            setVoucherError(message);
        } finally {
            setVoucherLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto px-4 py-6">Đang tải giỏ hàng...</div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto px-4 pt-6">
                    <div className="text-sm text-gray-500 mb-4">
                        <span className="cursor-pointer hover:text-gray-700" onClick={() => router.push("/")}>Trang chủ</span>
                        <span className="px-2">{">"}</span>
                        <span className="text-gray-800">Giỏ hàng</span>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
                    <div className="text-8xl mb-6">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Giỏ hàng trống</h2>
                    <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để mua sắm nhé!</p>
                    <button
                        type="button"
                        onClick={() => router.push("/products")}
                        className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition"
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="max-w-5xl mx-auto px-4 pt-6">
                <div className="text-sm text-gray-500 mb-2">
                    <span className="cursor-pointer hover:text-gray-700" onClick={() => router.push("/")}>Trang chủ</span>
                    <span className="px-2">{">"}</span>
                    <span className="text-gray-800">Giỏ hàng</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng ({items.length} sản phẩm)</h1>
            </div>

            {error && (
                <div className="max-w-5xl mx-auto px-4 mb-4">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left - product list */}
                <div className="md:col-span-2 space-y-3">
                    {items.map((item) => {
                        const unitPrice = (item.product.basePrice ?? 0) + (item.variant.extraPrice ?? 0);
                        return (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4">
                                <div className="flex items-center gap-4">
                                    {/* Image */}
                                    <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                                        {item.product.images && item.product.images.length > 0 ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={item.product.images[0].url}
                                                alt={item.product.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 text-sm truncate">{item.product.productName}</p>
                                        <p className="text-xs text-gray-500 mt-1">{item.variant.variantName}</p>
                                        <p className="text-red-600 font-bold text-sm mt-1">{formatVND(unitPrice)}</p>
                                    </div>

                                    {/* Quantity control */}
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-1 border border-gray-200 rounded-xl">
                                            <button
                                                type="button"
                                                disabled={updatingId === item.id || item.quantity <= 1}
                                                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-l-xl"
                                            >
                                                −
                                            </button>
                                            <div className="min-w-8 text-center text-sm font-semibold text-gray-900">
                                                {updatingId === item.id ? "..." : item.quantity}
                                            </div>
                                            <button
                                                type="button"
                                                disabled={updatingId === item.id || item.quantity >= item.variant.stock}
                                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-r-xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={updatingId === item.id}
                                            onClick={() => handleRemove(item.id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right - Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
                        <h3 className="font-bold text-gray-900 text-lg mb-4">Tóm tắt đơn hàng</h3>

                        {/* Voucher */}
                        <div className="mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={voucherInput}
                                    onChange={(e) => setVoucherInput(e.target.value)}
                                    placeholder="Nhập mã giảm giá"
                                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500"
                                />
                                <button
                                    type="button"
                                    disabled={voucherLoading || !voucherInput.trim()}
                                    onClick={handleApplyVoucher}
                                    className="bg-[#1e3a6e] text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-[#0f2f63] transition"
                                >
                                    {voucherLoading ? "..." : "Áp dụng"}
                                </button>
                            </div>
                            {voucherCode && (
                                <p className="text-green-600 text-sm mt-2 font-medium">Giảm: -{formatVND(discountAmount)}</p>
                            )}
                            {voucherError && (
                                <p className="text-red-500 text-sm mt-2">{voucherError}</p>
                            )}
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tạm tính</span>
                                <span className="font-semibold text-gray-900">{formatVND(subtotal)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giảm giá</span>
                                    <span className="font-semibold text-green-600">-{formatVND(discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phí ship</span>
                                <span className="font-semibold text-green-600">Miễn phí</span>
                            </div>
                        </div>

                        <div className="border-t my-3" />

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-900 font-bold">Tổng cộng</span>
                            <span className="text-xl font-black text-red-600">{formatVND(subtotal - discountAmount)}</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                const url = voucherCode ? `/checkout?voucherCode=${encodeURIComponent(voucherCode)}` : "/checkout";
                                router.push(url);
                            }}
                            className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold hover:bg-orange-600 transition"
                        >
                            Tiến hành thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}