'use client'
import { useEffect } from 'react'
import { Suspense } from 'react'

function getHashValue(key: string): string | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash.replace(/^#/, '')
  for (const part of hash.split('&')) {
    const [k, v] = part.split('=')
    if (k === key) return decodeURIComponent(v)
  }
  return null
}

function CallbackHandler() {
  useEffect(() => {
    // Google implicit flow trả token trong URL fragment (#id_token=xxx), không phải query string
    const idToken =
      getHashValue('id_token')

    const error =
      new URLSearchParams(window.location.search).get('error') ||
      getHashValue('error')

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

    // Fallback: đọc từ query string (cho provider khác dùng code flow)
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      window.opener?.postMessage({ provider: 'google', token: code }, window.location.origin)
      window.close()
      return
    }

    window.close()
  }, [])

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
