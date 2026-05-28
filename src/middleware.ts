import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

const PUBLIC_ROUTES = ["/login"];

// shared routes (no role restriction)
const BYPASS_ROUTES = [
  "/dashboard/admin/tasks"
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isBypassRoute = BYPASS_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  let payload: any = null;

  if (accessToken) {
    try {
      payload = decodeJwt(accessToken);
    } catch {
      payload = null;
    }
  }

  const role = payload?.role;

  // ===============================
  // 1. AUTH CHECK
  // ===============================
  if (!accessToken && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken && !payload && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ===============================
  // 2. LOGIN REDIRECT
  // ===============================
  if (isPublicRoute && accessToken && payload) {
    const redirectPath =
      role === "member"
        ? "/dashboard/member"
        : "/dashboard/admin";

    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // ===============================
  // 3. ROLE PROTECTION (SKIP BYPASS)
  // ===============================
  if (!isBypassRoute) {
    if (role === "member" && pathname.startsWith("/dashboard/admin")) {
      return NextResponse.redirect(new URL("/dashboard/member", req.url));
    }

    if (
      (role === "admin" || role === "manager") &&
      pathname.startsWith("/dashboard/member")
    ) {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};