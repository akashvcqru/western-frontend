import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirectsMap from './data/redirects_map.json';

const map = redirectsMap as Record<string, string>;

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Direct exact match
  if (map[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = map[pathname];
    return NextResponse.rewrite(url);
  }

  // 2. Normalized match (strip trailing slash)
  const strippedPath = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  if (map[strippedPath]) {
    const url = request.nextUrl.clone();
    url.pathname = map[strippedPath];
    return NextResponse.rewrite(url);
  }

  // 3. Lowercase match
  const lowerPath = strippedPath.toLowerCase();
  if (map[lowerPath]) {
    const url = request.nextUrl.clone();
    url.pathname = map[lowerPath];
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api / uploads routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api|uploads).*)',
  ],
};
