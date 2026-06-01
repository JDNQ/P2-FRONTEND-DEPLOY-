"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { register as registerUser } from "@/lib/api";

type RegisterFormData = z.infer<typeof registerSchema>;

const registerSchema = z.object({
    username: z.string().min(6, "Username phải có ít nhất 6 ký tự"),
    password: z.string().min(6, "Password phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu là bắt buộc"),
    email: z
        .string()
        .trim()
        .optional()
        .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
            message: "Email không hợp lệ",
        }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
});

export default function RegisterPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const copy = useMemo(
        () => ({
            title: "Đăng ký",
            subtitle: "Tạo tài khoản để truy cập hệ thống quản lý",
            submit: "ĐĂNG KÝ",
            loading: "Đang đăng ký...",
            loginLink: "Đã có tài khoản? Đăng nhập",
        }),
        []
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null);
        setSubmitting(true);
        try {
            await registerUser({
                username: data.username,
                password: data.password,
                email: data.email ?? undefined,
            });
            router.push("/login");
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.";
            const response =
                error && typeof error === "object" && "response" in error
                    ? (error as { response?: { data?: { message?: string } } }).response?.data
                    : undefined;
            setServerError(response?.message ?? message);
        } finally {
            setSubmitting(false);
        }
    };

    const inputBase =
        "w-full rounded-md border border-[#e5e7eb] bg-white px-4 py-[11px] text-sm outline-none";
    const inputFocus = "focus:border-[#1e3a6e] focus:shadow-[0_0_0_3px_rgba(30,58,110,0.1)]";
    const inputError = "border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]";

    return (
        <div className="min-h-screen">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                <div className="relative hidden overflow-hidden p-10 text-white lg:block">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(160deg, #0f2044 0%, #1a3a6e 50%, #1565c0 100%)",
                        }}
                    />
                    <div
                        className="absolute -top-10 -left-10 h-44 w-44 rounded-full bg-white/10 blur-[0px]"
                        aria-hidden="true"
                    />
                    <div
                        className="absolute -bottom-14 -right-14 h-56 w-56 rounded-full bg-white/5"
                        aria-hidden="true"
                    />
                    <div className="relative mx-auto max-w-md">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 flex h-18 w-18 items-center justify-center rounded-2xl bg-white/15">
                                <span className="text-2xl font-extrabold text-[#60b4ff]">DX</span>
                            </div>
                            <div>
                                <div className="mt-2 text-3xl font-extrabold">TL MARKET</div>
                                <div className="mt-2 text-[14px] font-medium text-white/60">Hệ thống quản lý sản phẩm & biến thể</div>
                            </div>
                        </div>
                        <div className="mt-10 rounded-2xl bg-white/10 p-5">
                            <p className="text-sm font-semibold">&nbsp;</p>
                            <p className="mt-1 text-sm text-white/70">Đăng ký nhanh và bắt đầu quản lý hiệu quả.</p>
                        </div>
                        <div className="mt-14 text-[12px] text-white/30">© 2026 DX FutureTech</div>
                    </div>
                </div>

                <div className="flex items-center justify-center bg-[#f8fafc] p-6 lg:p-10">
                    <div className="w-full max-w-[420px]">
                        <h1 className="mb-3 text-[28px] font-[700] text-[#111827]">{copy.title}</h1>
                        <div className="mb-8 text-[14px] font-medium text-[#6b7280]">{copy.subtitle}</div>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-xl bg-white p-6 shadow-sm">
                            {serverError ? (
                                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {serverError}
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-gray-800">Username</label>
                                <input
                                    {...register("username")}
                                    className={`${inputBase} ${inputFocus} ${errors.username ? inputError : ""}`}
                                    placeholder="Nhập username"
                                />
                                {errors.username && <p className="mt-2 text-[12px] text-[#ef4444]">{errors.username.message}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-gray-800">Password</label>
                                <input
                                    type="password"
                                    {...register("password")}
                                    className={`${inputBase} ${inputFocus} ${errors.password ? inputError : ""}`}
                                    placeholder="Nhập password"
                                />
                                {errors.password && <p className="mt-2 text-[12px] text-[#ef4444]">{errors.password.message}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-gray-800">Confirm Password</label>
                                <input
                                    type="password"
                                    {...register("confirmPassword")}
                                    className={`${inputBase} ${inputFocus} ${errors.confirmPassword ? inputError : ""}`}
                                    placeholder="Xác nhận password"
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-2 text-[12px] text-[#ef4444]">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-800">Email (tùy chọn)</label>
                                <input
                                    {...register("email")}
                                    className={`${inputBase} ${inputFocus} ${errors.email ? inputError : ""}`}
                                    placeholder="Nhập email"
                                />
                                {errors.email && <p className="mt-2 text-[12px] text-[#ef4444]">{errors.email.message}</p>}
                            </div>

                            <button
                                disabled={submitting}
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-md bg-[#1e3a6e] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1a3060] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? copy.loading : copy.submit}
                            </button>

                            <div className="mt-4 text-sm text-gray-600">
                                <Link href="/login" className="font-semibold text-[#1e3a6e] hover:underline">
                                    {copy.loginLink}
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
