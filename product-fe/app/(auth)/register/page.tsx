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
    if (!agreeTerms) { toast.error('Vui lòng đồng ý với điều khoản dịch vụ'); return }
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
    <main className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden bg-surface text-on-surface">
      {/* Left Side: Brand */}
      <section className="hidden md:flex md:w-1/2 flex-col justify-center items-center relative orange-gradient p-8 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-black/10 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-sm w-full flex flex-col items-center text-center">
          <div className="mb-8 animate-float">
            <div className="w-32 h-32 rounded-2xl bg-white/10 flex items-center justify-center shadow-2xl shadow-primary/30 p-3">
              <img src="/logo-removebg-preview.png" alt="TL Market" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="font-sora font-extrabold text-3xl text-white mb-4 leading-tight">
            Mua Sắm Thông Minh Tại <span className="text-orange-200">TL Market</span>
          </h1>
          <p className="text-white/80 text-sm mb-6">Khám phá hàng ngàn sản phẩm chất lượng với dịch vụ tận tâm.</p>
          <div className="grid grid-cols-1 gap-3 w-full">
            {[
              { icon: 'local_shipping', title: 'Giao hàng siêu tốc', desc: 'Nhận hàng trong ngày' },
              { icon: 'verified_user', title: 'Thanh toán bảo mật', desc: 'Đa dạng phương thức an toàn' },
              { icon: 'sell', title: 'Ưu đãi cực khủng', desc: 'Flash sales và Voucher mỗi ngày' },
            ].map((item) => (
              <div key={item.title} className="flex items-center p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <span className="material-symbols-outlined text-white mr-3 text-2xl">{item.icon}</span>
                <div className="text-left">
                  <h3 className="font-bold text-white text-sm">{item.title}</h3>
                  <p className="text-white/70 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Right Side: Form */}
      <section className="w-full md:w-1/2 min-h-screen flex flex-col justify-center px-6 py-8 sm:px-8 lg:px-16">
        <div className="max-w-sm w-full mx-auto" ref={formRef}>
          <div className="md:hidden flex justify-center mb-6 animate-entrance">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg shadow-primary/20 flex items-center justify-center p-2 border border-outline-variant/30">
              <img src="/logo-removebg-preview.png" alt="TL Market" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="mb-6 text-center md:text-left animate-entrance">
            <h2 className="font-sora font-bold text-2xl text-on-surface mb-1">Tạo tài khoản mới</h2>
            <p className="text-sm text-on-surface-variant">Tham gia cộng đồng TL Market ngay hôm nay.</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            <div className="animate-entrance space-y-1">
              <label className="block text-xs font-bold text-on-surface" htmlFor="username">Tên người dùng</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline text-lg">person</span>
                <input {...form.register('username')} id="username" placeholder="Nhập tên đăng nhập"
                  className="block w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm text-on-surface placeholder:text-outline-variant" />
              </div>
              {form.formState.errors.username && (
                <p className="text-xs text-error mt-0.5">{form.formState.errors.username.message}</p>
              )}
            </div>

            <div className="animate-entrance space-y-1">
              <label className="block text-xs font-bold text-on-surface" htmlFor="email">Email (Không bắt buộc)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline text-lg">mail</span>
                <input {...form.register('email')} id="email" type="email" placeholder="example@gmail.com"
                  className="block w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm text-on-surface placeholder:text-outline-variant" />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-error mt-0.5">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="animate-entrance space-y-1">
              <label className="block text-xs font-bold text-on-surface" htmlFor="password">Mật khẩu</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline text-lg">lock</span>
                <input {...form.register('password')} id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  className="block w-full pl-9 pr-9 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm text-on-surface placeholder:text-outline-variant" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-error mt-0.5">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="animate-entrance space-y-1">
              <label className="block text-xs font-bold text-on-surface" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline text-lg">lock_reset</span>
                <input {...form.register('confirmPassword')} id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••"
                  className="block w-full pl-9 pr-9 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm text-on-surface placeholder:text-outline-variant" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-error mt-0.5">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start mt-1 animate-entrance">
              <div className="flex items-center h-5">
                <input type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary-container bg-surface-container-low cursor-pointer" />
              </div>
              <label className="ml-2 text-xs text-on-surface-variant leading-tight cursor-pointer" htmlFor="terms">
                Tôi đồng ý với{' '}
                <span className="text-primary font-semibold hover:underline">Điều khoản dịch vụ</span> và{' '}
                <span className="text-primary font-semibold hover:underline">Chính sách bảo mật</span>.
              </label>
            </div>

            <div className="pt-2 animate-entrance">
              <button type="submit" disabled={isLoading}
                className="orange-gradient orange-glow w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang tạo tài khoản...
                  </span>
                ) : 'Đăng ký ngay'}
              </button>
            </div>

            <div className="relative flex items-center py-2 animate-entrance">
              <div className="flex-grow border-t border-outline-variant" />
              <span className="flex-shrink mx-3 text-outline-variant text-xs font-medium uppercase tracking-wider">Hoặc tiếp tục với</span>
              <div className="flex-grow border-t border-outline-variant" />
            </div>

            <div className="grid grid-cols-2 gap-3 animate-entrance">
              <button type="button" onClick={() => toast.info('Tính năng Google đang phát triển')}
                className="flex items-center justify-center py-2 px-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all text-xs font-semibold text-on-surface">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button type="button" onClick={() => toast.info('Tính năng Facebook đang phát triển')}
                className="flex items-center justify-center py-2 px-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all text-xs font-semibold text-on-surface">
                <svg className="w-4 h-4 mr-2 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-on-surface-variant font-medium animate-entrance">
              Bạn đã có tài khoản?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">Đăng nhập tại đây</Link>
            </p>
          </form>
        </div>
        <footer className="mt-6 text-center text-outline text-xs">
          <p>© 2024 TL Market. Bảo lưu mọi quyền.</p>
        </footer>
      </section>
    </main>
  )
}
