'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterValues } from '@/lib/validations/authSchema'
import { authApi } from '@/lib/api/authApi'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: RegisterValues) => {
    if (!agreeTerms) {
      toast.error('Vui lòng đồng ý với điều khoản dịch vụ')
      return
    }
    setIsLoading(true)
    try {
      await authApi.register(data)
      toast.success('Tạo tài khoản thành công! Vui lòng đăng nhập.')
      router.push('/login')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Tạo tài khoản thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  // Entrance animation
  useEffect(() => {
    if (!formRef.current) return
    const elements = formRef.current.querySelectorAll('.animate-entrance')
    elements.forEach((el, index) => {
      const htmlEl = el as HTMLElement
      htmlEl.style.opacity = '0'
      htmlEl.style.transform = 'translateY(10px)'
      htmlEl.style.transition = 'all 0.4s ease-out'
      setTimeout(() => {
        htmlEl.style.opacity = '1'
        htmlEl.style.transform = 'translateY(0)'
      }, 100 * index)
    })
  }, [])

  return (
    <main className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden selection:bg-m3-primary-container selection:text-m3-on-primary-container">
      {/* Left Side: Brand Highlights */}
      <section className="hidden md:flex md:w-1/2 flex-col justify-center items-center relative brand-gradient px-gutter p-12 overflow-hidden border-r border-m3-outline-variant/30">
        {/* Decorative blur circles */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-m3-primary-fixed/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-m3-tertiary-fixed/30 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
          {/* Floating Logo */}
          <div className="mb-12 animate-float">
            <div className="h-48 md:h-64 flex items-center justify-center">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-3xl bg-white/10 flex items-center justify-center shadow-2xl shadow-m3-primary/30 p-4">
                <img src="/logo-removebg-preview.png" alt="TL Market" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          <h1 className="font-sora font-extrabold text-4xl lg:text-5xl text-m3-on-background mb-6 leading-tight">
            Mua Sắm Thông Minh Tại <span className="text-m3-primary">TL Market</span>
          </h1>
          <p className="text-m3-on-surface-variant text-lg mb-10 font-medium">
            Khám phá hàng ngàn sản phẩm với chất lượng hàng đầu và dịch vụ khách hàng tận tâm.
          </p>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 gap-6 w-full">
            <div className="flex items-center p-4 bg-m3-surface-container-lowest/80 backdrop-blur-md rounded-xl shadow-sm border border-m3-outline-variant/20 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-m3-primary/10 flex items-center justify-center text-m3-primary mr-4 shrink-0">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-m3-on-surface text-lg">Giao hàng siêu tốc</h3>
                <p className="text-m3-on-surface-variant text-sm">Nhận hàng trong ngày tại các thành phố lớn.</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-m3-surface-container-lowest/80 backdrop-blur-md rounded-xl shadow-sm border border-m3-outline-variant/20 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-m3-tertiary/10 flex items-center justify-center text-m3-tertiary mr-4 shrink-0">
                <span className="material-symbols-outlined text-3xl">verified_user</span>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-m3-on-surface text-lg">Thanh toán bảo mật</h3>
                <p className="text-m3-on-surface-variant text-sm">Hỗ trợ đa dạng phương thức thanh toán an toàn.</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-m3-surface-container-lowest/80 backdrop-blur-md rounded-xl shadow-sm border border-m3-outline-variant/20 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-m3-secondary/10 flex items-center justify-center text-m3-secondary mr-4 shrink-0">
                <span className="material-symbols-outlined text-3xl">sell</span>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-m3-on-surface text-lg">Ưu đãi cực khủng</h3>
                <p className="text-m3-on-surface-variant text-sm">Flash sales và Voucher độc quyền mỗi ngày.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Register Form */}
      <section className="w-full md:w-1/2 bg-m3-surface min-h-screen flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
        <div className="max-w-md w-full mx-auto" ref={formRef}>
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-8 animate-entrance">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg shadow-m3-primary/30 p-2">
              <img src="/logo-removebg-preview.png" alt="TL Market" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="mb-10 text-center md:text-left animate-entrance">
            <h2 className="font-sora font-bold text-3xl text-m3-on-surface mb-2">Tạo tài khoản mới</h2>
            <p className="text-m3-on-surface-variant">Tham gia cộng đồng TL Market ngay hôm nay.</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Field */}
            <div className="animate-entrance">
              <label className="block text-sm font-bold text-m3-on-surface mb-2" htmlFor="username">
                Tên người dùng
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-m3-outline group-focus-within:text-m3-primary transition-colors">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <input
                  {...form.register('username')}
                  id="username"
                  placeholder="Nhập tên đăng nhập của bạn"
                  className="block w-full pl-11 pr-4 py-3 bg-m3-surface-container-low border border-m3-outline-variant rounded-xl focus:ring-2 focus:ring-m3-primary focus:border-m3-primary transition-all duration-200 outline-none text-m3-on-surface placeholder:text-m3-outline-variant"
                />
              </div>
              {form.formState.errors.username && (
                <p className="text-sm text-m3-error mt-1">{form.formState.errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="animate-entrance">
              <label className="block text-sm font-bold text-m3-on-surface mb-2" htmlFor="email">
                Email (Không bắt buộc)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-m3-outline group-focus-within:text-m3-primary transition-colors">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <input
                  {...form.register('email')}
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="block w-full pl-11 pr-4 py-3 bg-m3-surface-container-low border border-m3-outline-variant rounded-xl focus:ring-2 focus:ring-m3-primary focus:border-m3-primary transition-all duration-200 outline-none text-m3-on-surface placeholder:text-m3-outline-variant"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-m3-error mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="animate-entrance">
              <label className="block text-sm font-bold text-m3-on-surface mb-2" htmlFor="password">
                Mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-m3-outline group-focus-within:text-m3-primary transition-colors">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <input
                  {...form.register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3 bg-m3-surface-container-low border border-m3-outline-variant rounded-xl focus:ring-2 focus:ring-m3-primary focus:border-m3-primary transition-all duration-200 outline-none text-m3-on-surface placeholder:text-m3-outline-variant"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-m3-outline hover:text-m3-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-m3-error mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="animate-entrance">
              <label className="block text-sm font-bold text-m3-on-surface mb-2" htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-m3-outline group-focus-within:text-m3-primary transition-colors">
                  <span className="material-symbols-outlined">lock_reset</span>
                </div>
                <input
                  {...form.register('confirmPassword')}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3 bg-m3-surface-container-low border border-m3-outline-variant rounded-xl focus:ring-2 focus:ring-m3-primary focus:border-m3-primary transition-all duration-200 outline-none text-m3-on-surface placeholder:text-m3-outline-variant"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-m3-outline hover:text-m3-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-m3-error mt-1">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start mt-2 animate-entrance">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-5 w-5 rounded border-m3-outline-variant text-m3-primary focus:ring-m3-primary-container bg-m3-surface-container-low cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="text-m3-on-surface-variant leading-tight" htmlFor="terms">
                  Tôi đồng ý với{' '}
                  <span className="text-m3-primary font-semibold hover:underline cursor-pointer">Điều khoản dịch vụ</span>
                  {' '}và{' '}
                  <span className="text-m3-primary font-semibold hover:underline cursor-pointer">Chính sách bảo mật</span>
                  {' '}của TL Market.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 animate-entrance">
              <button
                type="submit"
                disabled={isLoading}
                className="cta-gradient w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-m3-primary-container/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang tạo tài khoản...
                  </span>
                ) : (
                  'Đăng ký ngay'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-4 animate-entrance">
              <div className="flex-grow border-t border-m3-outline-variant" />
              <span className="flex-shrink mx-4 text-m3-outline-variant text-sm font-medium uppercase tracking-wider">
                Hoặc tiếp tục với
              </span>
              <div className="flex-grow border-t border-m3-outline-variant" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4 animate-entrance">
              <button
                type="button"
                onClick={() => toast.info('Tính năng đăng ký Google đang phát triển')}
                className="flex items-center justify-center py-3 px-4 border border-m3-outline-variant rounded-xl hover:bg-m3-surface-container-low transition-all duration-200 font-semibold text-m3-on-surface"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => toast.info('Tính năng đăng ký Facebook đang phát triển')}
                className="flex items-center justify-center py-3 px-4 border border-m3-outline-variant rounded-xl hover:bg-m3-surface-container-low transition-all duration-200 font-semibold text-m3-on-surface"
              >
                <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Login Link */}
            <p className="mt-8 text-center text-m3-on-surface-variant font-medium animate-entrance">
              Bạn đã có tài khoản?{' '}
              <Link href="/login" className="text-m3-primary font-bold hover:underline ml-1">
                Đăng nhập tại đây
              </Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-m3-outline text-sm">
          <p>© 2024 TL Market. Bảo lưu mọi quyền.</p>
        </footer>
      </section>
    </main>
  )
}
