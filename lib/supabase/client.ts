import { createBrowserClient } from '@supabase/ssr';

// Provide placeholder values for build time when env vars aren't set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a singleton client to ensure consistent session state across components
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
    if (typeof window === 'undefined') {
          // Server-side: always create a new client
      return createBrowserClient(supabaseUrl, supabaseAnonKey);
    }

  if (browserClient) {
        return browserClient;
  }

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return browserClient;
}
