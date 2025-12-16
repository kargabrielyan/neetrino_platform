import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Защита админ-роутов
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Пропускаем страницу логина
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    // Проверяем наличие сессионной cookie (легкая проверка для Edge)
    // Полная проверка авторизации и роли будет на уровне страницы через AdminGuard
    // NextAuth v5 использует разные имена cookie в зависимости от окружения
    const sessionToken = request.cookies.get('authjs.session-token')?.value || 
                         request.cookies.get('__Secure-authjs.session-token')?.value ||
                         request.cookies.get('next-auth.session-token')?.value ||
                         request.cookies.get('__Secure-next-auth.session-token')?.value;
    
    if (!sessionToken) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};








