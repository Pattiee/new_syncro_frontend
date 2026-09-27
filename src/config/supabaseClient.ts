import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey: string = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables. Check your active .env configuration properties.");
}

// Strongly type the resulting exported client instantiation node
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);