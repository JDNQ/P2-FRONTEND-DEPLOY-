'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterValues } from '@/lib/validations/authSchema'
import { authApi } from '@/lib/api/authApi'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: RegisterValues) => {
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

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 flex-col items-center justify-center p-12 text-white">
        <div className="text-center max-w-md">
          <h1 className="font-heading text-5xl font-bold mb-4">TL Market</h1>
          <p className="text-lg text-primary-100 mb-8">Gia nhập cộng đồng mua sắm thông minh</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-neutral-900">Tạo tài khoản</h1>
            <p className="text-neutral-500 mt-2">Bắt đầu mua sắm ngay hôm nay!</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Tên đăng nhập</label>
              <input
                {...form.register('username')}
                placeholder="Nhập tên đăng nhập"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              {form.formState.errors.username && (
                <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Email (tùy chọn)</label>
              <input
                {...form.register('email')}
                type="email"
                placeholder="Nhập email"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Mật khẩu</label>
              <input
                {...form.register('password')}
                type="password"
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Xác nhận mật khẩu</label>
              <input
                {...form.register('confirmPassword')}
                type="password"
                placeholder="Xác nhận mật khẩu"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/30 disabled:opacity-60"
            >
              {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-neutral-600">Đã có tài khoản? </span>
            <Link href="/login" className="text-primary-500 hover:underline font-medium">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
