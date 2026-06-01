"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const loginSchema = z.object({
    account: z.string().min(1, "Tài khoản là bắt buộc"),
    password: z.string().min(1, "Mật khẩu là bắt buộc"),
    remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

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
            <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}

function IconEyeOff(props: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
            <path d="M3 5L21 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
                title: "Sign in",
                accountLabel: "Account",
                passwordLabel: "Password",
                remember: "Remember me",
                subtitle: "Sign in to your account to continue",
                submit: "SIGN IN",
                loading: "Signing in...",
                vi: "VI",
                en: "EN",
            };
        }

        return {
            title: "Đăng nhập",
            accountLabel: "Tài khoản",
            passwordLabel: "Mật khẩu",
            remember: "Ghi nhớ đăng nhập",
            subtitle: "Đăng nhập vào tài khoản của bạn để tiếp tục",
            submit: "ĐĂNG NHẬP",
            loading: "Đang đăng nhập...",
            vi: "VI",
            en: "EN",
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
            password: "",
            remember: true,
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data: LoginFormData) => {
        console.log(data);
        setSubmitting(true);
        try {
            const token = "demo-token";
            document.cookie = `token=${token}; path=/; max-age=3600`;
            router.push("/products");
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
                {/* left panel */}
                <div className="relative hidden overflow-hidden p-10 text-white lg:block">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(160deg, #0f2044 0%, #1a3a6e 50%, #1565c0 100%)",
                        }}
                    />

                    {/* subtle decorations */}
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
                            <p className="mt-1 text-sm text-white/70">
                                {lang === "en"
                                    ? "Secure access. Fast workflow."
                                    : "Truy cập an toàn. Luồng thao tác nhanh."}
                            </p>
                        </div>

                        <div className="mt-14 text-[12px] text-white/30">© 2026 DX FutureTech</div>
                    </div>
                </div>

                {/* right panel */}
                <div className="flex items-center justify-center bg-[#f8fafc] p-6 lg:p-10">
                    {/* Language switcher */}
                    <div className="fixed right-4 top-4 z-20 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setLang("vi")}
                            className={
                                lang === "vi"
                                    ? "rounded-md bg-[#0f2044] px-3 py-1 text-xs font-semibold text-white"
                                    : "rounded-md px-3 py-1 text-xs font-semibold text-[#9ca3af] hover:bg-gray-50"
                            }
                        >
                            VI
                        </button>
                        <button
                            type="button"
                            onClick={() => setLang("en")}
                            className={
                                lang === "en"
                                    ? "ml-1 rounded-md bg-[#0f2044] px-3 py-1 text-xs font-semibold text-white"
                                    : "ml-1 rounded-md px-3 py-1 text-xs font-semibold text-[#9ca3af] hover:bg-gray-50"
                            }
                        >
                            EN
                        </button>
                    </div>

                    <div className="w-full max-w-[380px]">
                        <h1 className="mb-3 text-[28px] font-[700] text-[#111827]">{copy.title}</h1>
                        <div className="mb-8 text-[14px] font-medium text-[#6b7280]">{copy.subtitle}</div>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-xl bg-white p-6 shadow-sm">
                            {/* account */}
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-gray-800">{copy.accountLabel}</label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                                        <IconUser className="h-5 w-5" />
                                    </span>
                                    <input
                                        {...register("account")}
                                        className={`${inputBase} ${inputFocus} ${errors.account ? inputError : ""} pl-10`}
                                        placeholder={lang === "en" ? "Your account" : "Nhập tài khoản"}
                                    />
                                </div>
                                {errors.account && <p className="mt-2 text-[12px] text-[#ef4444]">{errors.account.message}</p>}
                            </div>

                            {/* password */}
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-gray-800">{copy.passwordLabel}</label>
                                <div className="relative">
                                    <input
                                        {...register("password")}
                                        className={`${inputBase} ${inputFocus} ${errors.password ? inputError : ""} pr-12`}
                                        placeholder={lang === "en" ? "Your password" : "Nhập mật khẩu"}
                                        type={showPassword ? "text" : "password"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#1e3a6e] hover:bg-gray-50"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-2 text-[12px] text-[#ef4444]">{errors.password.message}</p>}
                            </div>

                            <div className="mb-6 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-[#1e3a6e] focus:ring-0"
                                        {...register("remember")}
                                        defaultChecked
                                    />
                                    <span>{copy.remember}</span>
                                </label>
                            </div>

                            <button
                                disabled={submitting}
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-md bg-[#1e3a6e] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1a3060] disabled:cursor-not-allowed disabled:opacity-60"
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

