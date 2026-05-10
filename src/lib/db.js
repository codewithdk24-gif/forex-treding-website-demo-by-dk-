import { supabase } from './supabaseClient';

// Institutional Timeout Guard (7 seconds)
const withTimeout = async (promise, timeoutMs = 7000) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Supabase Operation Timeout")), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

export const db = {
  // --- Profiles ---
  async getProfile(userId) {
    try {
      const result = await withTimeout(
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()
      );
      if (result.error) throw result.error;
      return result.data;
    } catch (error) {
      console.error(`[DB] getProfile Error: ${error.message}`);
      throw error;
    }
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
    console.log(`[DB] getActiveWallet Start: ${userId} (${type})`);
    try {
      const result = await withTimeout(
        supabase
          .from('wallets')
          .select('*')
          .eq('user_id', userId)
          .eq('account_type', type)
          .eq('is_active', true)
      );

      if (result.error) throw result.error;
      const data = result.data;

      if (!data || data.length === 0) {
        console.log("[DB] No wallet found, creating institutional account...");
        const createResult = await withTimeout(
          supabase
            .from('wallets')
            .insert([{ user_id: userId, account_type: type, balance: 100000, is_active: true }])
            .select()
            .maybeSingle()
        );
        
        if (createResult.error) throw createResult.error;
        console.log("[DB] getActiveWallet: Created New Wallet");
        return createResult.data;
      }

      console.log(`[DB] getActiveWallet Success: ${data[0].id}`);
      return data[0];
    } catch (err) {
      console.error("[DB] getActiveWallet Error:", err.message);
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
    console.log("[DB] executeTrade Initiation:", tradeData.symbol);
    
    // --- Defensive Validation ---
    const required = ['user_id', 'symbol', 'type', 'size', 'entry_price'];
    for (const field of required) {
      if (!tradeData[field]) {
        console.error(`[DB] VALIDATION FAILED: Missing ${field}`, tradeData);
        throw new Error(`Execution Error: Missing ${field}`);
      }
    }

    // UUID Validation (Postgres UUID column will hang or fail on 'anonymous' or non-UUID formats)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!tradeData.user_id || !uuidRegex.test(tradeData.user_id)) {
       console.error("[DB] INVALID USER UUID:", tradeData.user_id);
       throw new Error("Execution Error: Invalid Institutional Session");
    }

    if (tradeData.id && !uuidRegex.test(tradeData.id)) {
       console.warn("[DB] INVALID TRADE UUID provided, allowing Supabase to generate:", tradeData.id);
       delete tradeData.id;
    }

    // Strict Schema Mapping (Prevents "column does not exist" errors)
    const finalizedData = {
      user_id: tradeData.user_id,
      wallet_id: tradeData.wallet_id,
      symbol: tradeData.symbol,
      type: tradeData.type,
      size: parseFloat(tradeData.size),
      entry_price: parseFloat(tradeData.entry_price || tradeData.entry),
      status: tradeData.status || 'ACTIVE',
      tp: tradeData.tp ? parseFloat(tradeData.tp) : null,
      sl: tradeData.sl ? parseFloat(tradeData.sl) : null,
      pnl: parseFloat(tradeData.pnl || 0)
    };

    if (tradeData.id && uuidRegex.test(tradeData.id)) {
      finalizedData.id = tradeData.id;
    }

    console.log("[DB] Supabase Insert Start:", finalizedData.symbol);

    try {
      const result = await withTimeout(
        supabase
          .from('trades')
          .insert([finalizedData])
          .select()
          .maybeSingle()
      );
      
      if (result.error) {
        console.error("[DB] Supabase Insert Error:", result.error.message);
        throw result.error;
      }
      
      const data = result.data;
      console.log("[DB] Supabase Insert Success:", data?.id);
      return data;
    } catch (err) {
      console.error("[DB] executeTrade Critical Failure:", err.message);
      throw err;
    }
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
    const finalizedTx = {
      user_id: txData.user_id,
      wallet_id: txData.wallet_id,
      amount: parseFloat(txData.amount),
      type: txData.type,
      asset: txData.asset || 'USD',
      status: 'COMPLETED'
    };
    const { data, error } = await supabase
      .from('transactions')
      .insert([finalizedTx])
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

export default db;

