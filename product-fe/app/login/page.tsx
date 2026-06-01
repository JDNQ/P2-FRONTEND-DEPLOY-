"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const loginSchema = z.object({
    account: z.string().min(1, "Tài khoản là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(1, "Mật khẩu là bắt buộc"),
    remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function IconMail(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
            <path
                d="M4 7.5C4 6.11929 5.11929 5 6.5 5H17.5C18.8807 5 20 6.11929 20 7.5V16.5C20 17.8807 18.8807 19 17.5 19H6.5C5.11929 19 4 17.8807 4 16.5V7.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path d="M5.5 7L12 12L18.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconUser(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
            <path
                d="M20 21C20 18.2386 18.6863 16 15.6 16H8.4C5.31372 16 4 18.2386 4 21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}

function IconEye(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
            <path
                d="M2 12C4.5 7 8 4.5 12 4.5C16 4.5 19.5 7 22 12C19.5 17 16 19.5 12 19.5C8 19.5 4.5 17 2 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

function IconEyeOff(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
            <path
                d="M3 5L21 19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M10.5 10.5C10.2 11.1 10.1 11.8 10.2 12.4C10.4 13.6 11.4 14.6 12.6 14.8C13.2 14.9 13.9 14.8 14.5 14.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M2 12C4.3 7.4 7.7 5.1 12 4.5C13.9 4.3 15.8 4.6 17.5 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M22 12C19.7 16.6 16.3 18.9 12 19.5C10.1 19.7 8.2 19.4 6.5 18.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M14.5 9.5C13.9 9.2 13.2 9.1 12.6 9.2C11.4 9.4 10.4 10.4 10.2 11.6C10.1 12.2 10.2 12.9 10.5 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const [lang, setLang] = useState<"vi" | "en">("vi");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const copy = useMemo(() => {
        if (lang === "en") {
            return {
                appName: "DX FutureTech",
                appDesc: "Product management",
                title: "Sign in",
                accountLabel: "Account",
                emailLabel: "Email",
                passwordLabel: "Password",
                remember: "Remember me",
                submit: "Sign in",
                loading: "Signing in...",
                toggleLang: "Language",
            };
        }
        return {
            appName: "DX FutureTech",
            appDesc: "Quản lý sản phẩm",
            title: "Đăng nhập",
            accountLabel: "Tài khoản",
            emailLabel: "Email",
            passwordLabel: "Mật khẩu",
            remember: "Ghi nhớ đăng nhập",
            submit: "Đăng nhập",
            loading: "Đang đăng nhập...",
            toggleLang: "Ngôn ngữ",
        };
    }, [lang]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            account: "",
            email: "",
            password: "",
            remember: true,
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data: LoginFormData) => {
        console.log(data);
        setSubmitting(true);
        try {
            // TODO: Call backend login endpoint here when available
            // await api.post('/login', data)
            // TODO: Replace this with real token from backend
            const token = "demo-token";
            document.cookie = `token=${token}; path=/; max-age=3600`;
            router.push("/products");
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = (hasError: boolean) =>
        hasError
            ? "w-full rounded-md border border-red-500 px-3 py-2 outline-none focus:border-red-500"
            : "w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:border-[#1e3a6e]";

    return (
        <div className="min-h-screen bg-white">
            {/* top right language switcher */}
            <div className="fixed right-4 top-4 z-20 flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600">{copy.toggleLang}</span>
                <div className="rounded-md border border-gray-200 bg-white p-1">
                    <button
                        type="button"
                        onClick={() => setLang("vi")}
                        className={
                            lang === "vi"
                                ? "rounded-sm bg-[#1e3a6e] px-3 py-1 text-xs font-semibold text-white"
                                : "rounded-sm px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        }
                    >
                        VI
                    </button>
                    <button
                        type="button"
                        onClick={() => setLang("en")}
                        className={
                            lang === "en"
                                ? "rounded-sm bg-[#1e3a6e] px-3 py-1 text-xs font-semibold text-white ml-1"
                                : "rounded-sm px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 ml-1"
                        }
                    >
                        EN
                    </button>
                </div>
            </div>

            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                {/* left panel */}
                <div className="hidden bg-gradient-to-br from-[#1a2744] to-[#1565c0] p-10 text-white lg:block">
                    <div className="max-w-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                                <span className="text-lg font-bold">DX</span>
                            </div>
                            <div>
                                <div className="text-sm font-semibold uppercase tracking-wide">{copy.appName}</div>
                                <div className="text-xl font-bold">Product Manager</div>
                            </div>
                        </div>

                        <p className="mt-5 text-sm text-white/90">{copy.appDesc}</p>

                        <div className="mt-10 rounded-2xl bg-white/10 p-5">
                            <p className="text-sm font-semibold">{lang === "en" ? "Secure & fast" : "An toàn & nhanh"}</p>
                            <p className="mt-1 text-sm text-white/80">
                                {lang === "en" ? "Login to manage products and variants." : "Đăng nhập để quản lý sản phẩm và variants."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* right panel */}
                <div className="flex items-center justify-center bg-[#f8fafc] p-6 lg:p-10">
                    <div className="w-full max-w-md">
                        <h1 className="mb-6 text-2xl font-bold text-gray-900">{copy.title}</h1>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-2xl bg-white p-6 shadow-sm">
                            {/* account */}
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-gray-800">{copy.accountLabel}</label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#1e3a6e]">
                                        <IconUser className="h-5 w-5" />
                                    </span>
                                    <input
                                        {...register("account")}
                                        className={
                                            inputClass(Boolean(errors.account)) + (errors.account ? " pl-10" : " pl-10")
                                        }
                                        placeholder={lang === "en" ? "Your account" : "Nhập tài khoản"}
                                    />
                                </div>
                                {errors.account && <p className="mt-1 text-xs text-[#ef4444]">{errors.account.message}</p>}
                            </div>

                            {/* email */}
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-gray-800">{copy.emailLabel}</label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#1e3a6e]">
                                        <IconMail className="h-5 w-5" />
                                    </span>
                                    <input
                                        {...register("email")}
                                        className={inputClass(Boolean(errors.email)) + " pl-10"}
                                        placeholder="name@example.com"
                                        type="email"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-xs text-[#ef4444]">{errors.email.message}</p>}
                            </div>

                            {/* password */}
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-gray-800">{copy.passwordLabel}</label>
                                <div className="relative">
                                    <input
                                        {...register("password")}
                                        className={inputClass(Boolean(errors.password)) + " pr-12"}
                                        placeholder={lang === "en" ? "Your password" : "Nhập mật khẩu"}
                                        type={showPassword ? "text" : "password"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#1e3a6e] hover:bg-gray-50"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-[#ef4444]">{errors.password.message}</p>}
                            </div>

                            <div className="mb-6 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" {...register("remember")} />
                                    <span>{copy.remember}</span>
                                </label>
                            </div>

                            <button
                                disabled={submitting}
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-md bg-[#1e3a6e] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? (
                                    <span className="inline-flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        {copy.loading}
                                    </span>
                                ) : (
                                    copy.submit
                                )}
                            </button>

                            <p className="mt-4 text-center text-xs text-gray-500">
                                {lang === "en" ? "No backend wired yet." : "Chưa nối endpoint đăng nhập backend."}
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

