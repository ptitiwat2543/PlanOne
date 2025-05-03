import { createClient } from '@supabase/supabase-js';

// URLs from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if URLs are defined (null-check)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

// Create a singleton instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
