import { createBrowserClient } from '@supabase/ssr';

// Provide placeholder values for build time when env vars aren't set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
