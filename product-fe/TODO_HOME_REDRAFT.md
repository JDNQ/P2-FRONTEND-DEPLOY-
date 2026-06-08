# TODO - Redraft Home page (app/page.tsx)

## Plan

1. Read current `product-fe/app/page.tsx` and identify:
   - current sections/layout
   - existing data sources (API: `getProducts`, cookies/cart, etc.)
   - any hardcoded banners/images/categories
2. Redraft the home UI to match the new spec structure:
   - Hero slider (using existing banner/slide concept or images)
   - Category grid
   - Flash Sale section
   - Featured Products section
   - Voucher section
   - Info/Trust section
3. Preserve existing URLs and API calls:
   - Keep routes like `/`, `/products`, `/cart`, `/login`, `/register`, `/products/[id]`
   - Keep API calls like `getProducts()`, `getCart()`.
4. Ensure the component still works with Next.js App Router:
   - keep `'use client'`
   - keep hooks at top level
   - avoid lint violations
5. Update styling using Tailwind already present in repo.
6. Run `npm run lint` and `npm run build` (if feasible) to ensure no errors.
