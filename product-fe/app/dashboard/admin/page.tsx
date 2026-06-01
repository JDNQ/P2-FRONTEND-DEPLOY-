"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createManager, deleteUser, getProducts, getShops, getUsers } from "@/lib/api";

type UserRow = {
    id?: string;
    _id?: string;
    username?: string;
    email?: string;
    role?: string;
};

type ProductSummary = {
    id?: string;
    productName?: string;
    variants?: Array<{ stock?: number }>;
};

type ShopSummary = {
    id?: string;
    _id?: string;
    shopName?: string;
    name?: string;
};

const createManagerSchema = z.object({
    username: z.string().min(6, "Username phải có ít nhất 6 ký tự"),
    password: z.string().min(6, "Password phải có ít nhất 6 ký tự"),
    email: z
        .string()
        .trim()
        .optional()
        .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
            message: "Email không hợp lệ",
        }),
});

type CreateManagerForm = z.infer<typeof createManagerSchema>;

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [products, setProducts] = useState<ProductSummary[]>([]);
    const [shops, setShops] = useState<ShopSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateManagerForm>({
        resolver: zodResolver(createManagerSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
        },
    });

    const inputBase =
        "w-full rounded-md border border-[#e5e7eb] bg-white px-4 py-[11px] text-sm outline-none";
    const inputFocus = "focus:border-[#1e3a6e] focus:shadow-[0_0_0_3px_rgba(30,58,110,0.1)]";
    const inputError = "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]";

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                setLoading(true);
                const [usersRes, productsRes, shopsRes] = await Promise.all([getUsers(), getProducts(), getShops()]);
                if (!mounted) return;
                setUsers(Array.isArray(usersRes) ? usersRes : []);
                setProducts(Array.isArray(productsRes) ? productsRes : []);
                setShops(Array.isArray(shopsRes) ? shopsRes : []);
            } catch {
                if (!mounted) return;
                setError("Không thể tải dữ liệu từ server.");
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

    const totalVariants = products.reduce((count, product) => count + (product.variants?.length ?? 0), 0);
    const totalUsers = users.length;
    const totalShops = shops.length;
    const totalProducts = products.length;

    const userRecords = users.map((row) => ({
        id: row.id ?? row._id ?? "",
        username: row.username ?? "-",
        email: row.email ?? "-",
        role: row.role ?? "-",
    }));

    const handleCreateManager = async (data: CreateManagerForm) => {
        setCreateLoading(true);
        setToast(null);

        try {
            await createManager({
                username: data.username,
                password: data.password,
                email: data.email ?? undefined,
            });
            setToast({ type: "success", message: "Manager mới đã được tạo." });
            reset();
            setShowModal(false);
            const usersRes = await getUsers();
            setUsers(Array.isArray(usersRes) ? usersRes : []);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Tạo manager thất bại.";
            setToast({ type: "error", message });
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xoá user này không?");
        if (!confirmed) return;

        try {
            await deleteUser(userId);
            setToast({ type: "success", message: "User đã được xoá." });
            setUsers((prev) => prev.filter((item) => item.id !== userId));
        } catch {
            setToast({ type: "error", message: "Không thể xoá user." });
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-lg font-semibold text-slate-900">Xin chào, Admin!</p>
                        <p className="mt-1 text-sm text-slate-500">Tổng hợp hiệu suất hệ thống và quản lý tài khoản.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                    >
                        Tạo Manager
                    </button>
                </div>
            </div>

            {toast ? (
                <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}
                >
                    {toast.message}
                </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Tổng users</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-900">{totalUsers}</p>
                </div>
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
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Danh sách users</h2>
                        <p className="mt-1 text-sm text-slate-500">Quản lý người dùng hiện có của hệ thống.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">Đang tải users...</div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Username</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {userRecords.map((row) => (
                                    <tr key={row.id}>
                                        <td className="px-4 py-4 font-medium text-slate-900">{row.username}</td>
                                        <td className="px-4 py-4 text-slate-600">{row.email}</td>
                                        <td className="px-4 py-4 text-slate-600">{row.role}</td>
                                        <td className="px-4 py-4">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUser(row.id)}
                                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                                            >
                                                Xoá
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Tạo Manager mới</h3>
                                <p className="mt-1 text-sm text-slate-500">Điền thông tin để thêm tài khoản manager.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="rounded-full bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200"
                            >
                                Đóng
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(handleCreateManager)} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-800">Username</label>
                                <input
                                    {...register("username")}
                                    className={`${inputBase} ${inputFocus} ${errors.username ? inputError : ""}`}
                                    placeholder="Username manager"
                                />
                                {errors.username ? <p className="mt-2 text-sm text-red-600">{errors.username.message}</p> : null}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-800">Password</label>
                                <input
                                    type="password"
                                    {...register("password")}
                                    className={`${inputBase} ${inputFocus} ${errors.password ? inputError : ""}`}
                                    placeholder="Password"
                                />
                                {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password.message}</p> : null}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-800">Email</label>
                                <input
                                    {...register("email")}
                                    className={`${inputBase} ${inputFocus} ${errors.email ? inputError : ""}`}
                                    placeholder="Email (tùy chọn)"
                                />
                                {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Huỷ
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="rounded-xl bg-[#1e3a6e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#173359] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {createLoading ? "Đang tạo..." : "Tạo manager"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
