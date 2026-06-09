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
    <div className="flex-1 flex items-center justify-center bg-white px-6 py-8 overflow-y-auto">
      <div className="w-full max-w-sm space-y-6">
        <div className="lg:hidden flex justify-center mb-4">
          <img src="/logo-removebg-preview.png" alt="TL Market" className="h-8 w-auto" />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading font-bold text-2xl text-on-surface tracking-tight">Chào mừng trở lại!</h2>
          <p className="text-sm text-on-surface-variant">Đăng nhập để tiếp tục mua sắm.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs text-on-surface font-semibold" htmlFor="username">Tên đăng nhập</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">person</span>
                <input {...form.register('username')} id="username" placeholder="Nhập tên đăng nhập"
                  className="block w-full pl-9 pr-3 py-2.5 border border-outline-variant bg-surface-container-lowest rounded-xl text-sm text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-0 transition-all outline-none" />
              </div>
              {form.formState.errors.username && (
                <p className="text-xs text-red-500">{form.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-on-surface font-semibold" htmlFor="password">Mật khẩu</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                <input {...form.register('password')} id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  className="block w-full pl-9 pr-9 py-2.5 border border-outline-variant bg-surface-container-lowest rounded-xl text-sm text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-0 transition-all outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary-container border-outline-variant rounded transition-all" />
              <span className="text-xs text-on-surface-variant font-medium">Ghi nhớ tôi</span>
            </label>
            <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-fixed transition-colors">
              Quên mật khẩu?
            </Link>
          </div>

          <button type="submit" disabled={isLoading}
            className="orange-gradient orange-glow w-full flex justify-center items-center gap-2 py-2.5 font-sora text-sm font-bold rounded-xl text-white hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60">
            {isLoading ? (
              <><span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></span> Đang kết nối...</>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-on-surface-variant font-medium">Hoặc đăng nhập bằng</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => toast.info('Tính năng Google đang phát triển')}
            className="flex items-center justify-center gap-2 py-2 px-3 border border-outline-variant rounded-xl font-semibold text-xs text-on-surface hover:bg-surface-container-low transition-all active:scale-95">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button type="button" onClick={() => toast.info('Tính năng Facebook đang phát triển')}
            className="flex items-center justify-center gap-2 py-2 px-3 border border-outline-variant rounded-xl font-semibold text-xs text-on-surface hover:bg-surface-container-low transition-all active:scale-95">
            <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <p className="text-center text-xs text-on-surface-variant">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-bold text-primary hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-surface font-be-vietnam text-on-surface overflow-hidden">
      <section className="hidden lg:flex w-1/2 relative flex-col justify-between p-8 overflow-hidden orange-gradient">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-black opacity-10 rounded-full blur-2xl"></div>
        <div className="z-10">
          <h1 className="font-sora text-4xl font-extrabold text-white leading-tight tracking-tight">
            Trải Nghiệm<br />
            <span className="text-white/80">Mua Sắm Tương Lai.</span>
          </h1>
          <p className="text-base text-white/90 max-w-md mt-4 leading-relaxed">
            Hàng triệu sản phẩm chính hãng, giao hàng nhanh chóng và ưu đãi mỗi ngày tại TL Market.
          </p>
        </div>
        <div className="z-10 flex items-center justify-center">
          <div className="w-full max-w-xs aspect-square p-3 rounded-[1.5rem] shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="w-full h-full rounded-[1rem] bg-gradient-to-br from-[#fda86b] to-[#ea580c] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-white text-6xl opacity-40">shopping_bag</span>
            </div>
          </div>
        </div>
        <div className="z-10">
          <p className="text-white/60 text-xs">© 2024 TL Market. Bản quyền thuộc về TL.</p>
        </div>
      </section>
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
