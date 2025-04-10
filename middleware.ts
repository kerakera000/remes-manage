import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  return request.cookies.has('auth-session'); // Check for the session cookie set on login
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = await isAuthenticated(request);

  if (authenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!authenticated && pathname !== '/login') {
     if (pathname.startsWith('/_next/') || pathname.startsWith('/static/') || pathname.includes('.')) {
       return NextResponse.next();
     }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /login (the login page itself) - we handle redirect from login if authenticated above
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/',
  ],
};
