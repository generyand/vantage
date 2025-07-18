import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const pathname = request.nextUrl.pathname;
  
  // Check if the current path is a protected route (inside the (app) group)
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/assessments') || 
                          pathname.startsWith('/reports') ||
                          pathname.startsWith('/user-management') ||
                          pathname.startsWith('/change-password');
  
  // If it's not a protected route, continue
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // Get the authentication token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // If no token found, redirect to login
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  // If token exists, allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|public).*)',
  ],
}; 