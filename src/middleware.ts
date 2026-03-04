import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  return response;
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/ai') {
    return addSecurityHeaders(NextResponse.redirect(new URL('/', request.url)));
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET,
    });

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return addSecurityHeaders(NextResponse.redirect(loginUrl));
    }

    if ((token as any).role !== 'ADMIN') {
      return addSecurityHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
    }
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
