'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginValues } from '@/lib/validations/authSchema'
import { authApi } from '@/lib/api/authApi'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useState, Suspense } from 'react'
import Link from 'next/link'

function LoginForm() {
  const { setAuth } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/'
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true)
    try {
      const res = await authApi.login(data)
      const { access_token, user } = res.data.data

      setAuth(user, access_token)
      document.cookie = `tl_token=${access_token}; path=/; max-age=${7 * 24 * 3600}`
      document.cookie = `tl_role=${user.role}; path=/; max-age=${7 * 24 * 3600}`

      toast.success(`Chào mừng ${user.username}!`)

      if (user.role === 'MANAGER') router.push('/dashboard/manager')
      else if (user.role === 'ADMIN') router.push('/dashboard/admin')
      else router.push(from)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-m3-on-background px-6 py-12 overflow-y-auto">
      <div className="w-full max-w-md space-y-8">
        {/* Mobile Logo */}
        <div className="lg:hidden flex justify-center mb-6">
          <img src="/logo-removebg-preview.png" alt="TL Market" className="h-10 w-auto" />
        </div>

        <div className="space-y-2">
          <h2 className="font-sora text-3xl font-bold text-m3-on-background tracking-tight">
            Chào mừng trở lại!
          </h2>
          <p className="text-m3-on-surface-variant">
            Vui lòng đăng nhập để tiếp tục hành trình mua sắm của bạn.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm text-m3-on-surface font-semibold" htmlFor="username">
                Tên đăng nhập hoặc Email
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-m3-outline group-focus-within:text-m3-primary transition-colors text-[20px]">
                  person
                </span>
                <input
                  {...form.register('username')}
                  id="username"
                  placeholder="Nhập tên đăng nhập"
                  className="block w-full pl-12 pr-4 py-3.5 border border-m3-outline-variant bg-m3-surface-container-lowest rounded-xl text-m3-on-surface placeholder:text-m3-outline-variant focus:border-m3-primary focus:ring-0 transition-all duration-200"
                />
              </div>
              {form.formState.errors.username && (
                <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm text-m3-on-surface font-semibold" htmlFor="password">
                Mật khẩu
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-m3-outline group-focus-within:text-m3-primary transition-colors text-[20px]">
                  lock
                </span>
                <input
                  {...form.register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-12 py-3.5 border border-m3-outline-variant bg-m3-surface-container-lowest rounded-xl text-m3-on-surface placeholder:text-m3-outline-variant focus:border-m3-primary focus:ring-0 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-m3-outline hover:text-m3-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-5 w-5 text-m3-primary focus:ring-m3-primary-container border-m3-outline-variant rounded transition-all"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-m3-on-surface-variant font-medium cursor-pointer">
                Ghi nhớ tôi
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-m3-primary hover:text-m3-primary-container transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center gap-2 py-3.5 font-sora text-lg font-bold rounded-xl text-white bg-m3-primary hover:bg-m3-primary-container transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></span>
                Đang kết nối...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-white/40 group-hover:text-white/60 transition-colors text-[20px]">
                  login
                </span>
                Đăng nhập ngay
              </>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-m3-outline-variant"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-m3-on-surface-variant font-medium">
              Hoặc đăng nhập bằng
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => toast.info('Tính năng đăng nhập Google đang phát triển')}
            className="flex items-center justify-center gap-2 py-3 px-4 border border-m3-outline-variant rounded-xl font-semibold text-m3-on-surface hover:bg-m3-surface-container-low transition-all duration-200 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => toast.info('Tính năng đăng nhập Facebook đang phát triển')}
            className="flex items-center justify-center gap-2 py-3 px-4 border border-m3-outline-variant rounded-xl font-semibold text-m3-on-surface hover:bg-m3-surface-container-low transition-all duration-200 active:scale-95"
          >
            <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <p className="text-center text-m3-on-surface-variant">
          Chưa có tài khoản?{' '}
          <Link
            href="/register"
            className="font-bold text-m3-primary hover:underline underline-offset-4 decoration-2 transition-all"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full bg-m3-surface font-be-vietnam text-m3-on-surface overflow-hidden">
      {/* Left Side: Brand Intro */}
      <section className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-black opacity-10 rounded-full blur-2xl"></div>

        <div className="z-10 flex flex-col items-start gap-6">
          <h1 className="font-sora text-6xl font-extrabold text-white leading-tight tracking-tight">
            Trải Nghiệm<br />
            <span className="text-white/80">Mua Sắm Tương Lai.</span>
          </h1>
          <p className="text-xl text-white/90 max-w-lg leading-relaxed">
            Hàng triệu sản phẩm từ các thương hiệu hàng đầu, giao hàng nhanh chóng và ưu đãi độc quyền mỗi ngày chỉ có tại TL Market.
          </p>
        </div>

        <div className="z-10 flex flex-col items-center">
          <div className="w-full max-w-md aspect-square p-4 rounded-[2rem] shadow-2xl relative"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div className="w-full h-full rounded-[1.5rem] bg-gradient-to-br from-[#fda86b] to-[#ea580c] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-white text-8xl opacity-40">shopping_bag</span>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-float">
              <div className="bg-m3-primary-container p-2 rounded-lg text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-white">local_fire_department</span>
              </div>
              <div>
                <p className="font-bold text-m3-on-surface text-sm">Flash Sale</p>
                <p className="text-m3-on-surface-variant text-xs">Giảm tới 50% hôm nay</p>
              </div>
            </div>
          </div>
        </div>

        <div className="z-10">
          <p className="text-white/60 text-sm">© 2024 TL Market. Bản quyền thuộc về đội ngũ phát triển TL.</p>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center text-m3-on-surface-variant">
            Đang tải...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
