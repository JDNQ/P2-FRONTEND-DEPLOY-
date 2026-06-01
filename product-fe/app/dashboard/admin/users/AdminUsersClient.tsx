"use client";

import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    AlertCircle,
    CheckCircle2,
    Calendar,
    Inbox,
    Lock,
    Mail,
    Plus,
    Search,
    Shield,
    Trash2,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import { createManager, deleteUser, getUsers } from "@/lib/api";

type UserRow = {
    id?: string;
    _id?: string;
    username?: string;
    email?: string;
    role?: string;
    createdAt?: string;
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

export default function AdminUsersClient() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserRow[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

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
        "peer w-full rounded-2xl border border-slate-200 bg-white/90 px-12 pb-3 pt-6 text-sm font-medium text-slate-900 outline-none shadow-sm transition placeholder:text-transparent";
    const inputFocus = "focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)]";
    const inputError = "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]";

    const filterUsers = useCallback((userList: UserRow[], search: string) => {
        if (!search.trim()) {
            setFilteredUsers(userList);
            return;
        }
        const lowerSearch = search.toLowerCase();
        setFilteredUsers(
            userList.filter((user) =>
                (user.username?.toLowerCase().includes(lowerSearch) ||
                    user.email?.toLowerCase().includes(lowerSearch)) ?? false
            )
        );
    }, []);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const usersRes = await getUsers();
            const usersList = Array.isArray(usersRes) ? usersRes : [];
            setUsers(usersList);
        } catch {
            setError("Không thể tải dữ liệu người dùng từ server.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        filterUsers(users, searchTerm);
    }, [searchTerm, users, filterUsers]);

    useEffect(() => {
        if (!toast) return;
        const timer = window.setTimeout(() => setToast(null), 3000);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const totalUsers = users.length;
    const totalAdmins = users.filter((u) => u.role?.toUpperCase() === "ADMIN").length;
    const totalManagers = users.filter((u) => u.role?.toUpperCase() === "MANAGER").length;
    const totalRegularUsers = totalUsers - totalAdmins - totalManagers;

    const userRecords = filteredUsers.map((row) => ({
        id: row.id ?? row._id ?? "",
        username: row.username ?? "-",
        email: row.email ?? "-",
        role: row.role ?? "-",
        createdAt: row.createdAt ?? "-",
    }));

    const getRoleStyles = (role: string) => {
        const normalizedRole = role.toUpperCase();
        if (normalizedRole === "ADMIN") {
            return {
                avatar: "from-red-500 to-rose-600",
                badge: "border-red-200 bg-red-50 text-red-700",
            };
        }
        if (normalizedRole === "MANAGER") {
            return {
                avatar: "from-blue-500 to-indigo-600",
                badge: "border-blue-200 bg-blue-50 text-blue-700",
            };
        }
        return {
            avatar: "from-slate-500 to-slate-700",
            badge: "border-slate-200 bg-slate-100 text-slate-700",
        };
    };

    const getInitials = (name: string) => {
        if (!name || name === "-") return "U";
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === "-") return "-";
        try {
            return new Date(dateString).toLocaleDateString("vi-VN");
        } catch {
            return "-";
        }
    };

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
            await loadUsers();
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
            setUsers((prev) => prev.filter((item) => (item.id ?? item._id) !== userId));
        } catch {
            setToast({ type: "error", message: "Không thể xoá user." });
        }
    };

    const stats = [
        {
            label: "Tổng users",
            value: totalUsers,
            color: "from-blue-500 to-cyan-500",
            ring: "bg-blue-50 text-blue-600",
            icon: Users,
        },
        {
            label: "Tổng admins",
            value: totalAdmins,
            color: "from-red-500 to-rose-500",
            ring: "bg-red-50 text-red-600",
            icon: Shield,
        },
        {
            label: "Tổng managers",
            value: totalManagers,
            color: "from-indigo-500 to-blue-500",
            ring: "bg-indigo-50 text-indigo-600",
            icon: UserPlus,
        },
        {
            label: "Users thường",
            value: totalRegularUsers,
            color: "from-slate-500 to-slate-600",
            ring: "bg-slate-50 text-slate-600",
            icon: Users,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 shadow-lg">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
                                <Users className="h-3.5 w-3.5 text-blue-300" />
                                User Management
                            </div>
                            <h1 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                                Quản lý Users
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-300">
                                Quản lý tài khoản người dùng trên hệ thống.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/30 transition hover:-translate-y-0.5 hover:from-red-400 hover:to-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-300/30"
                        >
                            <Plus className="h-4 w-4" />
                            Tạo Manager
                        </button>
                    </div>
                </div>

                {toast ? (
                    <div
                        className={`fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border bg-white/95 p-4 text-sm font-medium shadow-lg backdrop-blur transition sm:right-6 sm:top-6 ${
                            toast.type === "success" ? "border-emerald-200 text-emerald-800" : "border-red-200 text-red-800"
                        }`}
                    >
                        <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                toast.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                            }`}
                        >
                            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold">{toast.type === "success" ? "Thành công" : "Có lỗi xảy ra"}</p>
                            <p className="mt-0.5 text-slate-600">{toast.message}</p>
                        </div>
                    </div>
                ) : null}

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const StatIcon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="group rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                                        <StatIcon className="h-6 w-6" />
                                    </div>
                                </div>
                                <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="mt-2 text-3xl font-semibold text-slate-950">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-950">Danh sách users</h2>
                            <p className="mt-1 text-sm font-medium text-slate-500">Danh sách toàn bộ người dùng hệ thống.</p>
                        </div>
                        <div className="relative w-full lg:max-w-sm">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                                placeholder="Tìm kiếm user..."
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                            {[0, 1, 2, 3].map((item) => (
                                <div key={item} className="flex animate-pulse items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                                    <div className="h-11 w-11 rounded-full bg-slate-200" />
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
                    ) : userRecords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-14 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <Inbox className="h-7 w-7" />
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900">Chưa có user nào</h3>
                            <p className="mt-1 text-sm font-medium text-slate-500">Không tìm thấy user phù hợp.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-slate-900 text-slate-200">
                                        <tr>
                                            <th className="px-5 py-4 font-semibold">Username</th>
                                            <th className="px-5 py-4 font-semibold">Email</th>
                                            <th className="px-5 py-4 font-semibold">Role</th>
                                            <th className="px-5 py-4 font-semibold">Joined Date</th>
                                            <th className="px-5 py-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {userRecords.map((row) => {
                                            const roleStyles = getRoleStyles(row.role);
                                            return (
                                                <tr key={row.id} className="transition hover:bg-slate-50">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${roleStyles.avatar} text-sm font-semibold text-white shadow-sm`}
                                                            >
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
                                                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${roleStyles.badge}`}>
                                                            {row.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 font-medium text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-slate-400" />
                                                            {formatDate(row.createdAt)}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteUser(row.id)}
                                                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Xoá
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
                    <div className="w-full max-w-xl rounded-2xl border border-white/70 bg-white/95 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-rose-200">
                                    <UserPlus className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-950">Tạo Manager mới</h3>
                                    <p className="mt-1 text-sm font-medium text-slate-500">Điền thông tin để thêm tài khoản manager.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                                aria-label="Đóng"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(handleCreateManager)} className="space-y-4">
                            <div>
                                <div className="relative">
                                    <UserPlus className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        {...register("username")}
                                        className={`${inputBase} ${inputFocus} ${errors.username ? inputError : ""}`}
                                        placeholder="Username manager"
                                    />
                                    <label className="pointer-events-none absolute left-12 top-2 text-xs font-medium text-slate-500 transition peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-600">
                                        Username
                                    </label>
                                </div>
                                {errors.username ? <p className="mt-2 text-sm font-medium text-red-600">{errors.username.message}</p> : null}
                            </div>
                            <div>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        {...register("password")}
                                        className={`${inputBase} ${inputFocus} ${errors.password ? inputError : ""}`}
                                        placeholder="Password"
                                    />
                                    <label className="pointer-events-none absolute left-12 top-2 text-xs font-medium text-slate-500 transition peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-600">
                                        Password
                                    </label>
                                </div>
                                {errors.password ? <p className="mt-2 text-sm font-medium text-red-600">{errors.password.message}</p> : null}
                            </div>
                            <div>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        {...register("email")}
                                        className={`${inputBase} ${inputFocus} ${errors.email ? inputError : ""}`}
                                        placeholder="Email (tùy chọn)"
                                    />
                                    <label className="pointer-events-none absolute left-12 top-2 text-xs font-medium text-slate-500 transition peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-600">
                                        Email
                                    </label>
                                </div>
                                {errors.email ? <p className="mt-2 text-sm font-medium text-red-600">{errors.email.message}</p> : null}
                            </div>
                            <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:from-red-400 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Plus className="h-4 w-4" />
                                    {createLoading ? "Đang tạo..." : "Tạo manager"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Huỷ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
