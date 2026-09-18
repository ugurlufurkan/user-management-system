import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Sadece giriş yapmış kişilerin girebileceği sayfalar
const protectedRoutes = ['/profile', '/dashboard', '/settings', '/admin']
const protectedApiPrefix = '/api/users'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const sessionToken = request.cookies.get('session_token')?.value

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith(protectedApiPrefix) && !sessionToken) {
    return NextResponse.json(
      { error: 'Bu işlemi yapmak için giriş yapmalısınız' },
      { status: 401 }
    )
  }

  const isAuthRoute = pathname === '/login' || pathname === '/register'
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/profile/:path*', 
    '/dashboard/:path*', 
    '/settings/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/api/users/:path*'
  ],
}