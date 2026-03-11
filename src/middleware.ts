import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Routes that require authentication
const protectedRoutes = ["/studio", "/order"];
const adminRoutes = ["/admin"];

export async function middleware(request: any) {
  const { pathname } = request.nextUrl;

  // Exclude login pages from protection
  if (pathname === "/admin-login" || pathname === "/login") {
    return NextResponse.next();
  }

  // Check if it's an admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Check if the current route is protected (user routes)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute && !isAdminRoute) {
    // Allow access to public routes
    return NextResponse.next();
  }

  // Get the session for protected routes
  const session = await auth();

  if (!session) {
    // Redirect to appropriate login page
    if (isAdminRoute) {
      const loginUrl = new URL("/admin-login", request.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    } else {
      const loginUrl = new URL("/login", request.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // For admin routes, check if user has admin role
  if (isAdminRoute && (session.user as any).role !== "admin") {
    // Redirect non-admin users
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  // Allow access if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
