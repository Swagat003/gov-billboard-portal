import { NextResponse } from "next/server";

export function middleware(request) {
  console.log(`🔍 MIDDLEWARE TRIGGERED: ${request.nextUrl.pathname}`);
  
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  console.log(`Token exists: ${!!token}, Path: ${pathname}`);

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('/favicon.ico') ||
    pathname.startsWith('/images/')
  ) {
    return NextResponse.next();
  }

  // Allow access to login and register pages only when not authenticated
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      try {
        // For now, let's import jwt dynamically to avoid issues
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`Redirecting authenticated user from ${pathname} to dashboard`);
        return NextResponse.redirect(new URL(`/${decoded.role.toLowerCase()}/dashboard`, request.url));
      } catch (err) {
        console.log(`Invalid token, allowing access to ${pathname}`);
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Allow access to home page only when not authenticated  
  if (pathname === '/') {
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`Redirecting authenticated user from home to dashboard`);
        return NextResponse.redirect(new URL(`/${decoded.role.toLowerCase()}/dashboard`, request.url));
      } catch (err) {
        console.log(`Invalid token, allowing access to home`);
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protect role-specific routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/owner') || pathname.startsWith('/advertiser')) {
    console.log(`🛡️ Protecting route: ${pathname}`);
    
    if (!token) {
      console.log(`No token found, redirecting to login`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`User role: ${decoded.role}, accessing: ${pathname}`);

      // Check role permissions
      if (pathname.startsWith('/admin') && decoded.role !== 'ADMIN') {
        console.log(`Access denied: ${decoded.role} cannot access admin routes`);
        return NextResponse.redirect(new URL('/login', request.url));
      }
      if (pathname.startsWith('/owner') && decoded.role !== 'OWNER') {
        console.log(`Access denied: ${decoded.role} cannot access owner routes`);
        return NextResponse.redirect(new URL('/login', request.url));
      }
      if (pathname.startsWith('/advertiser') && decoded.role !== 'ADVERTISER') {
        console.log(`Access denied: ${decoded.role} cannot access advertiser routes`);
        return NextResponse.redirect(new URL('/login', request.url));
      }

      console.log(`✅ Access granted to ${pathname}`);
      return NextResponse.next();
    } catch (err) {
      console.error(`JWT verification failed:`, err.message);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // For any other routes, redirect to home
  console.log(`Unknown route ${pathname}, redirecting to home`);
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
