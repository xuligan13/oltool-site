import { createClient } from '@supabase/supabase-js'

// IMPORTANT: These are placeholder values.
// Create a .env.local file and add your Supabase URL and Anon Key.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are not defined. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
