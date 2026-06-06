"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyOrders } from "@/lib/api";

type OrderItem = {
    productName: string;
    variantName: string;
    quantity: number;
    price: number;
};

type Order = {
    id: number;
    status: string;
    totalPrice: number;
    discountAmount: number;
    voucherCode?: string;
    note?: string;
    createdAt: string;
    items: OrderItem[];
};

const statusBadge: Record<string, { label: string; className: string }> = {
    PENDING: { label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-700" },
    SHIPPING: { label: "Đang giao", className: "bg-purple-100 text-purple-700" },
    DELIVERED: { label: "Đã giao", className: "bg-green-100 text-green-700" },
    CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-700" },
};

function getStatusBadge(status: string) {
    return statusBadge[status] ?? { label: status, className: "bg-gray-100 text-gray-700" };
}

export default function OrdersPage() {
    const router = useRouter();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getMyOrders();
                if (!mounted) return;
                const list = Array.isArray(data) ? (data as Order[]) : [];
                setOrders(list);
            } catch {
                if (!mounted) return;
                setOrders([]);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const formatVND = (value: number) => `${Math.round(value).toLocaleString("vi-VN")} ₫`;

    // Loading skeleton
    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="text-sm text-gray-500 mb-4">Trang chủ {">"} Đơn hàng của tôi</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h1>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm p-5 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="text-sm text-gray-500 mb-4">
                        <span className="cursor-pointer hover:text-gray-700" onClick={() => router.push("/")}>Trang chủ</span>
                        <span className="px-2">{">"}</span>
                        <span className="text-gray-800">Đơn hàng của tôi</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h1>
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="text-8xl mb-6">📦</div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">Bạn chưa có đơn hàng nào</h2>
                        <p className="text-gray-500 mb-6">Hãy mua sắm ngay để có đơn hàng đầu tiên!</p>
                        <button
                            type="button"
                            onClick={() => router.push("/products")}
                            className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
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
                    <span className="text-gray-800">Đơn hàng của tôi</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h1>

                {/* Orders list */}
                <div className="space-y-3">
                    {orders.map((order) => {
                        const badge = getStatusBadge(order.status);
                        const displayItems = order.items.slice(0, 2);
                        const remainingCount = order.items.length - 2;

                        return (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5">
                                {/* Top row */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-gray-900">Đơn #{order.id}</span>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge.className}`}>
                                        {badge.label}
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="text-xs text-gray-500 mb-2">
                                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                </div>

                                {/* Items preview */}
                                <div className="text-sm text-gray-700 mb-2">
                                    {displayItems.map((item, idx) => (
                                        <div key={idx} className="truncate">
                                            {item.productName} x{item.quantity}
                                        </div>
                                    ))}
                                    {remainingCount > 0 && (
                                        <div className="text-gray-400">+{remainingCount} sản phẩm khác</div>
                                    )}
                                </div>

                                {/* Voucher badge */}
                                {order.voucherCode && (
                                    <div className="mb-2">
                                        <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-2xl">
                                            Đã dùng mã: {order.voucherCode}
                                        </span>
                                    </div>
                                )}

                                {/* Bottom row */}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                    <span className="text-red-600 font-bold text-lg">{formatVND(order.totalPrice)}</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedOrder(order)}
                                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-2xl text-sm font-semibold hover:bg-gray-50 transition"
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal chi tiết */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 mt-20 relative max-h-[80vh] overflow-y-auto">
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                        >
                            &times;
                        </button>

                        <h3 className="font-bold text-gray-900 text-lg mb-4">Chi tiết đơn hàng #{selectedOrder.id}</h3>

                        {/* Items */}
                        <div className="space-y-2 mb-4">
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                                        <p className="text-xs text-gray-500">{item.variantName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                                        <p className="text-sm font-semibold text-red-600">{formatVND(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Note */}
                        {selectedOrder.note && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                                <span className="font-semibold">Ghi chú:</span> {selectedOrder.note}
                            </div>
                        )}

                        {/* Summary */}
                        <div className="border-t pt-3 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tạm tính</span>
                                <span className="font-semibold">{formatVND(selectedOrder.totalPrice + (selectedOrder.discountAmount || 0))}</span>
                            </div>
                            {selectedOrder.discountAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giảm giá</span>
                                    <span className="font-semibold text-green-600">-{formatVND(selectedOrder.discountAmount)}</span>
                                </div>
                            )}
                            <div className="border-t pt-2 flex justify-between">
                                <span className="font-bold text-gray-900">Tổng cộng</span>
                                <span className="font-bold text-red-600 text-lg">{formatVND(selectedOrder.totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}