import { createClient } from './server';
import type { Profile } from '../types';

/**
 * Check if user is authenticated via Supabase session
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

/**
 * Get the current authenticated user from Supabase
 */
export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

/**
 * Get the current authenticated user's ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<Profile> {
  const profile = await getCurrentUser();
  if (!profile) {
    throw new Error('Authentication required');
  }
  return profile;
}

/**
 * Check if current user is a member of a team
 */
export async function isTeamMember(teamId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: membership } = await supabase
    .from('team_members')
    .select('id')
    .eq('team_id', teamId)
    .eq('profile_id', user.id)
    .single();

  return !!membership;
}

/**
 * Require team membership - throws if not a member
 */
export async function requireTeamMembership(teamId: string): Promise<void> {
  const isMember = await isTeamMember(teamId);
  if (!isMember) {
    throw new Error('Team membership required');
  }
}
