'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Profile, AuthContextType } from '@/lib/types';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
          const [user, setUser] = useState<Profile | null>(null);
          const [loading, setLoading] = useState(true);
          const router = useRouter();
          const isMounted = useRef(true);
          const initComplete = useRef(false);

  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(async (authUser: User) => {
              try {
                            const { data: profile, error } = await supabase
                              .from('profiles')
                              .select('*')
                              .eq('id', authUser.id)
                              .single();

                if (!isMounted.current) return;

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

                              if (!isMounted.current) return;

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
                              } else {
                                                setUser(createdProfile);
                              }
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
              } catch (err) {
                            console.error('Error in fetchProfile:', err);
              }
  }, [supabase]);

  useEffect(() => {
              isMounted.current = true;

                const safetyTimeout = setTimeout(() => {
                              if (isMounted.current && loading && !initComplete.current) {
                                              console.log('AuthProvider: Safety timeout triggered');
                                              setLoading(false);
                                              initComplete.current = true;
                              }
                }, 5000);

                const init = async () => {
                              try {
                                              const { data: { session }, error } = await supabase.auth.getSession();

                                if (!isMounted.current) return;

                                if (error) {
                                                  console.error('AuthProvider: Session error:', error);
                                } else if (session?.user) {
                                                  await fetchProfile(session.user);
                                }
                              } catch (err) {
                                              console.error('AuthProvider: Init error:', err);
                              } finally {
                                              if (isMounted.current) {
                                                                setLoading(false);
                                                                initComplete.current = true;
                                              }
                              }
                };

                init();

                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                              async (event: AuthChangeEvent, session: Session | null) => {
                                              if (!isMounted.current) return;

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
                              clearTimeout(safetyTimeout);
                              subscription.unsubscribe();
                };
  }, [fetchProfile, router, supabase.auth]);

  const signOut = async () => {
              try {
                            setLoading(true);
                            await supabase.auth.signOut();
                            setUser(null);
                            router.push('/login');
              } catch (err) {
                            console.error('Error signing out:', err);
              } finally {
                            if (isMounted.current) {
                                            setLoading(false);
                            }
              }
  };

  const value = useMemo(() => ({
              user,
              loading,
              signOut,
              supabase,
  }), [user, loading, supabase]);

  return React.createElement(AuthContext.Provider, { value: value }, children);
}

export function useAuth() {
          const context = useContext(AuthContext);
          if (context === undefined) {
                      throw new Error('useAuth must be used within an AuthProvider');
          }
          return context;
}
