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

  // If logged in, don't go to auth pages
  if (token && AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If not logged in, don't go to protected pages
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
