import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/products");
  const isLoginPage = pathname === "/login";
  const isRoot = pathname === "/";

  if (isRoot) {
    if (token) return NextResponse.redirect(new URL("/products", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/products/:path*", "/login"],
};
