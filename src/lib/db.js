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
        console.log("[DB] No wallet found, creating institutional account...");
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert([{ user_id: userId, account_type: type, balance: 100000, is_active: true }])
          .select()
          .maybeSingle();
        
        if (createError) throw createError;
        return newWallet;
      }

      return data[0];
    } catch (err) {
      console.error("[DB] Wallet Fetch Error:", err.message);
      throw err;
    }
  },

  async updateWalletBalance(walletId, amount) {
    // amount can be positive (deposit) or negative (withdraw)
    const { data, error } = await supabase.rpc('update_wallet_balance', {
      w_id: walletId,
      amount_delta: amount
    });
    if (error) {
      // Fallback if RPC doesn't exist yet (though we should assume it does or use normal update)
      const { data: current } = await supabase.from('wallets').select('balance').eq('id', walletId).single();
      const newBalance = (current?.balance || 0) + amount;
      const { data: updated, error: upError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', walletId)
        .select()
        .single();
      if (upError) throw upError;
      return updated;
    }
    return data;
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
    // --- Defensive Validation ---
    const required = ['user_id', 'symbol', 'type', 'size', 'entry_price'];
    for (const field of required) {
      if (!tradeData[field]) {
        console.error(`[DB] VALIDATION FAILED: Missing ${field}`, tradeData);
        throw new Error(`Execution Error: Missing ${field}`);
      }
    }

    // Unify entry field (fallback for legacy code)
    const finalizedData = {
      ...tradeData,
      entry_price: tradeData.entry_price || tradeData.entry,
      size: parseFloat(tradeData.size)
    };
    
    // Clean legacy field
    delete finalizedData.entry;

    console.log("[DB] Executing Validated Trade Node:", finalizedData);

    const { data, error } = await supabase
      .from('trades')
      .insert([finalizedData])
      .select()
      .maybeSingle();
    
    if (error) {
      console.error("[DB] Supabase Insert Error:", error.message);
      throw error;
    }
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

  async createTransaction(txData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...txData, status: 'COMPLETED' }])
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
      return false;
    } else {
      const { error } = await supabase
        .from('watchlists')
        .insert([{ user_id: userId, symbol }]);
      if (error) throw error;
      return true;
    }
  }
};
