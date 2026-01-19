import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/mlv/pma-internship-2026';

  if (code) {
        const cookieStore = await cookies();

      const supabase = createServerClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
                  cookies: {
                              getAll() {
                                            return cookieStore.getAll();
                              },
                              setAll(cookiesToSet) {
                                            cookiesToSet.forEach(({ name, value, options }) => {
                                                            cookieStore.set(name, value, options);
                                            });
                              },
                  },
        }
            );

      const { error, data } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.user) {
              // Check if user has a profile, create one if not
          const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

          if (profileError && profileError.code === 'PGRST116') {
                    // Profile doesn't exist, create it
                const newProfile = {
                            id: data.user.id,
                            email: data.user.email || '',
                            full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
                            avatar_url: data.user.user_metadata?.avatar_url || null,
                            role: 'intern',
                };

                await supabase.from('profiles').insert(newProfile);
          }

          // Determine the redirect URL
          const forwardedHost = request.headers.get('x-forwarded-host');
              const isLocalEnv = process.env.NODE_ENV === 'development';

          let redirectUrl: string;
              if (isLocalEnv) {
                        redirectUrl = `${origin}${next}`;
              } else if (forwardedHost) {
                        redirectUrl = `https://${forwardedHost}${next}`;
              } else {
                        redirectUrl = `${origin}${next}`;
              }

          return NextResponse.redirect(redirectUrl);
      }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
