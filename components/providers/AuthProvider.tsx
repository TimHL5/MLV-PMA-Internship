'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Profile, AuthContextType } from '@/lib/types';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
        const [user, setUser] = useState<Profile | null>(null);
        const [loading, setLoading] = useState(true);
        const router = useRouter();
        const isMounted = useRef(false);

  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(async (authUser: User) => {
            try {
                        const { data: profile, error } = await supabase
                          .from('profiles')
                          .select('*')
                          .eq('id', authUser.id)
                          .single();

              if (error && error.code === 'PGRST116') {
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
            isMounted.current = true;

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
                                          if (error instanceof Error && error.name === 'AbortError') return;
                                          console.error('AuthProvider: Error in getInitialSession:', error);
                            } finally {
                                          if (isMounted.current) setLoading(false);
                            }
                };

                getInitialSession();

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
                            isMounted.current = false;
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
            </AuthContext.Provider>AuthContext.Provider>
          );
}

export function useAuth() {
        const context = useContext(AuthContext);
        if (context === undefined) {
                  throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
}
