import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and API key
const supabaseUrl = 'https://dummy.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
