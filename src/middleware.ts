import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pure JS Edge-compatible JWT decoder to read payload without Node crypto dependencies
function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }
    return decoded as { id: string; email: string; role: string };
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("token")?.value;
  const decoded = tokenCookie ? decodeJwt(tokenCookie) : null;
  const { pathname } = request.nextUrl;

  // Protect Admin Dashboard
  if (pathname.startsWith("/admin")) {
    if (!decoded) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (decoded.role !== "ADMIN" && decoded.role !== "STAFF") {
      // Redirect to unauthorized or home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect Customer Pages
  if (pathname.startsWith("/profile") || pathname.startsWith("/reservations") || pathname.startsWith("/checkout") || pathname.startsWith("/my-bookings")) {
    if (!decoded) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from auth pages
  if (pathname === "/login" || pathname === "/register") {
    if (decoded) {
      if (decoded.role === "ADMIN" || decoded.role === "STAFF") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/reservations/:path*",
    "/checkout/:path*",
    "/my-bookings/:path*",
    "/login",
    "/register",
  ],
};
