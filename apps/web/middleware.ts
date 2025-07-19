import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js middleware for route protection
 * 
 * This middleware protects all routes inside the (app) group by checking
 * authentication status. Unauthenticated users are redirected to /login.
 * 
 * The middleware checks for authentication by looking for the auth token
 * in cookies (set by the auth store).
 */
export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const { pathname } = request.nextUrl;
  
  // Define protected routes (all routes that start with /dashboard, /assessments, /reports, etc.)
  // These correspond to the (app) route group
  const protectedRoutes = [
    '/dashboard',
    '/assessments',
    '/reports',
    '/user-management',
    '/change-password',
  ];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // If it's not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // For protected routes, check authentication
  // Check for the auth token in cookies
  const authToken = request.cookies.get('auth-token')?.value;
  
  // If no auth token is found, redirect to login
  if (!authToken) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the original URL as a redirect parameter
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If auth token exists, allow access to the protected route
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 * 
 * This ensures the middleware only runs on the routes we want to protect,
 * improving performance by avoiding unnecessary middleware execution.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 