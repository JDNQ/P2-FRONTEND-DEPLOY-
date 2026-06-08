"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login, setCookie } from "@/lib/api";
import { useLocale, useTranslations } from "@/lib/useTranslations";

// LoginResponse type - Đã fix 'any'
type LoginResponse = {
    access_token?: string;
    accessToken?: string;
    token?: string;
    user?: { username: string; role: string; email?: string };
    data?: {
        access_token?: string;
        accessToken?: string;
        token?: string;
        user?: { username: string; role: string; email?: string };
    };
    message?: string;
    username?: string;
    role?: string;
    email?: string;
};

const loginSchema = z.object({
    username: z.string().min(6, "Username phải có ít nhất 6 ký tự"),
    password: z.string().min(6, "Password phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function IconUser(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
            <path d="M20 21C20 18.2386 18.6863 16 15.6 16H8.4C5.31372 16 4 18.2386 4 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

function IconEye(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
            <path d="M2 12C4.5 7 8 4.5 12 4.5C16 4.5 19.5 7 22 12C19.5 17 16 19.5 12 19.5C8 19.5 4.5 17 2 12Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

function IconEyeOff(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
            <path d="M3 5L21 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10.5 10.5C10.2 11.1 10.1 11.8 10.2 12.4C10.4 13.6 11.4 14.6 12.6 14.8C13.2 14.9 13.9 14.8 14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2 12C4.3 7.4 7.7 5.1 12 4.5C13.9 4.3 15.8 4.6 17.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M22 12C19.7 16.6 16.3 18.9 12 19.5C10.1 19.7 8.2 19.4 6.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const { locale, setLocale } = useLocale();
    const t = useTranslations("login");

    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data: LoginFormData) => {
        setServerError(null);
        setSubmitting(true);

        try {
            const response = (await login(data)) as LoginResponse;
            const token = response.data?.access_token || response.access_token;
            const user = response.data?.user || response.user;

            if (!token) {
                setServerError(t("noTokenReceived"));
                return;
            }
            if (!user?.username || !user?.role) {
                setServerError(t("noUserInfo"));
                return;
            }

            setCookie("token", token, { path: "/", maxAge: 60 * 60 * 24 });
            localStorage.setItem("user", JSON.stringify({ username: user.username, role: user.role }));

            const role = user.role.toUpperCase();
            const route = role === "ADMIN" ? "/dashboard/admin" : role === "MANAGER" ? "/dashboard/manager" : "/";
            router.push(route);
        } catch (error: unknown) {
            // Fix: Không dùng 'any'
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || t("loginError");
            setServerError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const inputBase = "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all";
    const inputFocus = "focus:border-[#f97316] focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)]";
    const inputError = "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]";

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Left Panel: Branding */}
            <div className="relative flex min-h-[300px] w-full flex-col items-center justify-center bg-gradient-to-br from-[#0f2460] to-[#1a3d8f] px-8 py-12 text-center lg:min-h-screen lg:w-[40%]">
                <div className="flex flex-1 flex-col items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="TL Market" className="w-48 h-auto" />
                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">TL Market</h1>
                    <p className="mt-3 text-sm font-medium text-blue-200/80">Hệ thống quản lý sản phẩm</p>
                </div>
                <p className="mt-8 text-xs text-blue-300/50">© 2026 TL Market. All rights reserved.</p>
            </div>

            {/* Right Panel: Form */}
            <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-[60%] lg:px-16">
                <div className="w-full max-w-[400px]">
                    {/* Language Toggle */}
                    <div className="mb-8 flex justify-end">
                        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 shadow-sm">
                            <button
                                type="button"
                                onClick={() => setLocale("vi")}
                                className={locale === "vi" ? "rounded-md bg-[#1a3d8f] px-3 py-1.5 text-xs font-semibold text-white" : "rounded-md px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600"}
                            >
                                VI
                            </button>
                            <button
                                type="button"
                                onClick={() => setLocale("en")}
                                className={locale === "en" ? "rounded-md bg-[#1a3d8f] px-3 py-1.5 text-xs font-semibold text-white" : "rounded-md px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600"}
                            >
                                EN
                            </button>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
                    <p className="mt-2 text-sm text-gray-500">{t("subtitle")}</p>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
                        {serverError && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {serverError}
                            </div>
                        )}

                        <div className="mb-5">
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t("username")}</label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <IconUser className="h-5 w-5" />
                                </span>
                                <input
                                    {...register("username")}
                                    className={`${inputBase} ${inputFocus} ${errors.username ? inputError : ""} pl-10`}
                                    placeholder={t("usernamePlaceholder")}
                                />
                            </div>
                            {errors.username && <p className="mt-1.5 text-xs text-red-500">{errors.username.message}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t("password")}</label>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    className={`${inputBase} ${inputFocus} ${errors.password ? inputError : ""} pr-12`}
                                    placeholder={t("passwordPlaceholder")}
                                    type={showPassword ? "text" : "password"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
                        </div>

                        <button
                            disabled={submitting}
                            type="submit"
                            className="inline-flex w-full items-center justify-center rounded-lg bg-[#f97316] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-[#ea580c] hover:shadow-xl hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <span className="inline-flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    {t("loading")}
                                </span>
                            ) : (
                                t("submit")
                            )}
                        </button>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            <span>{t("noAccount")}</span>
                            <button
                                type="button"
                                onClick={() => router.push("/register")}
                                className="ml-1 font-semibold text-[#1a3d8f] hover:text-[#0f2460]"
                            >
                                {t("register")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}