/** Cấu hình ứng dụng — đọc từ .env.local */
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://p2-backend-1fme.onrender.com',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'TL Market',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const
