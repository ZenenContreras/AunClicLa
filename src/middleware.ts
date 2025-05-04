import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default function middleware(request: NextRequest) {
  // Redirigir /perfil a /[locale]/perfil
  if (request.nextUrl.pathname === '/perfil') {
    // Detectar el locale (puedes mejorarlo según tus necesidades)
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
    return NextResponse.redirect(new URL(`/${locale}/perfil`, request.url));
  }
  // Middleware de next-intl
  return createMiddleware(routing)(request);
}

export const config = {
  matcher: [
    '/',
    '/(es|en|fr)/:path*',
    '/perfil', // Asegúrate de incluir la ruta aquí
  ],
};