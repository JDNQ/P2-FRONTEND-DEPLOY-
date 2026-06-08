"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCart, applyVoucher, createOrder } from "@/lib/api";

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

function CheckoutPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const voucherCodeFromUrl = searchParams.get("voucherCode") || "";

    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [note, setNote] = useState("");
    const voucherCode = voucherCodeFromUrl;
    const [discountAmount, setDiscountAmount] = useState(0);
    const [voucherError, setVoucherError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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
        const t = window.setTimeout(() => loadCart(), 0)
        return () => window.clearTimeout(t)
    }, [loadCart]);


    const orderTotal = items.reduce((sum, item) => {
        const unitPrice = (item.product.basePrice ?? 0) + (item.variant.extraPrice ?? 0);
        return sum + unitPrice * item.quantity;
    }, 0);

    useEffect(() => {
        if (items.length > 0 && voucherCodeFromUrl) {
            (async () => {
                    try {
                        const res = await applyVoucher({ code: voucherCodeFromUrl, orderTotal });
                        const data = res as { discountAmount: number };
                        setDiscountAmount(data.discountAmount ?? 0);
                    } catch {
                        setVoucherError("Không thể áp dụng mã giảm giá");
                    }
            })();
        }
    }, [items.length, voucherCodeFromUrl, orderTotal]);

    const subtotal = orderTotal;

    const formatVND = (value: number) => `${Math.round(value).toLocaleString("vi-VN")} ₫`;

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        try {
            await createOrder({
                items: items.map((item) => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                })),
                voucherCode: voucherCode || undefined,
                note: note || undefined,
            });
            setSuccess(true);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Đặt hàng thất bại";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 py-6">Đang tải thông tin đơn hàng...</div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
                    <div className="text-8xl mb-6">✅</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h2>
                    <p className="text-gray-500 mb-8">Cảm ơn bạn đã mua hàng tại TL Market</p>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/orders")}
                            className="bg-[#1e3a6e] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#0f2f63] transition"
                        >
                            Xem đơn hàng của tôi
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/products")}
                            className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
                    <div className="text-8xl mb-6">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Giỏ hàng trống</h2>
                    <p className="text-gray-500 mb-6">Không có sản phẩm nào để thanh toán.</p>
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
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-4">
                    <span className="cursor-pointer hover:text-gray-700" onClick={() => router.push("/")}>Trang chủ</span>
                    <span className="px-2">{">"}</span>
                    <span className="cursor-pointer hover:text-gray-700" onClick={() => router.push("/cart")}>Giỏ hàng</span>
                    <span className="px-2">{">"}</span>
                    <span className="text-gray-800">Thanh toán</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-6">Xác nhận đơn hàng</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left - Order info */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 text-lg mb-4">Sản phẩm đặt mua</h3>
                            <div className="space-y-3">
                                {items.map((item) => {
                                    const unitPrice = (item.product.basePrice ?? 0) + (item.variant.extraPrice ?? 0);
                                    return (
                                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 text-sm">{item.product.productName}</p>
                                                <p className="text-xs text-gray-500">{item.variant.variantName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">x{item.quantity}</p>
                                                <p className="text-sm font-semibold text-red-600">{formatVND(unitPrice * item.quantity)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t my-4" />

                            {/* Note */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-2">Ghi chú cho đơn hàng</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Ghi chú cho đơn hàng..."
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right - Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
                            <h3 className="font-bold text-gray-900 text-lg mb-4">Tóm tắt đơn hàng</h3>

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

                            {voucherCode && (
                                <div className="mt-3">
                                    <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-2xl">
                                        Mã: {voucherCode} - Giảm {formatVND(discountAmount)}
                                    </span>
                                </div>
                            )}
                            {voucherError && (
                                <p className="text-red-500 text-xs mt-2">{voucherError}</p>
                            )}

                            <div className="border-t my-3" />

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-900 font-bold">Tổng cộng</span>
                                <span className="text-xl font-black text-red-600">{formatVND(subtotal - discountAmount)}</span>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm mb-3">{error}</p>
                            )}

                            <button
                                type="button"
                                disabled={submitting}
                                onClick={handleSubmit}
                                className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold hover:bg-orange-600 transition disabled:opacity-50"
                            >
                                {submitting ? "Đang xử lý..." : "Đặt hàng ngay"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 py-6">Đang tải...</div>
            </div>
        }>
            <CheckoutPageInner />
        </Suspense>
    );
}