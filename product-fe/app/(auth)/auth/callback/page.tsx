'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const idToken = searchParams.get('id_token')
    const error = searchParams.get('error')

    if (error) {
      window.opener?.postMessage({ provider: 'google', token: '' }, window.location.origin)
      window.close()
      return
    }

    if (idToken) {
      window.opener?.postMessage({ provider: 'google', token: idToken }, window.location.origin)
      window.close()
      return
    }

    router.push('/login')
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <span className="animate-spin h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full" />
        <p className="text-on-surface-variant text-sm">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-on-surface-variant text-sm">Đang tải...</div>}>
      <CallbackHandler />
    </Suspense>
  )
}
