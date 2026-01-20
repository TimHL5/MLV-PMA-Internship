'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Profile, AuthContextType } from '@/lib/types';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
      const [user, setUser] = useState<Profile | null>(null);
      const [loading, setLoading] = useState(true);
      const router = useRouter();

  // Memoize the Supabase client to prevent re-creating on every render
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(async (authUser: User) => {
          try {
                    // First try to get existing profile
            const { data: profile, error } = await supabase
                      .from('profiles')
                      .select('*')
                      .eq('id', authUser.id)
                      .single();

            if (error && error.code === 'PGRST116') {
                        // Profile doesn't exist, create it
                      const newProfile: Partial<Profile> = {
                                    id: authUser.id,
                                    email: authUser.email || '',
                                    full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                                    avatar_url: authUser.user_metadata?.avatar_url || null,
                                    role: 'intern',
                      };

                      const { data: createdProfile, error: createError } = await supabase
                          .from('profiles')
                          .insert(newProfile)
                          .select()
                          .single();

                      if (createError) {
                                    console.error('Error creating profile:', createError);
                                    // Still set a basic user object so the UI doesn't get stuck
                          setUser({
                                          id: authUser.id,
                                          email: authUser.email || '',
                                          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                                          avatar_url: authUser.user_metadata?.avatar_url || null,
                                          role: 'intern',
                                          created_at: new Date().toISOString(),
                                          updated_at: new Date().toISOString(),
                          } as Profile);
                                    return;
                      }

                      setUser(createdProfile);
            } else if (error) {
                        console.error('Error fetching profile:', error);
                        // Set a fallback user object to prevent infinite loading
                      setUser({
                                    id: authUser.id,
                                    email: authUser.email || '',
                                    full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                                    avatar_url: authUser.user_metadata?.avatar_url || null,
                                    role: 'intern',
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString(),
                      } as Profile);
            } else {
                        setUser(profile);
            }
          } catch (error) {
                    console.error('Error in fetchProfile:', error);
                    setLoading(false);
          }
  }, [supabase]);

  useEffect(() => {
          // Get initial session
                const getInitialSession = async () => {
                          try {
                                      console.log('AuthProvider: Getting initial session...');
                                      const { data: { session }, error } = await supabase.auth.getSession();
                                      console.log('AuthProvider: Session result:', { hasSession: !!session, hasUser: !!session?.user, error });

                            if (error) {
                                          console.error('AuthProvider: Error getting session:', error);
                                          setLoading(false);
                                          return;
                            }

                            if (session?.user) {
                                          console.log('AuthProvider: Found user, fetching profile...');
                                          await fetchProfile(session.user);
                            } else {
                                          console.log('AuthProvider: No session found');
                            }
                          } catch (error) {
                                      console.error('AuthProvider: Error in getInitialSession:', error);
                          } finally {
                                      setLoading(false);
                          }
                };

                getInitialSession();

                // Listen for auth changes
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                          async (event: AuthChangeEvent, session: Session | null) => {
                                      console.log('AuthProvider: Auth state changed:', event, { hasSession: !!session });
                                      if (event === 'SIGNED_IN' && session?.user) {
                                                    await fetchProfile(session.user);
                                      } else if (event === 'SIGNED_OUT') {
                                                    setUser(null);
                                                    router.push('/login');
                                      }
                                      setLoading(false);
                          }
                        );

                return () => {
                          subscription.unsubscribe();
                };
  }, [fetchProfile, router, supabase.auth]);

  const signOut = async () => {
          await supabase.auth.signOut();
          setUser(null);
          router.push('/login');
  };

  return (
          <AuthContext.Provider value={{ user, loading, signOut }}>
              {children}
          </AuthContext.Provider>
        );
}

export function useAuth() {
      const context = useContext(AuthContext);
      if (context === undefined) {
              throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
}
