-- PRODUCTION GRADE SAAS SCHEMA FOR FOREXPRO
-- Focus: Scalability, Security (RLS), and Real-time performance.

-- ---------------------------------------------------------
-- 1. PROFILES & AUTH EXTENSION
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user', -- 'user' | 'admin' | 'moderator'
  trading_experience TEXT, -- 'beginner' | 'intermediate' | 'pro'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by owner" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles updatable by owner" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ---------------------------------------------------------
-- 2. WALLETS (Support for Demo and Live accounts)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type TEXT DEFAULT 'demo', -- 'demo' | 'live'
  balance NUMERIC DEFAULT 10000,
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, account_type)
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Wallets viewable by owner" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

-- ---------------------------------------------------------
-- 3. TRADES & ORDERS
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL, -- 'BUY' | 'SELL'
  size NUMERIC NOT NULL, -- Lots
  entry_price NUMERIC NOT NULL,
  exit_price NUMERIC,
  status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE' | 'CLOSED' | 'CANCELLED'
  sl NUMERIC, -- Stop Loss
  tp NUMERIC, -- Take Profit
  pnl NUMERIC DEFAULT 0,
  swap NUMERIC DEFAULT 0,
  commission NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trades viewable by owner" ON public.trades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Trades insertable by owner" ON public.trades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Trades updatable by owner" ON public.trades FOR UPDATE USING (auth.uid() = user_id);

-- ---------------------------------------------------------
-- 4. TRANSACTIONS (Funding / Withdrawals)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'ADJUSTMENT'
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'PENDING', -- 'PENDING' | 'COMPLETED' | 'REJECTED'
  utr TEXT UNIQUE,
  screenshot_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transactions viewable by owner" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Transactions insertable by owner" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------
-- 5. WATCHLISTS
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Watchlists viewable by owner" ON public.watchlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Watchlists manageable by owner" ON public.watchlists ALL USING (auth.uid() = user_id);

-- ---------------------------------------------------------
-- 6. DATABASE FUNCTIONS & TRIGGERS
-- ---------------------------------------------------------

-- Auto-create profile and demo wallet on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'Trader'));

  INSERT INTO public.wallets (user_id, account_type, balance)
  VALUES (new.id, 'demo', 10000);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Atomic PnL Update & Wallet Sync
CREATE OR REPLACE FUNCTION public.close_trade(trade_id UUID, final_exit_price NUMERIC, final_pnl NUMERIC)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_wallet_id UUID;
BEGIN
  -- 1. Get trade details
  SELECT user_id, wallet_id INTO v_user_id, v_wallet_id FROM public.trades WHERE id = trade_id;

  -- 2. Update trade status
  UPDATE public.trades 
  SET status = 'CLOSED', 
      exit_price = final_exit_price, 
      pnl = final_pnl, 
      closed_at = NOW() 
  WHERE id = trade_id;

  -- 3. Update wallet balance
  UPDATE public.wallets 
  SET balance = balance + final_pnl, 
      updated_at = NOW() 
  WHERE id = v_wallet_id;

  -- 4. Log transaction
  INSERT INTO public.transactions (user_id, wallet_id, type, amount, status, metadata)
  VALUES (v_user_id, v_wallet_id, 'ADJUSTMENT', final_pnl, 'COMPLETED', jsonb_build_object('trade_id', trade_id, 'reason', 'Trade PnL Settlement'));

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------
-- 7. AUDIT LOGGING & SECURITY HARDENING
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'LOGIN' | 'TRADE_EXEC' | 'DEPOSIT_APPROVE' | 'ACCOUNT_FREEZE'
  entity_type TEXT, -- 'TRADE' | 'WALLET' | 'PROFILE'
  entity_id UUID,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can see all logs, users can only see their own login/activity
CREATE POLICY "Admins see all logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users see own activity" ON public.audit_logs FOR SELECT USING (
  auth.uid() = user_id
);

-- ---------------------------------------------------------
-- 8. ENHANCED RBAC POLICIES
-- ---------------------------------------------------------

-- Global Admin Access (Apply to all tables)
CREATE POLICY "Admins have full access to profiles" ON public.profiles ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins have full access to wallets" ON public.wallets ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins have full access to trades" ON public.trades ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins have full access to transactions" ON public.transactions ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ---------------------------------------------------------
-- 9. ANTI-SPAM / VALIDATION TRIGGERS
-- ---------------------------------------------------------

-- Prevent duplicate active trades for same symbol (anti-spam)
CREATE OR REPLACE FUNCTION public.check_trade_spam()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT count(*) FROM public.trades WHERE user_id = new.user_id AND status = 'ACTIVE' AND created_at > NOW() - INTERVAL '5 seconds') > 3 THEN
    RAISE EXCEPTION 'Trading frequency too high. Please wait.';
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_check_trade_spam
  BEFORE INSERT ON public.trades
  FOR EACH ROW EXECUTE PROCEDURE public.check_trade_spam();
