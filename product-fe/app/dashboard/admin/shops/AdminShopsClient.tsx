"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    Calendar,
    Inbox,
    Search,
    Store,
} from "lucide-react";
import { getShops } from "@/lib/api";

type ShopRow = {
    id?: string;
    _id?: string;
    shopName?: string;
    name?: string;
    description?: string;
    ownerId?: string;
    createdAt?: string;
};

export default function AdminShopsClient() {
    const [shops, setShops] = useState<ShopRow[]>([]);
    const [filteredShops, setFilteredShops] = useState<ShopRow[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filterShops = useCallback((shopList: ShopRow[], search: string) => {
        if (!search.trim()) {
            setFilteredShops(shopList);
            return;
        }
        const lowerSearch = search.toLowerCase();
        setFilteredShops(
            shopList.filter((shop) =>
                (shop.shopName?.toLowerCase().includes(lowerSearch) ||
                    shop.name?.toLowerCase().includes(lowerSearch)) ?? false
            )
        );
    }, []);

    const loadShops = useCallback(async () => {
        try {
            setLoading(true);
            const shopsRes = await getShops();
            const shopsList = Array.isArray(shopsRes) ? shopsRes : [];
            setShops(shopsList);
        } catch {
            setError("Không thể tải dữ liệu shops từ server.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadShops();
    }, [loadShops]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        filterShops(shops, searchTerm);
    }, [searchTerm, shops, filterShops]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const totalShops = shops.length;

    const shopRecords = filteredShops.map((row) => ({
        id: row.id ?? row._id ?? "",
        shopName: row.shopName ?? row.name ?? "-",
        description: row.description ?? "-",
        ownerId: row.ownerId ?? "-",
        createdAt: row.createdAt ?? "-",
    }));

    const truncateDescription = (desc: string, length: number = 50) => {
        if (desc === "-" || !desc) return desc;
        return desc.length > length ? desc.slice(0, length) + "..." : desc;
    };

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === "-") return "-";
        try {
            return new Date(dateString).toLocaleDateString("vi-VN");
        } catch {
            return "-";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 shadow-lg">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
                                <Store className="h-3.5 w-3.5 text-emerald-300" />
                                Shop Management
                            </div>
                            <h1 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                                Quản lý Shops
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-300">
                                Danh sách các cửa hàng trên hệ thống.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-1">
                    <div className="group rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                                <Store className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="mt-5 text-sm font-medium text-slate-500">Tổng shops</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-950">{totalShops}</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-950">Danh sách shops</h2>
                            <p className="mt-1 text-sm font-medium text-slate-500">Toàn bộ shops có trên hệ thống.</p>
                        </div>
                        <div className="relative w-full lg:max-w-sm">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                                placeholder="Tìm kiếm shop..."
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                            {[0, 1, 2, 3].map((item) => (
                                <div key={item} className="flex animate-pulse items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-36 rounded-full bg-slate-200" />
                                        <div className="h-3 w-56 max-w-full rounded-full bg-slate-100" />
                                    </div>
                                    <div className="hidden h-8 w-20 rounded-full bg-slate-100 sm:block" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                            <AlertCircle className="h-5 w-5" />
                            {error}
                        </div>
                    ) : shopRecords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-14 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <Inbox className="h-7 w-7" />
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900">Chưa có shop nào</h3>
                            <p className="mt-1 text-sm font-medium text-slate-500">Không tìm thấy shop phù hợp.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-slate-900 text-slate-200">
                                        <tr>
                                            <th className="px-5 py-4 font-semibold">Shop Name</th>
                                            <th className="px-5 py-4 font-semibold">Description</th>
                                            <th className="px-5 py-4 font-semibold">Owner ID</th>
                                            <th className="px-5 py-4 font-semibold">Created Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {shopRecords.map((row) => (
                                            <tr key={row.id} className="transition hover:bg-slate-50">
                                                <td className="px-5 py-4 font-semibold text-slate-950">{row.shopName}</td>
                                                <td className="px-5 py-4 text-slate-600">
                                                    <div title={row.description}>{truncateDescription(row.description)}</div>
                                                </td>
                                                <td className="px-5 py-4 font-medium text-slate-600">{row.ownerId}</td>
                                                <td className="px-5 py-4 font-medium text-slate-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-slate-400" />
                                                        {formatDate(row.createdAt)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
