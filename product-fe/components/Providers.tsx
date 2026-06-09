'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import { config } from '@/lib/config'

// Waking up the BE since Render free tier spins down after inactivity
function WakeUpBE() {
  useEffect(() => {
    const controller = new AbortController()
    fetch(`${config.apiUrl}/products?limit=1`, { signal: controller.signal, mode: 'no-cors' })
      .catch(() => {}) // silent wake-up
    return () => controller.abort()
  }, [])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <WakeUpBE />
      {children}
      <Toaster position="top-right" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
