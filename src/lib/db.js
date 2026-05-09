import { supabase } from './supabaseClient';

export const db = {
  // --- Profiles ---
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // --- Wallets ---
  async getWallets(userId) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async getActiveWallet(userId, type = 'demo') {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .eq('account_type', type)
        .eq('is_active', true);

      if (error) throw error;

      if (!data || data.length === 0) {
        console.log("No wallet found, creating one...");
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert([{ user_id: userId, account_type: type, balance: 10000, is_active: true }])
          .select()
          .maybeSingle();
        
        if (createError) throw createError;
        return newWallet;
      }

      // If multiple, return the first one (safety)
      return data[0];
    } catch (err) {
      console.error("Wallet Fetch Error:", err.message);
      throw err;
    }
  },

  // --- Trades ---
  async getActiveTrades(userId) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getTradeHistory(userId, limit = 50) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'CLOSED')
      .order('closed_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async executeTrade(tradeData) {
    const { data, error } = await supabase
      .from('trades')
      .insert([tradeData])
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async closeTrade(tradeId, exitPrice, pnl) {
    const { error } = await supabase.rpc('close_trade', {
      trade_id: tradeId,
      final_exit_price: exitPrice,
      final_pnl: pnl
    });
    if (error) throw error;
    return true;
  },

  // --- Transactions ---
  async getTransactions(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createDepositRequest(depositData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...depositData, type: 'DEPOSIT', status: 'PENDING' }])
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // --- Watchlists ---
  async getWatchlist(userId) {
    const { data, error } = await supabase
      .from('watchlists')
      .select('symbol')
      .eq('user_id', userId);
    if (error) throw error;
    return data.map(item => item.symbol);
  },

  async toggleWatchlist(userId, symbol) {
    // Check if exists
    const { data: existing } = await supabase
      .from('watchlists')
      .select('*')
      .eq('user_id', userId)
      .eq('symbol', symbol)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', userId)
        .eq('symbol', symbol);
      if (error) throw error;
      return false; // Removed
    } else {
      const { error } = await supabase
        .from('watchlists')
        .insert([{ user_id: userId, symbol }]);
      if (error) throw error;
      return true; // Added
    }
  }
};
