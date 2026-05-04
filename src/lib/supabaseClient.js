import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Safety check to prevent "supabaseUrl is required" generic error
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env variables missing. Please check .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

