import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Provide placeholder values for build time when env vars aren't set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Redirect old /internal/* routes to new Supabase dashboard routes
const internalRedirects: Record<string, string> = {
  '/internal': '/login',
  '/internal/home': '/mlv/pma-internship-2026',
  '/internal/submit': '/mlv/pma-internship-2026/submit',
  '/internal/board': '/mlv/pma-internship-2026/board',
  '/internal/team': '/mlv/pma-internship-2026/team',
  '/internal/me': '/mlv/pma-internship-2026/me',
  '/internal/one-on-one': '/mlv/pma-internship-2026/one-on-one',
  '/internal/admin': '/mlv/pma-internship-2026',
  '/internal/dashboard': '/mlv/pma-internship-2026',
};

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if current path should be redirected from old /internal/* routes
  for (const [oldPath, newPath] of Object.entries(internalRedirects)) {
    if (pathname === oldPath) {
      const url = request.nextUrl.clone();
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }
  }

  // Catch any other /internal/* routes and redirect to main dashboard
  if (pathname.startsWith('/internal/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/mlv/pma-internship-2026';
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and supabase.auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes - dashboard routes require auth
  const isDashboardRoute = pathname.match(/^\/[^/]+\/[^/]+/) &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/apply') &&
    pathname !== '/';

  // Define auth routes
  const isAuthRoute =
    pathname === '/login' ||
    (pathname.startsWith('/auth') && !pathname.startsWith('/auth/callback'));

  // If user is not logged in and trying to access protected route, redirect to login
  if (!user && isDashboardRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in and trying to access auth routes, redirect to dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/mlv/pma-internship-2026';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
