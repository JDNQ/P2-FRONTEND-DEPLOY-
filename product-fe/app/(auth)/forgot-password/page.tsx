'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    setIsSent(true)
  }

  const handleReset = () => {
    setIsSent(false)
    setEmail('')
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-be-vietnam text-m3-on-surface items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]"></div>
      </div>

      <main className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur p-8 md:p-10 rounded-[24px] shadow-sm border border-outline-variant/30 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6">
            <span className="font-heading text-4xl font-bold text-m3-primary">TL Market</span>
          </div>

          {!isSent ? (
            <>
              {/* Header */}
              <div className="text-center mb-6 space-y-2">
                <h1 className="font-bold text-2xl text-m3-on-surface">Quên mật khẩu?</h1>
                <p className="text-base text-m3-on-surface-variant max-w-[280px] mx-auto">
                  Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                  <label className="block font-medium text-sm text-m3-on-surface-variant mb-2 px-1" htmlFor="email">
                    Email hoặc Tên đăng nhập
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                    <input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                      className="block w-full pl-12 pr-4 py-3.5 border border-outline-variant bg-white rounded-xl text-m3-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:hover:scale-100"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Gửi liên kết đặt lại
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </>
                  )}
                </button>

                <Link
                  href="/login"
                  className="w-full py-3 rounded-xl font-medium text-sm text-m3-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors duration-200"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Quay lại Đăng nhập
                </Link>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
              </div>
              <h2 className="text-xl font-bold text-m3-on-surface">Đã gửi yêu cầu!</h2>
              <p className="text-base text-m3-on-surface-variant">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư đến (và cả hòm thư rác).
              </p>
              <button
                onClick={handleReset}
                className="font-medium text-sm text-m3-primary hover:underline"
              >
                Không nhận được? Gửi lại
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-xs text-m3-on-surface-variant">
          © 2024 TL Market. Cần hỗ trợ?{' '}
          <a className="text-m3-primary font-semibold hover:underline" href="#">
            Liên hệ kỹ thuật
          </a>
        </p>
      </main>
    </div>
  )
}
