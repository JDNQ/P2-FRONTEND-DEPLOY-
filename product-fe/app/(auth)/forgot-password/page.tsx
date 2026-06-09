'use client'
import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    setIsSent(true)
    toast.success('Đã gửi yêu cầu đặt lại mật khẩu!')
  }

  return (
    <div className="min-h-screen bg-surface font-body antialiased flex items-center justify-center p-4">
      <main className="w-full max-w-5xl bg-surface-container-lowest rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[600px] shadow-xl">
        {/* Left: Branding Panel */}
        <section className="hidden md:flex md:w-5/12 relative flex-col justify-between p-12 text-white orange-gradient">
          <div className="relative z-10">
            <img src="/logo-removebg-preview.png" alt="TL Market" className="h-16 w-auto mb-12 brightness-0 invert" />
            <h1 className="font-sora text-4xl font-bold leading-tight mb-4">
              Bảo vệ <br />tài khoản của bạn.
            </h1>
            <p className="text-lg opacity-90 max-w-xs">
              Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập chỉ trong vài bước đơn giản.
            </p>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">verified_user</span>
              </div>
              <div>
                <p className="text-sm font-bold">An toàn &amp; Bảo mật</p>
                <p className="text-xs opacity-80">Dữ liệu của bạn được mã hóa 256-bit</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
          </div>
        </section>

        {/* Right: Form Panel */}
        <section className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-surface relative">
          <div className="md:hidden flex justify-center mb-8">
            <img src="/logo-removebg-preview.png" alt="TL Market" className="h-12 w-auto" />
          </div>

          <div className="transition-all duration-300">
            {!isSent ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="font-sora text-3xl font-bold text-on-surface">Quên mật khẩu?</h2>
                  <p className="text-on-surface-variant leading-relaxed">
                    Nhập email hoặc tên đăng nhập liên kết với tài khoản của bạn. Chúng tôi sẽ gửi một liên kết để đặt lại mật khẩu.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="identifier">
                      Email hoặc Tên đăng nhập
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                      <input id="identifier" type="text" value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)} placeholder="example@gmail.com" required
                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-base text-on-surface" />
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="w-full py-4 orange-gradient text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:brightness-110 hover:shadow-lg disabled:opacity-70 group">
                    <span>{isLoading ? 'Đang xử lý...' : 'Gửi liên kết đặt lại'}</span>
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-0.5">arrow_forward</span>
                    )}
                  </button>
                </form>

                <div className="flex flex-col items-center">
                  <Link href="/login" className="flex items-center gap-2 text-primary font-bold text-sm hover:underline group transition-all">
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-0.5">arrow_back</span>
                    Quay lại Đăng nhập
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-8 text-center py-4">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                </div>
                <div className="space-y-2">
                  <h2 className="font-sora text-3xl font-bold text-on-surface">Kiểm tra Email</h2>
                  <p className="text-on-surface-variant leading-relaxed">
                    Chúng tôi đã gửi liên kết đặt lại mật khẩu đến <br />
                    <strong className="text-on-surface">{identifier}</strong>
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-4">
                  <button onClick={() => { setIsSent(false); setIdentifier('') }}
                    className="w-full py-4 bg-surface-container-high text-on-surface-variant font-bold rounded-xl hover:bg-surface-variant transition-colors active:scale-[0.98]">
                    Chưa nhận được email? Gửi lại
                  </button>
                  <Link href="/login" className="flex items-center justify-center gap-2 text-primary font-bold text-sm hover:underline">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Quay lại Đăng nhập
                  </Link>
                </div>
              </div>
            )}
          </div>

          <footer className="mt-auto pt-12 border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
            <p>© 2024 TL Market. All rights reserved.</p>
            <button onClick={() => toast.success('Đang kết nối với hỗ trợ kỹ thuật...')}
              className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium bg-transparent border-none outline-none">
              <span className="material-symbols-outlined text-sm">headphones</span>
              Liên hệ kỹ thuật
            </button>
          </footer>
        </section>
      </main>
    </div>
  )
}
