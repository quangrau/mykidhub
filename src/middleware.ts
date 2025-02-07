import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;

  // Check if the current route is a public route
  const { pathname } = req.nextUrl;
  const publicRoutes = ["/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Redirect authenticated users away from auth pages
  if (isAuth && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect all routes except public routes
  if (!isPublicRoute && !isAuth) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Routes middleware should NOT run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    "/signin",
    "/signup",
  ],
};
