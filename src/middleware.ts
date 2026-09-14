import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Sadece giriş yapmış kişilerin girebileceği sayfalar
const protectedRoutes = ['/profile', '/dashboard', '/settings']
// Dışarıdan izinsiz veri çekilmesini/silinmesini engellediğimiz API rotaları
const protectedApiPrefix = '/api/users'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Kullanıcının tarayıcısındaki oturum biletini (cookie) cebinden alıyoruz
  const sessionToken = request.cookies.get('session_token')?.value

  // 1. DURUM: Kullanıcı gizli bir sayfaya girmeye çalışıyor ama bileti yok
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  if (isProtectedRoute && !sessionToken) {
    // Bileti yoksa içeri alamayız, Giriş (Login) sayfasına yolluyoruz
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. DURUM: Biri dışarıdan korumalı API'mize (verilerimize) istek atıyor ama bileti yok
  if (pathname.startsWith(protectedApiPrefix) && !sessionToken) {
    // API isteklerinde yönlendirme yapılmaz, doğrudan suratına 401 Unauthorized (İzinsiz) çarpılır
    return NextResponse.json(
      { error: 'Bu işlemi yapmak için giriş yapmalısınız' },
      { status: 401 }
    )
  }

  // 3. DURUM: Zaten giriş yapmış bir adam, tekrar /login veya /register sayfasına girmeye çalışıyorsa
  const isAuthRoute = pathname === '/login' || pathname === '/register'
  if (isAuthRoute && sessionToken) {
    // Kardeşim zaten giriş yapmışsın diyerek onu direkt profiline yolluyoruz
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  // Hiçbir engele takılmadıysa, adamı rahat bırak ve geçmesine izin ver
  return NextResponse.next()
}

// Performans için: Bu koruma (middleware) işlemi hangi sayfalarda tetiklensin
export const config = {
  matcher: [
    '/profile/:path*', 
    '/dashboard/:path*', 
    '/settings/:path*',
    '/login',
    '/register',
    '/api/users/:path*'
  ],
}