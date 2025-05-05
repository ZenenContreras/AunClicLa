import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default function middleware(request: NextRequest) {
  // Lista de rutas que necesitan redirección
  const pathsToRedirect = ['/perfil', '/productos', '/comidas', '/boutique', '/favoritos', '/login'];
  
  // Verificar si la ruta actual necesita redirección
  const path = request.nextUrl.pathname;
  if (pathsToRedirect.includes(path)) {
    // Detectar el locale (puedes mejorarlo según tus necesidades)
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
    
    // Si es la ruta de login con un parámetro redirect, preservar ese parámetro
    if (path === '/login' && request.nextUrl.searchParams.has('redirect')) {
      const redirect = request.nextUrl.searchParams.get('redirect');
      return NextResponse.redirect(new URL(`/${locale}${path}?redirect=${redirect}`, request.url));
    }
    
    return NextResponse.redirect(new URL(`/${locale}${path}`, request.url));
  }
  
  // Middleware de next-intl para las demás rutas
  return createMiddleware(routing)(request);
}

export const config = {
  matcher: [
    '/',
    '/(es|en|fr)/:path*',
    '/perfil',
    '/productos',
    '/comidas',
    '/boutique',
    '/favoritos',
    '/login'
  ],
};