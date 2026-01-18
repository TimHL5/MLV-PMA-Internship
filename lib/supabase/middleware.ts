import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Provide placeholder values for build time when env vars aren't set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export async function updateSession(request: NextRequest) {
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
  // A simple mistake could make it very hard to debug issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Define protected routes - /internal/* except /internal itself (login page)
  const isInternalProtectedRoute =
    pathname.startsWith('/internal/') && pathname !== '/internal';

  const isInternalLoginPage = pathname === '/internal';

  // Define other protected routes
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/app') ||
    isInternalProtectedRoute;

  // Define auth routes
  const isAuthRoute =
    pathname.startsWith('/login') ||
    (pathname.startsWith('/auth') && !pathname.startsWith('/auth/callback'));

  // If user is not logged in and trying to access protected route, redirect to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    // Redirect to /internal login page for internal routes
    url.pathname = isInternalProtectedRoute ? '/internal' : '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in and on /internal login page, redirect to /internal/home
  if (user && isInternalLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/internal/home';
    return NextResponse.redirect(url);
  }

  // If user is logged in and trying to access auth routes, redirect to internal/home
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/internal/home';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
