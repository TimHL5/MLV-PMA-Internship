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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes - includes the new dashboard routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/mlv') ||
    request.nextUrl.pathname.startsWith('/internal/home') ||
    request.nextUrl.pathname.startsWith('/internal/submit') ||
    request.nextUrl.pathname.startsWith('/internal/board') ||
    request.nextUrl.pathname.startsWith('/internal/team') ||
    request.nextUrl.pathname.startsWith('/internal/me') ||
    request.nextUrl.pathname.startsWith('/internal/admin') ||
    request.nextUrl.pathname.startsWith('/internal/one-on-one') ||
    request.nextUrl.pathname.startsWith('/internal/dashboard') ||
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/app');

  // Define auth routes
  const isAuthRoute =
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/internal' ||
    request.nextUrl.pathname.startsWith('/auth');

  // If user is not logged in and trying to access protected route, redirect to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in and trying to access login page, redirect to new dashboard
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/internal')) {
    const url = request.nextUrl.clone();
    url.pathname = '/mlv/pma-internship-2026';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
