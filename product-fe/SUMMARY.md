## Goal
- Build and redesign Frontend for TL Market — e-commerce platform (Next.js 14+ App Router, TypeScript, Tailwind)

## Constraints & Preferences
- **Package manager**: yarn only
- **State**: Zustand (auth, cart, compare, UI stores)
- **Server state**: TanStack React Query
- **Forms**: React Hook Form + Zod
- **UI**: shadcn/ui, Framer Motion, Lucide icons, Material Symbols
- **Primary color**: Orange gradient `#f97316 → #ea580c`
- **Secondary (blue) gradient**: `#0035d1 → #3432c8` (used in product detail buttons, quick add)
- **Fonts**: Sora (heading) + Be Vietnam Pro (body)
- **Backend API**: `https://p2-backend-1fme.onrender.com`
- **Auth**: Bearer JWT, role-based redirect (ADMIN/MANAGER/USER)
- **All design changes must preserve existing functionality** (hooks, API calls, form validation, redirects, toast, image fallback)

## Progress
### Done
- **Auth flow fixed**: axios interceptor no longer hard-redirects to `/login` on 401 — only clears stale token
- **`useCart` hook**: accepts optional `enabled` param — main layout passes `isAuthenticated` to avoid 401 on unauthenticated page loads
- **Home page redirect**: authenticated ADMIN → `/dashboard/admin`, MANAGER → `/dashboard/manager`
- **Products listing auth check**: "Quick Add" / "Thêm vào giỏ" → redirects to `/login?from=/products` if not authenticated (products page + product detail page)
- **Logo**: replaced all text "TL Market" with `<img src="/logo-removebg-preview.png">` in header, footer, sidebar, login, forgot-password, and product detail pages
- **Profile page** (`app/(main)/profile/page.tsx`): no longer redirects to login — shows inline login/register prompt when unauthenticated; m3-colored cards when authenticated
- **Forgot password page** (`app/(auth)/forgot-password/page.tsx`): created — centered card, orange gradient submit, success state with "Gửi lại"
- **Admin products page** (`app/(dashboard)/dashboard/admin/products/page.tsx`): redesigned with checkbox table, SKU, stock progress bar, stats cards, pagination, delete with confirm dialog
- **Home page** (`app/(main)/page.tsx`): redesigned per new HTML — hero section with gradient overlay + "Shop Now"/"View Offers" buttons, 4 trust badges, flash sale dark section with countdown timer + real product cards with discount % + stock bar, 6 categories with hover border/icon color change, 4-col recommended products with star rating + add_to_cart button
- **Main layout** (`app/(main)/layout.tsx`): redesigned — fixed glass nav, search input rounded-full, cart badge orange, footer with social icons + Company/Customer Service/Newsletter columns
- **Product detail** (`app/(main)/products/[id]/page.tsx`): redesigned per new HTML — breadcrumbs, thumbnail vertical strip + main image with hover scale, star rating, price + line-through original, variant chips, quantity +/- in outlined box, "Add to Cart" blue gradient + "Buy Now" outline, service icons grid, description tabs (Description / Specifications / Reviews / Q&A)
- **Products listing** (`app/(main)/products/page.tsx`): redesigned per new HTML — sidebar with Category checkboxes, Price Range slider, Brands grid; 4-col grid cards with aspect-[4/5] image, brand label, star rating, "Quick Add" blue gradient slide-up on hover, wishlist icon; pagination with prev/next + page numbers
- **Cart page** (`app/(main)/cart/page.tsx`): redesigned per new HTML — glass-card items with hover scale, delete animation, blue gradient order summary card with promo code input, checkout button, security/shipping trust badges, empty state with shopping_basket icon

### Blocked
- (none)

## Key Decisions
- Used **inline styles** for blue gradients (`linear-gradient(135deg, #0035d1 0%, #3432c8 100%)`) and orange accents since they're not in the Tailwind config
- Removed `window.location.href = '/login'` from axios 401 interceptor — breaks unauthenticated browsing; hooks now handle auth checks before calling APIs
- Product detail uses client-side tab switching (Description / Specifications / Reviews / Q&A) with mock content for specs/reviews/QA
- Countdown timer updated to count down to midnight (`tomorrow.setHours(24,0,0,0)`) matching HTML spec
- Flash sale stock bar capped at 100% (Math.min(totalStock, 100))
- Products listing sidebar categories and brands are static (no BE endpoint for them yet)

## Next Steps
- Remaining pages to align with HTML designs: checkout, register, orders list, user orders, voucher management
- Test full auth flow: unauthenticated browse → add to cart redirect → login → redirect back

## Critical Context
- Next.js 14 App Router with `app/` directory structure (no `src/`)
- Root layout loads Material Symbols font from Google Fonts
- `useCart` returns `{ data: { items, totalPrice }, isLoading }`
- `useAllOrders` returns orders with `id, status, totalPrice, items, createdAt`
- `useProducts` returns products with `id, productName, basePrice, description, images[{url}], variants[{id, variantName, extraPrice, stock}], createdAt`
- `authStore` provides `user` (role, username) and `isAuthenticated`
- `formatPrice` → VND, `calcDiscount` → percentage
- Image error fallback: `https://via.placeholder.com/SIZE?text=Product`
- Middleware (`middleware.ts`) protects `/cart`, `/checkout`, `/orders`, `/profile`, `/wishlist` — redirects to `/login?from=` if no `tl_token` cookie

## Relevant Files
- `app/(auth)/forgot-password/page.tsx` — forgot password page (created)
- `app/(auth)/login/page.tsx` — login page (redesigned earlier)
- `app/(main)/page.tsx` — home page (redesigned per new HTML)
- `app/(main)/layout.tsx` — main layout (glass nav + footer redesigned)
- `app/(main)/profile/page.tsx` — profile page (inline login prompt)
- `app/(main)/products/page.tsx` — products listing (redesigned per new HTML)
- `app/(main)/products/[id]/page.tsx` — product detail (redesigned per new HTML)
- `app/(main)/cart/page.tsx` — cart page (redesigned per new HTML)
- `app/(dashboard)/layout.tsx` — dashboard layout (sidebar + top bar)
- `app/(dashboard)/dashboard/admin/page.tsx` — admin dashboard
- `app/(dashboard)/dashboard/admin/orders/page.tsx` — admin orders management (redesigned)
- `app/(dashboard)/dashboard/admin/products/page.tsx` — admin products management (redesigned)
- `lib/api/axiosInstance.ts` — axios instance (401 interceptor fixed)
- `lib/hooks/useCart.ts` — `useCart(enabled?)` (added enabled param)
- `lib/hooks/useProducts.ts` — product hooks
- `middleware.ts` — route guards (cart, profile, dashboard)
- `public/logo-removebg-preview.png` — logo file
