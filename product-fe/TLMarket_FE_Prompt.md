# 🛒 PROMPT HOÀN CHỈNH — BUILD FRONTEND TL MARKET
> Copy toàn bộ prompt này và paste vào AI Assistant / Cursor / Claude để bắt đầu build

---

## 🎯 YÊU CẦU TỔNG QUAN

Hãy build hoàn chỉnh Frontend cho **TL Market** — nền tảng thương mại điện tử (tương tự Shopee, Tiki) sử dụng **Next.js 14+ App Router**.

### Thông tin hạ tầng
- **Backend API**: `https://p2-backend-1fme.onrender.com` (NestJS, đã deploy)
- **API Docs**: `https://p2-backend-1fme.onrender.com/api` (Swagger UI)
- **Image Storage**: Cloudinary (upload qua BE endpoint)
- **Database**: PostgreSQL trên Aiven (BE quản lý, FE không kết nối trực tiếp)
- **Package Manager**: **yarn** (bắt buộc, không dùng npm/pnpm)

---

## 🧱 TECH STACK

```bash
# 1. Tạo project
yarn create next-app tl-market --typescript --tailwind --app --src-dir --import-alias "@/*"
cd tl-market

# 2. Cài dependencies
yarn add axios \
  @tanstack/react-query @tanstack/react-query-devtools \
  zustand \
  react-hook-form zod @hookform/resolvers \
  framer-motion \
  lucide-react \
  date-fns \
  recharts \
  @tiptap/react @tiptap/starter-kit \
  @tanstack/react-table \
  @tanstack/react-virtual \
  canvas-confetti \
  clsx tailwind-merge \
  sonner

yarn add -D @types/canvas-confetti

# 3. Cài shadcn/ui
yarn dlx shadcn-ui@latest init
# Chọn: Default style, Slate base color, CSS variables: yes

# Cài các components cần thiết
yarn dlx shadcn-ui@latest add button input label card badge \
  dialog drawer sheet tabs select checkbox radio-group \
  dropdown-menu avatar skeleton progress separator \
  command popover tooltip switch slider table \
  form alert-dialog scroll-area
```

### File `.env.local`
```env
NEXT_PUBLIC_API_URL=https://p2-backend-1fme.onrender.com
NEXT_PUBLIC_APP_NAME=TL Market
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body)', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#fff4ed',
          100: '#ffe6d5',
          200: '#fecba8',
          300: '#fda86b',
          400: '#fb8c3a',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        'flash-sale': '#ff2d2d',
        gold: '#f59e0b',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.3s ease',
        'countdown-flip': 'flip 0.5s ease',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        flip: {
          '0%': { transform: 'rotateX(0)' },
          '50%': { transform: 'rotateX(-90deg)' },
          '100%': { transform: 'rotateX(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

### `src/app/layout.tsx` (Root Layout)
```typescript
import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Sora } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'TL Market — Mua sắm thông minh', template: '%s | TL Market' },
  description: 'Nền tảng thương mại điện tử uy tín — Hàng chính hãng, giao nhanh, đổi trả dễ dàng',
  keywords: ['mua sắm online', 'thương mại điện tử', 'TL Market'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'TL Market',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${beVietnamPro.variable} ${sora.variable} font-body antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### `src/components/Providers.tsx`
```typescript
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

---

## 📁 CẤU TRÚC THƯ MỤC ĐẦY ĐỦ

Tạo đúng cấu trúc này:

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   │
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx
│   │   │   └── success/
│   │   │       └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── wishlist/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── notifications/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       ├── admin/
│   │       │   ├── page.tsx
│   │       │   ├── products/
│   │       │   │   ├── page.tsx
│   │       │   │   ├── new/
│   │       │   │   │   └── page.tsx
│   │       │   │   └── [id]/
│   │       │   │       └── edit/
│   │       │   │           └── page.tsx
│   │       │   ├── orders/
│   │       │   │   └── page.tsx
│   │       │   └── vouchers/
│   │       │       └── page.tsx
│   │       └── manager/
│   │           ├── page.tsx
│   │           ├── orders/
│   │           │   └── page.tsx
│   │           └── users/
│   │               └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── ui/                      ← shadcn (auto-generated)
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── MobileBottomNav.tsx
│   │   └── AnnouncementBar.tsx
│   │
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductCardSkeleton.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilter.tsx
│   │   ├── ProductSort.tsx
│   │   ├── ProductImageGallery.tsx
│   │   ├── VariantSelector.tsx
│   │   ├── QuantityInput.tsx
│   │   └── StockBadge.tsx
│   │
│   ├── home/
│   │   ├── HeroBanner.tsx
│   │   ├── FlashSaleSection.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── VoucherCarousel.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── CategoryQuickAccess.tsx
│   │   ├── RecentlyViewed.tsx
│   │   └── TrendingSearch.tsx
│   │
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   ├── VoucherInput.tsx
│   │   └── EmptyCart.tsx
│   │
│   ├── checkout/
│   │   ├── CheckoutStepper.tsx
│   │   ├── ShippingForm.tsx
│   │   └── OrderSummaryPanel.tsx
│   │
│   ├── order/
│   │   ├── OrderCard.tsx
│   │   ├── OrderStatusBadge.tsx
│   │   └── OrderTimeline.tsx
│   │
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── OrdersDataTable.tsx
│   │   └── ProductsDataTable.tsx
│   │
│   └── common/
│       ├── Breadcrumb.tsx
│       ├── Pagination.tsx
│       ├── EmptyState.tsx
│       ├── ConfirmModal.tsx
│       ├── ImageUpload.tsx
│       ├── LoadingSpinner.tsx
│       └── SearchBar.tsx
│
├── lib/
│   ├── api/
│   │   ├── axiosInstance.ts
│   │   ├── authApi.ts
│   │   ├── productApi.ts
│   │   ├── cartApi.ts
│   │   ├── orderApi.ts
│   │   ├── voucherApi.ts
│   │   ├── shopApi.ts
│   │   ├── userApi.ts
│   │   └── uploadApi.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProducts.ts
│   │   ├── useCart.ts
│   │   ├── useOrders.ts
│   │   ├── useVouchers.ts
│   │   ├── useShops.ts
│   │   ├── useUsers.ts
│   │   ├── usePermission.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── validations/
│   │   ├── authSchema.ts
│   │   ├── productSchema.ts
│   │   ├── orderSchema.ts
│   │   └── voucherSchema.ts
│   │
│   └── utils/
│       ├── formatPrice.ts
│       ├── formatDate.ts
│       └── cn.ts
│
├── stores/
│   ├── authStore.ts
│   ├── cartStore.ts
│   ├── compareStore.ts
│   └── uiStore.ts
│
├── types/
│   ├── auth.ts
│   ├── product.ts
│   ├── cart.ts
│   ├── order.ts
│   ├── voucher.ts
│   ├── shop.ts
│   └── api.ts
│
└── middleware.ts
```

---

## 🌐 BACKEND API — ENDPOINTS THỰC TẾ

Base URL: `https://p2-backend-1fme.onrender.com`
Authorization: `Bearer <JWT_token>` trong header

### AUTH
```
POST /auth/register        → Đăng ký
POST /auth/login           → Đăng nhập → trả về { access_token, user }
POST /auth/create-manager  → Tạo Manager (ADMIN only)
```

### PRODUCTS
```
GET    /products           → Tất cả sản phẩm + variants
POST   /products           → Tạo sản phẩm (cần auth)
GET    /products/:id       → 1 sản phẩm theo id
PATCH  /products/:id       → Cập nhật sản phẩm (cần auth)
DELETE /products/:id       → Xóa sản phẩm (cần auth)
```

### UPLOAD (Cloudinary)
```
POST /upload/product-images  → Upload nhiều ảnh (field: "files", max 10) → { urls: string[] }
POST /upload/variant-image   → Upload 1 ảnh (field: "file") → { url: string }
```

### SHOPS
```
GET  /shops     → Tất cả shops
POST /shops     → Tạo shop
GET  /shops/my  → Shop của mình
```

### CART
```
GET    /cart        → Giỏ hàng + tổng giá
POST   /cart        → Thêm item
PATCH  /cart/:id    → Cập nhật qty
DELETE /cart/:id    → Xóa 1 item
DELETE /cart        → Xóa tất cả
```

### ORDERS
```
POST   /orders           → Tạo đơn hàng (USER)
GET    /orders           → Tất cả đơn (ADMIN)
GET    /orders/my        → Đơn của mình (USER)
GET    /orders/:id       → Chi tiết 1 đơn (USER - chỉ đơn của mình)
PATCH  /orders/:id/status → Cập nhật trạng thái (ADMIN/MANAGER)
```

### VOUCHERS
```
GET   /vouchers              → Danh sách voucher active
POST  /vouchers              → Tạo voucher (ADMIN only)
GET   /vouchers/:code        → Tìm voucher theo code
POST  /vouchers/apply        → Áp dụng voucher { code, orderTotal }
PATCH /vouchers/:id/deactivate → Deactivate voucher (ADMIN only)
```

### USERS
```
GET    /users       → Tất cả users (ADMIN/MANAGER)
DELETE /users/:id   → Xóa user (ADMIN/MANAGER)
```

---

## 📦 TYPESCRIPT TYPES

### `src/types/api.ts`
```typescript
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}
```

### `src/types/auth.ts`
```typescript
export type UserRole = 'USER' | 'ADMIN' | 'MANAGER'

export interface User {
  id: number
  username: string
  email?: string
  role: UserRole
}

export interface LoginResponse {
  access_token: string
  user: User
}
```

### `src/types/product.ts`
```typescript
export interface Variant {
  id: number
  variantName: string
  extraPrice: number
  stock: number
  image?: string
}

export interface ProductImage {
  url: string
  isPrimary: boolean
}

export interface Product {
  id: number
  productName: string
  description?: string | null
  basePrice: number
  shopId: number
  variants: Variant[]
  images: ProductImage[]
  createdAt: string
  updatedAt: string
}

export interface CreateVariantDto {
  variantName: string
  extraPrice: number
  stock: number
  image?: string
}

export interface ProductImageDto {
  url: string
  isPrimary: boolean
}

export interface CreateProductDto {
  productName: string
  description?: string | null
  basePrice: number
  shopId: number
  variants: CreateVariantDto[]
  images?: ProductImageDto[]
}
```

### `src/types/cart.ts`
```typescript
export interface CartItem {
  id: number
  quantity: number
  productId: number
  variantId: number
  product: Product
  variant: Variant
}

export interface CartData {
  items: CartItem[]
  totalPrice: number
}

export interface AddToCartDto {
  productId: number
  variantId: number
  quantity?: number
}
```

### `src/types/order.ts`
```typescript
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: number
  productId: number
  variantId: number
  quantity: number
  price: number
  product?: Product
  variant?: Variant
}

export interface Order {
  id: number
  status: OrderStatus
  items: OrderItem[]
  totalPrice: number
  voucherCode?: string
  note?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderDto {
  items: { productId: number; variantId: number; quantity: number }[]
  voucherCode?: string
  note?: string
}

export interface UpdateOrderStatusDto {
  status: OrderStatus
}
```

### `src/types/voucher.ts`
```typescript
export type DiscountType = 'PERCENT' | 'FIXED'

export interface Voucher {
  id: number
  code: string
  description?: string
  discountType: DiscountType
  discountValue: number
  minOrderValue?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  isActive: boolean
  expiresAt?: string
}

export interface CreateVoucherDto {
  code: string
  description?: string
  discountType: DiscountType
  discountValue: number
  minOrderValue?: number
  maxDiscount?: number
  usageLimit?: number
  expiresAt?: string
}
```

### `src/types/shop.ts`
```typescript
export interface Shop {
  id: number
  shopName: string
  description?: string
  ownerId: number
  createdAt: string
}

export interface CreateShopDto {
  shopName: string
  description?: string
}
```

---

## 🔧 CORE SETUP FILES

### `src/lib/utils/cn.ts`
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `src/lib/utils/formatPrice.ts`
```typescript
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

export function formatPriceShort(price: number): string {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}tr`
  if (price >= 1_000) return `${(price / 1_000).toFixed(0)}k`
  return `${price}đ`
}

export function calcDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}
```

### `src/lib/utils/formatDate.ts`
```typescript
import { format, formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: vi })
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'HH:mm dd/MM/yyyy', { locale: vi })
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi })
}
```

### `src/lib/api/axiosInstance.ts`
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
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
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tl_access_token')
        localStorage.removeItem('tl_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## 📋 ZOD SCHEMAS + ZODRESOLVER

### `src/lib/validations/authSchema.ts`
```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Tên đăng nhập tối thiểu 3 ký tự')
      .max(50, 'Tối đa 50 ký tự')
      .regex(/^[a-zA-Z0-9_]+$/, 'Chỉ dùng chữ cái, số, dấu gạch dưới'),
    email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
```

### `src/lib/validations/productSchema.ts`
```typescript
import { z } from 'zod'

export const variantSchema = z.object({
  variantName: z.string().min(1, 'Không được để trống'),
  extraPrice: z.coerce.number().min(0, 'Phải >= 0'),
  stock: z.coerce.number().min(0, 'Phải >= 0'),
  image: z.string().url().optional().or(z.literal('')),
})

export const productSchema = z.object({
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional(),
  basePrice: z.coerce.number().min(1000, 'Giá tối thiểu 1.000đ'),
  shopId: z.coerce.number().min(1, 'Vui lòng chọn shop'),
  variants: z.array(variantSchema).min(1, 'Cần ít nhất 1 phân loại'),
})

export type ProductValues = z.infer<typeof productSchema>
```

### `src/lib/validations/orderSchema.ts`
```typescript
import { z } from 'zod'

export const createOrderSchema = z.object({
  items: z
    .array(z.object({
      productId: z.number(),
      variantId: z.number(),
      quantity: z.number().min(1, 'Số lượng tối thiểu 1'),
    }))
    .min(1, 'Giỏ hàng trống'),
  voucherCode: z.string().optional(),
  note: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
})

export type CreateOrderValues = z.infer<typeof createOrderSchema>
```

### `src/lib/validations/voucherSchema.ts`
```typescript
import { z } from 'zod'

export const createVoucherSchema = z
  .object({
    code: z
      .string()
      .min(3, 'Mã tối thiểu 3 ký tự')
      .regex(/^[A-Z0-9]+$/, 'Chỉ dùng chữ in hoa và số')
      .transform((v) => v.toUpperCase()),
    description: z.string().optional(),
    discountType: z.enum(['PERCENT', 'FIXED']),
    discountValue: z.coerce.number().min(1, 'Phải > 0'),
    minOrderValue: z.coerce.number().min(0).optional(),
    maxDiscount: z.coerce.number().min(0).optional(),
    usageLimit: z.coerce.number().min(1).optional(),
    expiresAt: z.string().optional(),
  })
  .refine(
    (d) => !(d.discountType === 'PERCENT' && d.discountValue > 100),
    { message: 'Phần trăm giảm không vượt quá 100%', path: ['discountValue'] }
  )

export type CreateVoucherValues = z.infer<typeof createVoucherSchema>
```

---

## 🏪 ZUSTAND STORES

### `src/stores/authStore.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/auth'
import api from '@/lib/api/axiosInstance'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('tl_access_token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        set({ user, token, isAuthenticated: true })
      },
      clearAuth: () => {
        localStorage.removeItem('tl_access_token')
        delete api.defaults.headers.common['Authorization']
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    { name: 'tl_auth', partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) }
  )
)
```

### `src/stores/cartStore.ts`
```typescript
import { create } from 'zustand'

interface CartStore {
  count: number
  setCount: (count: number) => void
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
  reset: () => set({ count: 0 }),
}))
```

### `src/stores/compareStore.ts`
```typescript
import { create } from 'zustand'
import type { Product } from '@/types/product'
import { toast } from 'sonner'

interface CompareStore {
  products: Product[]
  add: (p: Product) => void
  remove: (id: number) => void
  clear: () => void
  isInCompare: (id: number) => boolean
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  products: [],
  add: (p) => {
    if (get().products.length >= 3) {
      toast.error('Chỉ so sánh tối đa 3 sản phẩm')
      return
    }
    if (get().isInCompare(p.id)) return
    set((s) => ({ products: [...s.products, p] }))
  },
  remove: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
  clear: () => set({ products: [] }),
  isInCompare: (id) => get().products.some((p) => p.id === id),
}))
```

---

## 🔗 API FUNCTIONS

### `src/lib/api/authApi.ts`
```typescript
import api from './axiosInstance'
import type { ApiResponse } from '@/types/api'
import type { LoginResponse } from '@/types/auth'
import type { LoginValues, RegisterValues } from '@/lib/validations/authSchema'

export const authApi = {
  login: (data: LoginValues) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', data),

  register: (data: RegisterValues) =>
    api.post<ApiResponse<unknown>>('/auth/register', {
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
      email: data.email || undefined,
    }),

  createManager: (data: { username: string; password: string; email?: string }) =>
    api.post('/auth/create-manager', data),
}
```

### `src/lib/api/productApi.ts`
```typescript
import api from './axiosInstance'
import type { Product, CreateProductDto } from '@/types/product'
import type { ApiResponse } from '@/types/api'

export const productApi = {
  getAll: () =>
    api.get<ApiResponse<Product[]>>('/products'),

  getOne: (id: number) =>
    api.get<ApiResponse<Product>>(`/products/${id}`),

  create: (data: CreateProductDto) =>
    api.post<ApiResponse<Product>>('/products', data),

  update: (id: number, data: Partial<CreateProductDto>) =>
    api.patch<ApiResponse<Product>>(`/products/${id}`, data),

  delete: (id: number) =>
    api.delete(`/products/${id}`),
}
```

### `src/lib/api/cartApi.ts`
```typescript
import api from './axiosInstance'
import type { CartData, AddToCartDto } from '@/types/cart'
import type { ApiResponse } from '@/types/api'

export const cartApi = {
  get: () => api.get<ApiResponse<CartData>>('/cart'),

  add: (data: AddToCartDto) => api.post('/cart', data),

  update: (id: number, quantity: number) =>
    api.patch(`/cart/${id}`, { quantity }),

  remove: (id: number) => api.delete(`/cart/${id}`),

  clear: () => api.delete('/cart'),
}
```

### `src/lib/api/orderApi.ts`
```typescript
import api from './axiosInstance'
import type { Order, CreateOrderDto, UpdateOrderStatusDto } from '@/types/order'
import type { ApiResponse } from '@/types/api'

export const orderApi = {
  create: (data: CreateOrderDto) =>
    api.post<ApiResponse<Order>>('/orders', data),

  getAll: () => api.get<ApiResponse<Order[]>>('/orders'),  // Admin

  getMy: () => api.get<ApiResponse<Order[]>>('/orders/my'),

  getOne: (id: number) => api.get<ApiResponse<Order>>(`/orders/${id}`),

  updateStatus: (id: number, data: UpdateOrderStatusDto) =>
    api.patch<ApiResponse<Order>>(`/orders/${id}/status`, data),
}
```

### `src/lib/api/voucherApi.ts`
```typescript
import api from './axiosInstance'
import type { Voucher, CreateVoucherDto } from '@/types/voucher'
import type { ApiResponse } from '@/types/api'

export const voucherApi = {
  getAll: () => api.get<ApiResponse<Voucher[]>>('/vouchers'),

  getByCode: (code: string) =>
    api.get<ApiResponse<Voucher>>(`/vouchers/${code}`),

  apply: (code: string, orderTotal: number) =>
    api.post<ApiResponse<{ discount: number; finalPrice: number }>>('/vouchers/apply', { code, orderTotal }),

  create: (data: CreateVoucherDto) =>
    api.post<ApiResponse<Voucher>>('/vouchers', data),

  deactivate: (id: number) =>
    api.patch(`/vouchers/${id}/deactivate`),
}
```

### `src/lib/api/uploadApi.ts`
```typescript
import api from './axiosInstance'

export const uploadApi = {
  // Upload nhiều ảnh sản phẩm (max 10) → trả { urls: string[] }
  productImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const { data } = await api.post('/upload/product-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.urls
  },

  // Upload 1 ảnh variant → trả { url: string }
  variantImage: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/upload/variant-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.url
  },
}
```

---

## 🎣 TANSTACK QUERY HOOKS

### `src/lib/hooks/useProducts.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi } from '@/lib/api/productApi'
import { toast } from 'sonner'

export const productKeys = {
  all: ['products'] as const,
  one: (id: number) => ['products', id] as const,
}

export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: async () => {
      const { data } = await productApi.getAll()
      return data.data
    },
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.one(id),
    queryFn: async () => {
      const { data } = await productApi.getOne(id)
      return data.data
    },
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Tạo sản phẩm thành công!')
    },
    onError: () => toast.error('Tạo sản phẩm thất bại'),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => productApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: productKeys.all })
      qc.invalidateQueries({ queryKey: productKeys.one(id) })
      toast.success('Cập nhật thành công!')
    },
    onError: () => toast.error('Cập nhật thất bại'),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Đã xóa sản phẩm')
    },
    onError: () => toast.error('Xóa thất bại'),
  })
}
```

### `src/lib/hooks/useCart.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '@/lib/api/cartApi'
import { useCartStore } from '@/stores/cartStore'
import { toast } from 'sonner'

export const CART_KEY = ['cart']

export function useCart() {
  const setCount = useCartStore((s) => s.setCount)
  return useQuery({
    queryKey: CART_KEY,
    queryFn: async () => {
      const { data } = await cartApi.get()
      const total = data.data.items.reduce((sum, i) => sum + i.quantity, 0)
      setCount(total)
      return data.data
    },
  })
}

export function useAddToCart() {
  const qc = useQueryClient()
  const increment = useCartStore((s) => s.increment)
  return useMutation({
    mutationFn: cartApi.add,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY })
      increment()
      toast.success('Đã thêm vào giỏ hàng! 🛒')
    },
    onError: () => toast.error('Không thể thêm vào giỏ'),
  })
}

export function useUpdateCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartApi.update(id, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
    onError: () => toast.error('Cập nhật thất bại'),
  })
}

export function useRemoveCartItem() {
  const qc = useQueryClient()
  const decrement = useCartStore((s) => s.decrement)
  return useMutation({
    mutationFn: cartApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY })
      decrement()
    },
    onError: () => toast.error('Xóa thất bại'),
  })
}

export function useClearCart() {
  const qc = useQueryClient()
  const reset = useCartStore((s) => s.reset)
  return useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY })
      reset()
    },
  })
}
```

### `src/lib/hooks/useOrders.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '@/lib/api/orderApi'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: async () => {
      const { data } = await orderApi.getMy()
      return data.data
    },
  })
}

export function useAllOrders() {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: async () => {
      const { data } = await orderApi.getAll()
      return data.data
    },
  })
}

export function useCreateOrder() {
  const router = useRouter()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      qc.invalidateQueries({ queryKey: ['orders'] })
      router.push('/checkout/success')
    },
    onError: () => toast.error('Đặt hàng thất bại, vui lòng thử lại'),
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      orderApi.updateStatus(id, { status: status as any }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Cập nhật trạng thái thành công')
    },
    onError: () => toast.error('Cập nhật thất bại'),
  })
}
```

### `src/lib/hooks/usePermission.ts`
```typescript
import { useAuthStore } from '@/stores/authStore'

export function usePermission() {
  const { user, isAuthenticated } = useAuthStore()
  const role = user?.role

  return {
    role,
    isAuthenticated,
    isUser: role === 'USER',
    isAdmin: role === 'ADMIN' || role === 'MANAGER',
    isManager: role === 'MANAGER',
    canManageProducts: role === 'ADMIN' || role === 'MANAGER',
    canManageOrders: role === 'ADMIN' || role === 'MANAGER',
    canManageVouchers: role === 'ADMIN' || role === 'MANAGER',
    canManageUsers: role === 'MANAGER',
    canCreateManager: role === 'ADMIN' || role === 'MANAGER',
    canDeleteProducts: role === 'MANAGER',
    canViewRevenue: role === 'MANAGER',
  }
}
```

### `src/lib/hooks/useDebounce.ts`
```typescript
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}
```

---

## 🛡️ MIDDLEWARE

### `src/middleware.ts`
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/cart', '/checkout', '/orders', '/profile', '/wishlist', '/notifications']
const ADMIN_ONLY = ['/dashboard/admin']
const MANAGER_ONLY = ['/dashboard/manager']
const AUTH_PAGES = ['/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('tl_token')?.value
  const role = request.cookies.get('tl_role')?.value

  // Đã đăng nhập → không vào auth pages
  if (token && AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Chưa đăng nhập → không vào protected pages
  if (!token && PROTECTED.some((p) => pathname.startsWith(p))) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Role guard - dashboard/admin
  if (ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
    if (!token || !['ADMIN', 'MANAGER'].includes(role || '')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Role guard - dashboard/manager
  if (MANAGER_ONLY.some((p) => pathname.startsWith(p))) {
    if (!token || role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

> **Lưu ý**: Sau khi login thành công, lưu token vào cookie để middleware đọc được:
> ```typescript
> // Trong login handler, set cookie
> document.cookie = `tl_token=${token}; path=/; max-age=${7 * 24 * 3600}`
> document.cookie = `tl_role=${user.role}; path=/; max-age=${7 * 24 * 3600}`
> ```

---

## 📄 IMPLEMENTATION TỪNG TRANG

---

### 1️⃣ `/login` — TRANG ĐĂNG NHẬP

```typescript
// app/(auth)/login/page.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginValues } from '@/lib/validations/authSchema'
import { authApi } from '@/lib/api/authApi'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'

export default function LoginPage() {
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

      // Lưu vào store + cookie
      setAuth(user, access_token)
      document.cookie = `tl_token=${access_token}; path=/; max-age=${7 * 24 * 3600}`
      document.cookie = `tl_role=${user.role}; path=/; max-age=${7 * 24 * 3600}`

      toast.success(`Chào mừng ${user.username}! 👋`)

      // Redirect theo role
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
    // DESIGN: Split layout 50/50
    // Trái: Gradient cam với logo, tagline, illustration
    // Phải: Form đăng nhập
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 flex-col items-center justify-center p-12 text-white">
        {/* Logo lớn */}
        {/* Tagline */}
        {/* Illustration hoặc mockup */}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-neutral-900">Đăng nhập</h1>
            <p className="text-neutral-500 mt-2">Chào mừng trở lại TL Market!</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Username field */}
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

            {/* Password field */}
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

            {/* Submit button */}
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
            <a href="/forgot-password" className="text-primary-500 hover:underline">Quên mật khẩu?</a>
            <a href="/register" className="text-primary-500 hover:underline">Tạo tài khoản mới</a>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 2️⃣ `/register` — ĐĂNG KÝ

Tương tự login, dùng `zodResolver(registerSchema)`, submit `authApi.register()`.
Form: `username`, `email` (optional), `password`, `confirmPassword`.

---

### 3️⃣ `/` — TRANG CHỦ

```typescript
// app/(main)/page.tsx
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { HeroBanner } from '@/components/home/HeroBanner'
import { TrustBadges } from '@/components/home/TrustBadges'
import { CategoryQuickAccess } from '@/components/home/CategoryQuickAccess'
import { FlashSaleSection } from '@/components/home/FlashSaleSection'
import { VoucherCarousel } from '@/components/home/VoucherCarousel'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { RecentlyViewed } from '@/components/home/RecentlyViewed'
import { TrendingSearch } from '@/components/home/TrendingSearch'

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <HeroBanner />
      <TrustBadges />
      <CategoryQuickAccess />
      <FlashSaleSection />
      <VoucherCarousel />
      <FeaturedProducts />
      <RecentlyViewed />
      <TrendingSearch />
    </>
  )
}
```

**FlashSaleSection** — Countdown Timer component:
```typescript
// components/home/CountdownTimer.tsx
'use client'
import { useEffect, useState } from 'react'

interface Props {
  endTime: Date
}

export function CountdownTimer({ endTime }: Props) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = endTime.getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [endTime])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-1">
      {[timeLeft.h, timeLeft.m, timeLeft.s].map((val, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-white text-flash-sale font-heading font-bold text-lg w-9 h-9 rounded-lg flex items-center justify-center">
            {pad(val)}
          </span>
          {i < 2 && <span className="text-white font-bold">:</span>}
        </span>
      ))}
    </div>
  )
}
```

---

### 4️⃣ `/products` — DANH SÁCH SẢN PHẨM

```typescript
// app/(main)/products/page.tsx
'use client'
import { useState, useMemo } from 'react'
import { useProducts } from '@/lib/hooks/useProducts'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductFilter } from '@/components/product/ProductFilter'
import { ProductSort } from '@/components/product/ProductSort'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useSearchParams } from 'next/navigation'

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(Infinity)
  const debouncedSearch = useDebounce(search)

  // Client-side filter (vì BE /products không có query params)
  const filtered = useMemo(() => {
    let result = [...products]

    if (debouncedSearch) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    if (minPrice > 0) result = result.filter((p) => p.basePrice >= minPrice)
    if (maxPrice < Infinity) result = result.filter((p) => p.basePrice <= maxPrice)

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.basePrice - b.basePrice); break
      case 'price-desc': result.sort((a, b) => b.basePrice - a.basePrice); break
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
    }

    return result
  }, [products, debouncedSearch, sortBy, minPrice, maxPrice])

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Sidebar Filter */}
        <aside className="hidden lg:block w-64 shrink-0">
          <ProductFilter
            onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max) }}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <ProductSort value={sortBy} onChange={setSortBy} />
          </div>

          <p className="text-sm text-neutral-500 mb-4">
            Tìm thấy <strong>{filtered.length}</strong> sản phẩm
          </p>

          <ProductGrid products={filtered} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
```

**ProductCard component** — Design yêu cầu:
```typescript
// components/product/ProductCard.tsx
'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils/formatPrice'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'
import type { Product } from '@/types/product'
import { toast } from 'sonner'

export function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0]
  const { mutate: addToCart, isPending } = useAddToCart()
  const { isAuthenticated } = useAuthStore()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const firstVariant = product.variants[0]
  const minPrice = Math.min(...product.variants.map((v) => product.basePrice + v.extraPrice))
  const maxPrice = Math.max(...product.variants.map((v) => product.basePrice + v.extraPrice))

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Vui lòng đăng nhập để mua hàng'); return }
    if (!firstVariant) return
    addToCart({ productId: product.id, variantId: firstVariant.id, quantity: 1 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/products/${product.id}`}>
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-neutral-50">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={product.productName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">
              Chưa có ảnh
            </div>
          )}

          {/* Hover actions overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3 gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={isPending || product.variants.every((v) => v.stock === 0)}
              className="flex items-center gap-1.5 bg-white text-primary-500 px-3 py-1.5 rounded-full text-xs font-semibold shadow hover:bg-primary-500 hover:text-white transition-all"
            >
              <ShoppingCart size={14} />
              {product.variants.every((v) => v.stock === 0) ? 'Hết hàng' : 'Thêm giỏ'}
            </button>
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted) }}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all"
          >
            <Heart size={16} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400'} />
          </button>

          {/* Stock badge */}
          {product.variants.every((v) => v.stock === 0) && (
            <div className="absolute top-2 left-2 bg-neutral-500 text-white text-xs px-2 py-0.5 rounded-full">
              Hết hàng
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-medium text-neutral-800 text-sm line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.productName}
          </h3>

          <div className="mt-2">
            {minPrice === maxPrice ? (
              <span className="text-primary-500 font-bold text-base">{formatPrice(minPrice)}</span>
            ) : (
              <span className="text-primary-500 font-bold text-base">
                {formatPrice(minPrice)} — {formatPrice(maxPrice)}
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-400 mt-1">
            {product.variants.length} phân loại · {product.variants.reduce((sum, v) => sum + v.stock, 0)} còn lại
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
```

---

### 5️⃣ `/products/[id]` — CHI TIẾT SẢN PHẨM

```typescript
// app/(main)/products/[id]/page.tsx
'use client'
import { useProduct } from '@/lib/hooks/useProducts'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils/formatPrice'
import { ProductImageGallery } from '@/components/product/ProductImageGallery'
import { VariantSelector } from '@/components/product/VariantSelector'
import { QuantityInput } from '@/components/product/QuantityInput'
import { Minus, Plus, ShoppingCart, Zap, Heart } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const { data: product, isLoading } = useProduct(id)
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] || null)
  const [quantity, setQuantity] = useState(1)
  const { mutate: addToCart, isPending } = useAddToCart()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  if (isLoading) return <ProductDetailSkeleton />
  if (!product) return <div>Không tìm thấy sản phẩm</div>

  const currentPrice = selectedVariant
    ? product.basePrice + selectedVariant.extraPrice
    : product.basePrice
  const currentStock = selectedVariant?.stock ?? 0

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Vui lòng đăng nhập'); router.push('/login'); return }
    if (!selectedVariant) { toast.error('Vui lòng chọn phân loại'); return }
    addToCart({ productId: product.id, variantId: selectedVariant.id, quantity })
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) { router.push('/login'); return }
    if (!selectedVariant) { toast.error('Vui lòng chọn phân loại'); return }
    addToCart({ productId: product.id, variantId: selectedVariant.id, quantity })
    router.push('/cart')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <ProductImageGallery images={product.images} productName={product.productName} />

        {/* Product Info */}
        <div className="space-y-5">
          <h1 className="font-heading text-2xl font-bold text-neutral-900 leading-tight">
            {product.productName}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary-500">{formatPrice(currentPrice)}</span>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selected={selectedVariant}
              onChange={setSelectedVariant}
            />
          )}

          {/* Stock */}
          {selectedVariant && (
            <p className={`text-sm font-medium ${currentStock < 10 ? 'text-red-500' : 'text-green-600'}`}>
              {currentStock === 0 ? '❌ Hết hàng' : currentStock < 10 ? `⚠️ Chỉ còn ${currentStock} sản phẩm` : `✅ Còn ${currentStock} sản phẩm`}
            </p>
          )}

          {/* Quantity */}
          <QuantityInput
            value={quantity}
            max={currentStock}
            onChange={setQuantity}
          />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isPending || currentStock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-primary-500 text-primary-500 font-semibold rounded-xl hover:bg-primary-50 transition disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              Thêm vào giỏ
            </button>
            <button
              onClick={handleBuyNow}
              disabled={currentStock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition shadow-lg shadow-primary-500/30 disabled:opacity-50"
            >
              <Zap size={18} />
              Mua ngay
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-neutral-800 mb-2">Mô tả sản phẩm</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

### 6️⃣ `/cart` — GIỎ HÀNG

```typescript
// app/(main)/cart/page.tsx
'use client'
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/lib/hooks/useCart'
import { voucherApi } from '@/lib/api/voucherApi'
import { formatPrice } from '@/lib/utils/formatPrice'
import { CartItem } from '@/components/cart/CartItem'
import { VoucherInput } from '@/components/cart/VoucherInput'
import { EmptyCart } from '@/components/cart/EmptyCart'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { data: cart, isLoading } = useCart()
  const [voucherDiscount, setVoucherDiscount] = useState(0)
  const router = useRouter()

  if (isLoading) return <CartSkeleton />
  if (!cart?.items?.length) return <EmptyCart />

  const subtotal = cart.totalPrice
  const shippingFee = subtotal >= 500_000 ? 0 : 30_000
  const total = subtotal - voucherDiscount + shippingFee

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-2xl font-bold mb-6">Giỏ hàng của tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <VoucherInput
            orderTotal={subtotal}
            onApply={(discount) => setVoucherDiscount(discount)}
          />

          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <h2 className="font-semibold text-lg">Tóm tắt đơn hàng</h2>
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {voucherDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Giảm giá voucher</span>
                <span>-{formatPrice(voucherDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Phí vận chuyển</span>
              <span>{shippingFee === 0 ? <span className="text-green-600">Miễn phí</span> : formatPrice(shippingFee)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-primary-500">{formatPrice(total)}</span>
            </div>
            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition shadow-lg shadow-primary-500/30"
            >
              Tiến hành thanh toán →
            </button>
            <button
              onClick={() => router.push('/products')}
              className="w-full py-2.5 border border-neutral-200 text-neutral-600 font-medium rounded-xl hover:bg-neutral-50 transition text-sm"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 7️⃣ `/checkout` — THANH TOÁN

```typescript
// app/(main)/checkout/page.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createOrderSchema, type CreateOrderValues } from '@/lib/validations/orderSchema'
import { useCreateOrder } from '@/lib/hooks/useOrders'
import { useCart } from '@/lib/hooks/useCart'

export default function CheckoutPage() {
  const { data: cart } = useCart()
  const { mutate: createOrder, isPending } = useCreateOrder()

  const form = useForm<CreateOrderValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      items: cart?.items?.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })) || [],
      note: '',
    },
  })

  const onSubmit = (data: CreateOrderValues) => createOrder(data)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="font-heading text-2xl font-bold mb-6">Thanh toán</h1>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Ghi chú */}
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
              <h2 className="font-semibold mb-3">Ghi chú đơn hàng</h2>
              <textarea
                {...form.register('note')}
                placeholder="Ghi chú cho người giao hàng (tuỳ chọn)"
                rows={3}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Voucher trong checkout */}
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
              <h2 className="font-semibold mb-3">Mã giảm giá</h2>
              <input
                {...form.register('voucherCode')}
                placeholder="Nhập mã giảm giá"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Order Summary + Submit */}
          <div>
            <div className="bg-white rounded-2xl border p-5 shadow-sm space-y-4 sticky top-20">
              <h2 className="font-semibold">Đơn hàng ({cart?.items?.length} sản phẩm)</h2>
              {/* List items */}
              {cart?.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="truncate flex-1 mr-2">{item.product?.productName} × {item.quantity}</span>
                  <span className="shrink-0 font-medium">{formatPrice(item.variant ? (item.product?.basePrice || 0) + item.variant.extraPrice : item.product?.basePrice || 0)}</span>
                </div>
              ))}

              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Tổng</span>
                <span className="text-primary-500">{formatPrice(cart?.totalPrice || 0)}</span>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/30 disabled:opacity-50"
              >
                {isPending ? 'Đang đặt hàng...' : '🛍️ Đặt hàng ngay'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
```

---

### 8️⃣ `/checkout/success` — ĐẶT HÀNG THÀNH CÔNG

```typescript
'use client'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } })
  }, [])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-6 p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        >
          <span className="text-5xl">✅</span>
        </motion.div>
        <h1 className="font-heading text-3xl font-bold text-neutral-900">Đặt hàng thành công!</h1>
        <p className="text-neutral-500">Cảm ơn bạn đã mua hàng tại TL Market. Đơn hàng của bạn đang được xử lý.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/orders" className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition">
            Xem đơn hàng
          </Link>
          <Link href="/" className="px-6 py-3 border border-neutral-200 rounded-xl font-semibold hover:bg-neutral-50 transition">
            Tiếp tục mua sắm
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
```

---

### 9️⃣ `/orders` — ĐƠN HÀNG CỦA TÔI

```typescript
'use client'
import { useMyOrders } from '@/lib/hooks/useOrders'
import { OrderCard } from '@/components/order/OrderCard'
import { useState } from 'react'
import type { OrderStatus } from '@/types/order'

const TABS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ xác nhận', value: 'PENDING' },
  { label: 'Đã xác nhận', value: 'CONFIRMED' },
  { label: 'Đang giao', value: 'SHIPPING' },
  { label: 'Đã giao', value: 'DELIVERED' },
  { label: 'Đã hủy', value: 'CANCELLED' },
]

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useMyOrders()
  const [activeTab, setActiveTab] = useState<OrderStatus | 'ALL'>('ALL')

  const filtered = activeTab === 'ALL' ? orders : orders.filter((o) => o.status === activeTab)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-heading text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab.value
                ? 'bg-primary-500 text-white shadow'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {isLoading ? <OrdersSkeleton /> : filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">Không có đơn hàng nào</div>
        ) : (
          filtered.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  )
}
```

**OrderStatusBadge**:
```typescript
import type { OrderStatus } from '@/types/order'

const STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:   { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  CONFIRMED: { label: 'Đã xác nhận',  className: 'bg-blue-100 text-blue-700 border-blue-200' },
  SHIPPING:  { label: 'Đang giao',    className: 'bg-purple-100 text-purple-700 border-purple-200' },
  DELIVERED: { label: 'Đã giao',      className: 'bg-green-100 text-green-700 border-green-200' },
  CANCELLED: { label: 'Đã hủy',      className: 'bg-red-100 text-red-700 border-red-200' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = STATUS_MAP[status]
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${className}`}>
      {label}
    </span>
  )
}
```

---

### 🔟 `/dashboard/admin` — ADMIN DASHBOARD

```typescript
'use client'
import { useAllOrders } from '@/lib/hooks/useOrders'
import { useProducts } from '@/lib/hooks/useProducts'
import { useUsers } from '@/lib/hooks/useUsers'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { formatPrice } from '@/lib/utils/formatPrice'
import { ShoppingBag, Package, Users, DollarSign } from 'lucide-react'

export default function AdminDashboardPage() {
  const { data: orders = [] } = useAllOrders()
  const { data: products = [] } = useProducts()

  const totalRevenue = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalPrice, 0)

  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Tổng quan hệ thống</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Tổng đơn hàng" value={orders.length} icon={<ShoppingBag />} trend="+12%" color="blue" />
        <StatsCard title="Chờ xử lý" value={pendingOrders} icon={<Package />} color="yellow" />
        <StatsCard title="Tổng sản phẩm" value={products.length} icon={<Package />} color="purple" />
        <StatsCard title="Doanh thu" value={formatPrice(totalRevenue)} icon={<DollarSign />} trend="+8%" color="green" />
      </div>

      {/* Recent Orders Table */}
      <RecentOrdersTable orders={orders.slice(0, 10)} />
    </div>
  )
}
```

---

### 1️⃣1️⃣ `/dashboard/admin/products` — QUẢN LÝ SẢN PHẨM

Luồng tạo sản phẩm — 2 bước upload:

```typescript
// components/common/ImageUpload.tsx
'use client'
import { useState, useRef } from 'react'
import { uploadApi } from '@/lib/api/uploadApi'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface Props {
  onUpload: (urls: string[]) => void
  multiple?: boolean
}

export function ImageUpload({ onUpload, multiple = true }: Props) {
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return
    setIsUploading(true)
    try {
      const urls = multiple
        ? await uploadApi.productImages(files)
        : [await uploadApi.variantImage(files[0])]

      setPreviews(urls)
      onUpload(urls)
      toast.success('Upload ảnh thành công!')
    } catch {
      toast.error('Upload ảnh thất bại')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/50 transition"
      >
        <Upload className="mx-auto mb-2 text-neutral-400" size={32} />
        <p className="text-sm text-neutral-500">
          {isUploading ? 'Đang upload...' : 'Kéo thả hoặc click để chọn ảnh'}
        </p>
        {multiple && <p className="text-xs text-neutral-400 mt-1">Tối đa 10 ảnh</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(Array.from(e.target.files || []))}
      />

      {previews.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {previews.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200">
              <Image src={url} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

### 1️⃣2️⃣ `/dashboard/admin/vouchers` — QUẢN LÝ VOUCHER

```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createVoucherSchema, type CreateVoucherValues } from '@/lib/validations/voucherSchema'
import { voucherApi } from '@/lib/api/voucherApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function VouchersPage() {
  const qc = useQueryClient()
  const { data: vouchers = [] } = useQuery({
    queryKey: ['vouchers'],
    queryFn: async () => { const { data } = await voucherApi.getAll(); return data.data },
  })

  const form = useForm<CreateVoucherValues>({
    resolver: zodResolver(createVoucherSchema),
    defaultValues: { discountType: 'PERCENT', discountValue: 10 },
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateVoucherValues) => voucherApi.create(data as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vouchers'] }); form.reset(); toast.success('Tạo voucher thành công!') },
    onError: () => toast.error('Tạo voucher thất bại'),
  })

  const deactivateMutation = useMutation({
    mutationFn: voucherApi.deactivate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vouchers'] }); toast.success('Đã vô hiệu hóa') },
  })

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Quản lý Voucher</h1>
      {/* Form tạo voucher + danh sách voucher */}
      {/* ... implement UI với form + zodResolver */}
    </div>
  )
}
```

---

## 🎨 DESIGN GUIDELINES — BẮT BUỘC TUÂN THỦ

### Visual Direction
- **Màu chủ đạo**: Cam gradient `#f97316 → #ea580c` (primary-500 → primary-600)
- **Nền**: `#f8fafc` (neutral-50) cho page background, `#ffffff` cho cards
- **Font heading**: Sora (bold, crisp)
- **Font body**: Be Vietnam Pro (readable, Vietnamese-optimized)
- **Border radius**: 12px cho cards, 8px cho inputs/buttons nhỏ, full cho badges/pills
- **Shadow**: `shadow-sm` mặc định, `shadow-lg` khi hover cards

### Card Design
```css
/* Card chuẩn */
background: white;
border-radius: 16px;
border: 1px solid #f1f5f9;
box-shadow: 0 1px 3px rgba(0,0,0,0.05);
transition: all 0.3s ease;

/* Card hover */
box-shadow: 0 10px 25px rgba(0,0,0,0.1);
transform: translateY(-4px);
```

### Button Styles
```css
/* Primary CTA */
background: linear-gradient(to right, #f97316, #ea580c);
color: white;
box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
border-radius: 12px;
padding: 12px 24px;
font-weight: 600;

/* Hover: opacity 0.9 + scale(1.01) */

/* Ghost */
border: 2px solid #e2e8f0;
background: transparent;
border-radius: 12px;
```

### Skeleton Loading
```typescript
// Shimmer effect
<div className="animate-pulse bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 rounded-lg" />
```

### Micro-animations (Framer Motion)
```typescript
// Fade in up cho mọi card/section
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

// Stagger cho grid items
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
}

// Scale button on hover/tap
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

---

## 📱 RESPONSIVE — MOBILE FIRST

```
Mobile (default): 1 cột
Tablet (md: 768px): 2 cột
Desktop (lg: 1024px): 3-4 cột
Large (xl: 1280px): 4-5 cột
```

Mobile-specific components:
- **MobileBottomNav**: Fixed bottom, 5 tabs (Home | Danh mục | Tìm kiếm | Giỏ hàng | Profile)
- **ProductFilter**: Bottom sheet (Drawer) thay vì sidebar
- **Header**: Chỉ logo + search icon + cart badge (search expand khi click)

---

## ⚙️ `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
```

---

## ⚠️ GHI CHÚ QUAN TRỌNG VỀ BE HIỆN TẠI

| Feature | Tình trạng BE | Giải pháp FE |
|---|---|---|
| Filter/Search sản phẩm | ❌ Chưa có query params | Client-side filter |
| Wishlist | ❌ Chưa có endpoint | LocalStorage |
| Reviews/Ratings | ❌ Chưa có | Ẩn hoặc mock |
| Địa chỉ giao hàng | ❌ Chưa có | Lưu vào `note` order |
| Categories riêng | ❌ Chưa có | Group theo `shopId` |
| Forgot password | ❌ Chưa có | Ẩn hoặc hiện "Liên hệ admin" |
| Cancel order (user) | ❌ Chưa có | Ẩn nút hủy phía user |
| Notifications | ❌ Chưa có | Ẩn |

---

## ✅ CHECKLIST THEO PHASE

### Phase 1 — Nền tảng (Tuần 1)
- [ ] Khởi tạo project với yarn
- [ ] Cấu hình Tailwind + design tokens
- [ ] Setup fonts (Be Vietnam Pro + Sora)
- [ ] `axiosInstance.ts` với interceptors
- [ ] TanStack Query Provider
- [ ] Zustand stores (auth, cart)
- [ ] Zod schemas tất cả forms
- [ ] `middleware.ts` route guard
- [ ] Header, Footer components
- [ ] Dashboard layout + Sidebar

### Phase 2 — Auth (Tuần 1)
- [ ] `/login` — form + zodResolver + set cookie
- [ ] `/register` — form + zodResolver
- [ ] Redirect sau login theo role

### Phase 3 — Shopping (Tuần 2)
- [ ] Trang chủ đầy đủ sections
- [ ] ProductCard + ProductGrid + Skeleton
- [ ] `/products` — filter/sort client-side
- [ ] `/products/[id]` — gallery + variant + add to cart
- [ ] `/search`

### Phase 4 — Transaction (Tuần 2-3)
- [ ] `/cart` — optimistic updates + voucher
- [ ] `/checkout` — form + zodResolver
- [ ] `/checkout/success` — confetti
- [ ] `/orders` — tabs + status badges

### Phase 5 — Admin Dashboard (Tuần 3-4)
- [ ] `/dashboard/admin` — stats overview
- [ ] `/dashboard/admin/products` — data table + CRUD
- [ ] `/dashboard/admin/products/new` — form + 2-step image upload
- [ ] `/dashboard/admin/products/[id]/edit` — pre-fill form
- [ ] `/dashboard/admin/orders` — table + update status
- [ ] `/dashboard/admin/vouchers` — CRUD + zodResolver

### Phase 6 — Manager Dashboard (Tuần 4)
- [ ] `/dashboard/manager` — stats + charts (Recharts)
- [ ] `/dashboard/manager/orders` — all orders management
- [ ] `/dashboard/manager/users` — user list + delete

### Phase 7 — Polish (Tuần 5)
- [ ] Mobile responsive tất cả trang
- [ ] Skeleton loading tất cả
- [ ] Empty states đẹp
- [ ] Error boundaries
- [ ] 404 page đẹp
- [ ] Toast notifications nhất quán
- [ ] SEO metadata
- [ ] Lighthouse audit ≥ 85
