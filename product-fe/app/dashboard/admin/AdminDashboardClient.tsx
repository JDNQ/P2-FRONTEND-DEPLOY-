"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    AlertCircle, CheckCircle2, Inbox, Layers, Lock, Mail,
    Package, Plus, Search, Shield, Store, Trash2,
    TrendingUp, UserPlus, Users, X,
} from "lucide-react";
import { createManager, deleteUser, getProducts, getShops, getUsers } from "@/lib/api";
import { useTranslations } from "@/lib/useTranslations";

type UserRow = { id?: string; _id?: string; username?: string; email?: string; role?: string };
type ProductSummary = { id?: string; productName?: string; basePrice?: number; variants?: Array<{ variantName?: string; extraPrice?: number; stock?: number }> };
type ShopSummary = { id?: string; _id?: string; shopName?: string; name?: string; description?: string; ownerId?: string | number; createdAt?: string };

const createManagerSchema = z.object({
    username: z.string().min(6, "Username phải có ít nhất 6 ký tự"),
    password: z.string().min(6, "Password phải có ít nhất 6 ký tự"),
    email: z.string().trim().optional().refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: "Email không hợp lệ" }),
});
type CreateManagerForm = z.infer<typeof createManagerSchema>;

type ActiveTab = "users" | "shops" | "products" | "variants";

const getRoleStyles = (role: string) => {
    const r = role.toUpperCase();
    if (r === "ADMIN") return { avatar: "from-red-500 to-rose-600", badge: "border-red-200 bg-red-50 text-red-700" };
    if (r === "MANAGER") return { avatar: "from-blue-500 to-indigo-600", badge: "border-blue-200 bg-blue-50 text-blue-700" };
    return { avatar: "from-slate-500 to-slate-700", badge: "border-slate-200 bg-slate-100 text-slate-700" };
};

const getInitials = (name: string) => {
    if (!name || name === "-") return "U";
    return name.split(" ").map((p) => p.charAt(0)).join("").slice(0, 2).toUpperCase();
};

const formatVND = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export default function AdminDashboardClient() {
    const t = useTranslations("admin");

    const [users, setUsers] = useState<UserRow[]>([]);
    const [products, setProducts] = useState<ProductSummary[]>([]);
    const [shops, setShops] = useState<ShopSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<ActiveTab>("users");

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateManagerForm>({
        resolver: zodResolver(createManagerSchema),
        defaultValues: { username: "", password: "", email: "" },
    });

    const inputBase = "peer w-full rounded-2xl border border-slate-200 bg-white/90 px-12 pb-3 pt-6 text-sm font-medium text-slate-900 outline-none shadow-sm transition placeholder:text-transparent";
    const inputFocus = "focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)]";
    const inputError = "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]";

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [usersRes, productsRes, shopsRes] = await Promise.all([getUsers(), getProducts(), getShops()]);
                setUsers(Array.isArray(usersRes) ? usersRes : []);
                setProducts(Array.isArray(productsRes) ? productsRes : []);
                setShops(Array.isArray(shopsRes) ? shopsRes : []);
            } catch (err) {
                console.error("Load error:", err);
                setError("Không thể tải dữ liệu từ server.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!toast) return;
        const timer = window.setTimeout(() => setToast(null), 3000);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const totalVariants = products.reduce((c, p) => c + (p.variants?.length ?? 0), 0);
    const totalUsers = users.length;
    const totalShops = shops.length;
    const totalProducts = products.length;

    const userRecords = users
        .map((r) => ({ id: r.id ?? r._id ?? "", username: r.username ?? "-", email: r.email ?? "-", role: r.role ?? "-" }))
        .filter((r) => {
            if (!search.trim()) return true;
            const term = search.toLowerCase();
            return r.username.toLowerCase().includes(term) || r.email.toLowerCase().includes(term);
        });

    const shopRecords = shops
        .map((s) => ({ id: s.id ?? s._id ?? "", shopName: s.shopName ?? s.name ?? "-", description: s.description ?? "-", ownerId: String(s.ownerId ?? "-"), createdAt: s.createdAt ?? "" }))
        .filter((s) => !search.trim() || s.shopName.toLowerCase().includes(search.toLowerCase()));

    const productRecords = products
        .map((p) => ({
            id: p.id ?? "",
            productName: p.productName ?? "-",
            basePrice: p.basePrice ?? 0,
            variantCount: p.variants?.length ?? 0,
            totalStock: p.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? 0,
        }))
        .filter((p) => !search.trim() || p.productName.toLowerCase().includes(search.toLowerCase()));

    const variantRecords = products.flatMap((p) =>
        (p.variants ?? []).map((v) => ({
            productName: p.productName ?? "-",
            variantName: v.variantName ?? "-",
            extraPrice: v.extraPrice ?? 0,
            stock: v.stock ?? 0,
        }))
    ).filter((v) => !search.trim() || v.variantName.toLowerCase().includes(search.toLowerCase()) || v.productName.toLowerCase().includes(search.toLowerCase()));

    const now = new Date();
    const currentHour = now.getHours();
    const greetingTime = currentHour < 12 ? "Sáng" : currentHour < 18 ? "Chiều" : "Tối";
    const currentTime = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    const tabs: { key: ActiveTab; label: string; count: number; icon: React.ElementType; gradient: string; ring: string; activeRing: string }[] = [
        { key: "users", label: t("totalUsers"), count: totalUsers, icon: Users, gradient: "from-blue-500 to-cyan-500", ring: "bg-blue-50 text-blue-600", activeRing: "ring-blue-400" },
        { key: "shops", label: t("totalShops"), count: totalShops, icon: Store, gradient: "from-emerald-500 to-teal-500", ring: "bg-emerald-50 text-emerald-600", activeRing: "ring-emerald-400" },
        { key: "products", label: t("totalProducts"), count: totalProducts, icon: Package, gradient: "from-violet-500 to-fuchsia-500", ring: "bg-violet-50 text-violet-600", activeRing: "ring-violet-400" },
        { key: "variants", label: t("totalVariants"), count: totalVariants, icon: Layers, gradient: "from-amber-500 to-orange-500", ring: "bg-amber-50 text-amber-600", activeRing: "ring-amber-400" },
    ];

    const handleCreateManager = async (data: CreateManagerForm) => {
        setCreateLoading(true);
        setToast(null);
        try {
            await createManager({ username: data.username, password: data.password, email: data.email ?? undefined });
            setToast({ type: "success", message: "Manager mới đã được tạo." });
            reset();
            setShowModal(false);
            const usersRes = await getUsers();
            setUsers(Array.isArray(usersRes) ? usersRes : []);
        } catch (err: unknown) {
            setToast({ type: "error", message: err instanceof Error ? err.message : "Tạo manager thất bại." });
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá user này không?")) return;
        try {
            await deleteUser(userId);
            setToast({ type: "success", message: "User đã được xoá." });
            setUsers((prev) => prev.filter((item) => (item.id ?? item._id) !== userId));
        } catch {
            setToast({ type: "error", message: "Không thể xoá user." });
        }
    };

    const tabSearchPlaceholder = {
        users: t("searchUserPlaceholder"),
        shops: "Tìm kiếm shop...",
        products: "Tìm kiếm sản phẩm...",
        variants: "Tìm kiếm variant...",
    };

    const tabTitle = {
        users: t("userList"),
        shops: "Danh sách Shops",
        products: "Danh sách Sản phẩm",
        variants: "Danh sách Variants",
    };

    const tabSubtitle = {
        users: t("userListDescription"),
        shops: "Toàn bộ shops có trên hệ thống.",
        products: "Toàn bộ sản phẩm có trên hệ thống.",
        variants: "Toàn bộ variants của tất cả sản phẩm.",
    };

    const isEmpty = {
        users: userRecords.length === 0,
        shops: shopRecords.length === 0,
        products: productRecords.length === 0,
        variants: variantRecords.length === 0,
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">

                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 shadow-lg">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
                                <Shield className="h-3.5 w-3.5 text-rose-300" />
                                Admin Control Center
                            </div>
                            <h1 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                                Chào buổi {greetingTime}, Admin!
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-300">
                                Bây giờ là {currentTime}. {t("currentTimeMessage")}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-red-400 hover:to-rose-500"
                        >
                            <Plus className="h-4 w-4" />
                            {t("createManager")}
                        </button>
                    </div>
                </div>

                {/* Toast */}
                {toast ? (
                    <div className={`fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border bg-white/95 p-4 text-sm font-medium shadow-lg backdrop-blur sm:right-6 sm:top-6 ${toast.type === "success" ? "border-emerald-200 text-emerald-800" : "border-red-200 text-red-800"}`}>
                        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toast.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        </div>
                        <p className="mt-0.5 text-slate-600">{toast.message}</p>
                    </div>
                ) : null}

                {/* Stats Cards — clickable tabs */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {tabs.map((tab) => {
                        const TabIcon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => { setActiveTab(tab.key); setSearch(""); }}
                                className={`group rounded-2xl border bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl text-left ${isActive ? `ring-2 ${tab.activeRing} border-transparent` : "border-white/70"}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tab.gradient} text-white shadow-lg`}>
                                        <TabIcon className="h-6 w-6" />
                                    </div>
                                    <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tab.ring}`}>
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        12%
                                    </div>
                                </div>
                                <p className="mt-5 text-sm font-medium text-slate-500">{tab.label}</p>
                                <p className="mt-2 text-3xl font-semibold text-slate-950">{tab.count}</p>
                                {isActive && <div className="mt-3 h-1 w-8 rounded-full bg-gradient-to-r from-slate-700 to-slate-500" />}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-950">{tabTitle[activeTab]}</h2>
                            <p className="mt-1 text-sm font-medium text-slate-500">{tabSubtitle[activeTab]}</p>
                        </div>
                        <div className="relative w-full lg:max-w-sm">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                                placeholder={tabSearchPlaceholder[activeTab]}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex animate-pulse items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                                    <div className="h-11 w-11 rounded-full bg-slate-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-36 rounded-full bg-slate-200" />
                                        <div className="h-3 w-56 rounded-full bg-slate-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                            <AlertCircle className="h-5 w-5" />{error}
                        </div>
                    ) : isEmpty[activeTab] ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-14 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <Inbox className="h-7 w-7" />
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900">Không có dữ liệu</h3>
                            <p className="mt-1 text-sm font-medium text-slate-500">Danh sách sẽ xuất hiện tại đây.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-100">
                            <div className="overflow-x-auto">

                                {/* USERS TABLE */}
                                {activeTab === "users" && (
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-slate-900 text-slate-200">
                                            <tr>
                                                <th className="px-5 py-4 font-semibold">{t("username")}</th>
                                                <th className="px-5 py-4 font-semibold">{t("email")}</th>
                                                <th className="px-5 py-4 font-semibold">{t("role")}</th>
                                                <th className="px-5 py-4 font-semibold text-right">{t("actions")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {userRecords.map((row) => {
                                                const roleStyles = getRoleStyles(row.role);
                                                return (
                                                    <tr key={row.id} className="transition hover:bg-slate-50">
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${roleStyles.avatar} text-sm font-semibold text-white shadow-sm`}>
                                                                    {getInitials(row.username)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-slate-950">{row.username}</p>
                                                                    <p className="text-xs font-medium text-slate-400">ID: {row.id || "N/A"}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4 font-medium text-slate-600">{row.email}</td>
                                                        <td className="px-5 py-4">
                                                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${roleStyles.badge}`}>{row.role}</span>
                                                        </td>
                                                        <td className="px-5 py-4 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteUser(row.id)}
                                                                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                                                            >
                                                                <Trash2 className="h-4 w-4" />{t("delete")}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}

                                {/* SHOPS TABLE */}
                                {activeTab === "shops" && (
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-slate-900 text-slate-200">
                                            <tr>
                                                <th className="px-5 py-4 font-semibold">Tên Shop</th>
                                                <th className="px-5 py-4 font-semibold">Mô tả</th>
                                                <th className="px-5 py-4 font-semibold">Owner ID</th>
                                                <th className="px-5 py-4 font-semibold">Ngày tạo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {shopRecords.map((row) => (
                                                <tr key={row.id} className="transition hover:bg-slate-50">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
                                                                <Store className="h-5 w-5" />
                                                            </div>
                                                            <p className="font-semibold text-slate-950">{row.shopName}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 font-medium text-slate-500 max-w-xs truncate">{row.description}</td>
                                                    <td className="px-5 py-4 font-medium text-slate-600">{row.ownerId}</td>
                                                    <td className="px-5 py-4 font-medium text-slate-600">
                                                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString("vi-VN") : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {/* PRODUCTS TABLE */}
                                {activeTab === "products" && (
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-slate-900 text-slate-200">
                                            <tr>
                                                <th className="px-5 py-4 font-semibold">Tên sản phẩm</th>
                                                <th className="px-5 py-4 font-semibold">Giá gốc</th>
                                                <th className="px-5 py-4 font-semibold text-center">Số Variants</th>
                                                <th className="px-5 py-4 font-semibold text-center">Tổng Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {productRecords.map((row) => (
                                                <tr key={row.id} className="transition hover:bg-slate-50">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                            <p className="font-semibold text-slate-950">{row.productName}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 font-medium text-slate-600">{formatVND(row.basePrice)}</td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex rounded-full bg-violet-50 border border-violet-200 px-3 py-1 text-xs font-semibold text-violet-700">{row.variantCount}</span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{row.totalStock}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {/* VARIANTS TABLE */}
                                {activeTab === "variants" && (
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-slate-900 text-slate-200">
                                            <tr>
                                                <th className="px-5 py-4 font-semibold">Tên Variant</th>
                                                <th className="px-5 py-4 font-semibold">Sản phẩm</th>
                                                <th className="px-5 py-4 font-semibold">Giá thêm</th>
                                                <th className="px-5 py-4 font-semibold text-center">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {variantRecords.map((row, idx) => (
                                                <tr key={idx} className="transition hover:bg-slate-50">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                                                                <Layers className="h-5 w-5" />
                                                            </div>
                                                            <p className="font-semibold text-slate-950">{row.variantName}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 font-medium text-slate-600">{row.productName}</td>
                                                    <td className="px-5 py-4 font-medium text-slate-600">{formatVND(row.extraPrice)}</td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${row.stock > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                                                            {row.stock}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
                    <div className="w-full max-w-xl rounded-2xl border border-white/70 bg-white/95 p-6 shadow-2xl backdrop-blur">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-rose-200">
                                    <UserPlus className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-950">{t("createManagerTitle")}</h3>
                                    <p className="mt-1 text-sm font-medium text-slate-500">{t("createManagerSubtitle")}</p>
                                </div>
                            </div>
                            <button type="button" onClick={() => setShowModal(false)} aria-label="Đóng" title="Đóng"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(handleCreateManager)} className="space-y-4">
                            <div>
                                <div className="relative">
                                    <UserPlus className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <input {...register("username")} className={`${inputBase} ${inputFocus} ${errors.username ? inputError : ""}`} placeholder="Username manager" />
                                    <label className="pointer-events-none absolute left-12 top-2 text-xs font-medium text-slate-500 transition peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-600">{t("username")}</label>
                                </div>
                                {errors.username && <p className="mt-2 text-sm font-medium text-red-600">{errors.username.message}</p>}
                            </div>
                            <div>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <input type="password" {...register("password")} className={`${inputBase} ${inputFocus} ${errors.password ? inputError : ""}`} placeholder="Password" />
                                    <label className="pointer-events-none absolute left-12 top-2 text-xs font-medium text-slate-500 transition peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-600">Password</label>
                                </div>
                                {errors.password && <p className="mt-2 text-sm font-medium text-red-600">{errors.password.message}</p>}
                            </div>
                            <div>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <input {...register("email")} className={`${inputBase} ${inputFocus} ${errors.email ? inputError : ""}`} placeholder="Email (tùy chọn)" />
                                    <label className="pointer-events-none absolute left-12 top-2 text-xs font-medium text-slate-500 transition peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-600">Email</label>
                                </div>
                                {errors.email && <p className="mt-2 text-sm font-medium text-red-600">{errors.email.message}</p>}
                            </div>
                            <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
                                <button type="submit" disabled={createLoading}
                                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:from-red-400 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-60">
                                    <Plus className="h-4 w-4" />
                                    {createLoading ? t("creating") : t("create")}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                                    {t("cancel")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
}