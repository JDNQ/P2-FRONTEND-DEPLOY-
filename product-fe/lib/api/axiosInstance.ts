import axios from 'axios'
import { config } from '@/lib/config'

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 120000, // 120s - Render free tier cold start có thể mất 30-60s
  headers: { 'Content-Type': 'application/json' },
})

// Attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tl_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('tl_access_token')
      localStorage.removeItem('tl_user')
      document.cookie = 'tl_token=; path=/; max-age=0'
      document.cookie = 'tl_role=; path=/; max-age=0'
      const path = window.location.pathname
      const authPaths = ['/login', '/register', '/forgot-password']
      if (!authPaths.some((p) => path.startsWith(p))) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
