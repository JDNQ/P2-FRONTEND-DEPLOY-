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

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true)
    try {
      const res = await authApi.login(data)
      const { access_token, user } = res.data.data

      // Save to store + cookie
      setAuth(user, access_token)
      document.cookie = `tl_token=${access_token}; path=/; max-age=${7 * 24 * 3600}`
      document.cookie = `tl_role=${user.role}; path=/; max-age=${7 * 24 * 3600}`

      toast.success(`Chào mừng ${user.username}!`)

      // Redirect by role
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
    <div className="flex-1 flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Đăng nhập</h1>
          <p className="text-neutral-500 mt-2">Chào mừng trở lại TL Market!</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
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

          {/* Password */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/30 disabled:opacity-60"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Links */}
        <div className="flex justify-between text-sm">
          <Link href="/forgot-password" className="text-primary-500 hover:underline">
            Quên mật khẩu?
          </Link>
          <Link href="/register" className="text-primary-500 hover:underline">
            Tạo tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL - GRADIENT */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 flex-col items-center justify-center p-12 text-white">
        <div className="text-center max-w-md">
          <h1 className="font-heading text-5xl font-bold mb-4">TL Market</h1>
          <p className="text-lg text-primary-100 mb-8">Mua sắm thông minh, giao nhanh, đổi trả dễ</p>
          <div className="flex gap-2 justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-primary-200"></div>
            <div className="w-2 h-2 rounded-full bg-primary-200"></div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
