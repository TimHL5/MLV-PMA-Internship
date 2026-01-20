import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Redirect ALL traffic to the new portal
  const newPortalUrl = 'https://portal.mlvignite.com';
  
  // Permanent redirect (308) to the new portal
  return NextResponse.redirect(newPortalUrl, { status: 308 });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
