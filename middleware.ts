// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withSentryConfig } from '@sentry/nextjs';

async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Obtener información de la request
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  
  // En middleware no podemos usar la API de cliente de Sentry directamente
  // El tracking de navegación se maneja en el cliente
  
  // Configurar headers de seguridad
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Log para debugging en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`Navigation: ${pathname}${search}`);
  }
  
  return response;
}

export default withSentryConfig(middleware);

export const config = {
  // Aplicar middleware a todas las rutas excepto las estáticas
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};