import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwt(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT");
  }
  const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = payload.padEnd(
    payload.length + ((4 - (payload.length % 4)) % 4),
    "=",
  );
  const decoded = atob(padded);
  return JSON.parse(decoded);
}

function roleRedirect(role?: string) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "MANAGER":
      return "/dashboard/manager";
    case "USER":
      return "/dashboard/user";
    default:
      return "/login";
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  let role: string | undefined;

  if (token) {
    try {
      role = (parseJwt(token) as { role?: string }).role;
    } catch {
      role = undefined;
    }
  }

  const isRoot = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isDashboardRoute = pathname.startsWith("/dashboard");
  // Sửa isProtected: chỉ bảo vệ /dashboard/* và /products/*/checkout
  const isProtected =
    isDashboardRoute ||
    (pathname.startsWith("/products/") && pathname.endsWith("/checkout"));

  if (isRoot) {
    if (token && role) {
      return NextResponse.redirect(new URL(roleRedirect(role), request.url));
    }
    return NextResponse.next(); // Cho vào home mà không cần login
  }

  if ((isLoginPage || isRegisterPage) && token && role) {
    return NextResponse.redirect(new URL(roleRedirect(role), request.url));
  }

  if (isProtected && !token) {
    const redirectPath = request.nextUrl.pathname + request.nextUrl.search;
    return NextResponse.redirect(
      new URL(
        `/login?redirect=${encodeURIComponent(redirectPath)}`,
        request.url,
      ),
    );
  }

  if (isDashboardRoute && role) {
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL(roleRedirect(role), request.url));
    }
    if (pathname.startsWith("/dashboard/manager") && role !== "MANAGER") {
      return NextResponse.redirect(new URL(roleRedirect(role), request.url));
    }
    if (pathname.startsWith("/dashboard/user") && role !== "USER") {
      return NextResponse.redirect(new URL(roleRedirect(role), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/products/:path*",
  ],
};
