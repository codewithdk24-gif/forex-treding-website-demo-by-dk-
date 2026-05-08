-- Simplified Schema for Reliable Auth

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  balance NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Profiles are updatable by owner" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. Deposits Table (Kept for the manual deposit system)
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  utr TEXT UNIQUE NOT NULL,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on deposits
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own deposits" 
ON public.deposits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own deposits" 
ON public.deposits FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Atomic Balance Increment Function
CREATE OR REPLACE FUNCTION public.increment_balance(user_id UUID, amount_to_add NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET balance = balance + amount_to_add,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- IMPORTANT: REMOVE TRIGGERS IF THEY BLOCK SIGNUP
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user;
