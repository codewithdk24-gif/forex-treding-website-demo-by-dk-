import { createClient } from '@supabase/supabase-js';

// Environment variables are prefixed with NEXT_PUBLIC to be accessible in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback logic for production build stability
// If environment variables are missing (e.g. during Vercel build if not configured),
// we provide dummy values to prevent createClient from throwing an error.
// The app will still require these variables at runtime for actual functionality.
const finalUrl = supabaseUrl || 'https://jnjmhruxvhxqovrptgbl.supabase.co';
const finalKey = supabaseKey || 'placeholder-anon-key';

if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('[SUPABASE] Production environment variables missing! Auth and database will fail at runtime.');
  } else {
    console.warn('[SUPABASE] Local environment variables missing. Ensure .env.local is configured.');
  }
}

export const supabase = createClient(finalUrl, finalKey); 
