import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { db } from '@/lib/db';

export const useStore = create((set, get) => ({
  // --- Core State ---
  trades: [],
  wallet: { balance: 100000, currency: 'USD', id: null },
  notifications: [],
  prices: { 'EUR/USD': 1.08245, 'BTC/USD': 94240.00, 'XAU/USD': 2342.10, 'GBP/USD': 1.26450 },
  priceHistory: {},
  activeSymbol: 'EUR/USD',
  isHydrated: false,
  connectionStatus: 'LIVE',
  mode: 'demo',

  // --- Actions ---
  addOrder: (order) => set((state) => ({ 
    trades: [order, ...state.trades] 
  })),

  setMode: (mode) => set({ mode }),
  
  setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),
  
  updateWallet: (amount) => set((state) => ({ 
    wallet: { ...state.wallet, balance: state.wallet.balance + amount } 
  })),

  syncWallet: async (userId) => {
    try {
      const walletData = await db.getActiveWallet(userId, get().mode);
      if (walletData) {
        set({ wallet: { balance: walletData.balance, currency: 'USD', id: walletData.id } });
      }
    } catch (err) {
      console.error("[INFRA] Wallet Sync Error:", err);
    }
  },

  // Functional Transaction Engine
  executeTransaction: async (userId, type, amount, asset = 'USD') => {
    try {
      const currentWallet = get().wallet;
      if (!currentWallet.id) {
         const w = await db.getActiveWallet(userId, get().mode);
         currentWallet.id = w.id;
      }

      if (type === 'WITHDRAW' && currentWallet.balance < amount) {
        get().showNotification({ type: 'ERROR', message: 'Insufficient Margin for Withdrawal' });
        return false;
      }

      const delta = type === 'DEPOSIT' ? amount : -amount;
      
      // Atomic Update
      await db.updateWalletBalance(currentWallet.id, delta);
      
      // Create Record
      await db.createTransaction({
        user_id: userId,
        wallet_id: currentWallet.id,
        amount: amount,
        type: type,
        asset: asset,
        time: new Date().toISOString()
      });

      // Update Local State
      set({ wallet: { ...currentWallet, balance: currentWallet.balance + delta } });
      
      get().showNotification({ 
        type: 'SUCCESS', 
        message: `${type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} of $${amount.toLocaleString()} Successful` 
      });

      return true;
    } catch (err) {
      console.error("[INFRA] Transaction Execution Error:", err);
      get().showNotification({ type: 'ERROR', message: 'Transaction Node Failure' });
      return false;
    }
  },

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  activeChannel: null,

  // --- Real-time Sync Logic (Supabase ONLY) ---
  initializeRealtime: (userId) => {
    if (!userId) return;

    if (get().activeChannel) {
      console.log("[INFRA] Realtime Singleton: Already Active");
      return;
    }

    console.log("[INFRA] Initializing Supabase Realtime Engine...");

    const fetchInitialData = async () => {
      set({ connectionStatus: 'SYNCING' });
      const { data: trades } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      const walletData = await db.getActiveWallet(userId, get().mode);
      
      set({ 
        trades: trades || [], 
        wallet: { balance: walletData?.balance || 0, currency: 'USD', id: walletData?.id },
        isHydrated: true, 
        connectionStatus: 'LIVE' 
      });
    };

    fetchInitialData();

    const channelName = `infra-sync-${userId}`;
    const channel = supabase.channel(channelName);
    
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'trades', filter: `user_id=eq.${userId}` },
      (payload) => {
        const currentTrades = get().trades;
        if (payload.eventType === 'INSERT') {
          set({ trades: [payload.new, ...currentTrades] });
        } else if (payload.eventType === 'UPDATE') {
          set({ trades: currentTrades.map(t => t.id === payload.new.id ? payload.new : t) });
        } else if (payload.eventType === 'DELETE') {
          set({ trades: currentTrades.filter(t => t.id !== payload.old.id) });
        }
      }
    ).on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'wallets', filter: `user_id=eq.${userId}` },
      (payload) => {
        if (payload.new.account_type === get().mode) {
          set({ wallet: { ...get().wallet, balance: payload.new.balance } });
        }
      }
    );

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        set({ connectionStatus: 'LIVE' });
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        set({ connectionStatus: 'OFFLINE' });
      }
    });

    set({ activeChannel: channel });

    // Price Simulation Engine (Consolidated)
    const priceInterval = setInterval(() => {
      const currentPrices = get().prices;
      const newPrices = { ...currentPrices };
      const history = get().priceHistory;
      const newHistory = { ...history };

      Object.keys(currentPrices).forEach(symbol => {
        const volatility = symbol.includes('BTC') ? 15 : (symbol.includes('XAU') ? 0.3 : 0.00004);
        const change = (Math.random() * 2 - 1) * volatility;
        newPrices[symbol] = parseFloat((currentPrices[symbol] + change).toFixed(symbol.includes('USD') && !symbol.includes('BTC') ? 5 : 2));
        
        if (!newHistory[symbol]) newHistory[symbol] = [];
        newHistory[symbol] = [...newHistory[symbol], newPrices[symbol]].slice(-20);
      });

      set({ prices: newPrices, priceHistory: newHistory });

      // Trade Trigger Logic
      const activeTrades = (get().trades || []).filter(t => t.status === 'ACTIVE' || t.status === 'PENDING');
      activeTrades.forEach(async (trade) => {
        const currentPrice = newPrices[trade.symbol];
        if (!currentPrice) return;

        if (trade.status === 'PENDING') {
           const isBuy = trade.type === 'BUY';
           const entry = trade.entry_price;
           let shouldTrigger = false;
           if (isBuy && currentPrice <= entry) shouldTrigger = true;
           if (!isBuy && currentPrice >= entry) shouldTrigger = true;
           if (shouldTrigger) {
              await supabase.from('trades').update({ status: 'ACTIVE' }).eq('id', trade.id);
           }
        }

        if (trade.status === 'ACTIVE') {
           const isBuy = trade.type === 'BUY';
           let shouldClose = false;
           if (trade.tp && ((isBuy && currentPrice >= trade.tp) || (!isBuy && currentPrice <= trade.tp))) shouldClose = true;
           if (trade.sl && ((isBuy && currentPrice <= trade.sl) || (!isBuy && currentPrice >= trade.sl))) shouldClose = true;
           
           if (shouldClose) {
              const diff = isBuy ? (currentPrice - trade.entry_price) : (trade.entry_price - currentPrice);
              const multiplier = trade.symbol.includes('JPY') ? 1000 : (trade.symbol.includes('BTC') ? 1 : 100000);
              const finalPnl = diff * trade.size * multiplier;
              await db.closeTrade(trade.id, currentPrice, finalPnl);
           }
        }
      });
    }, 1500);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(priceInterval);
      set({ activeChannel: null });
    };
  },

  showNotification: (note) => {
    const id = Date.now();
    set((state) => ({
      notifications: [...state.notifications, { ...note, id }]
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: get().notifications.filter(n => n.id !== id)
      }));
    }, 4000);
  },

  updatePrices: (newPrices) => set((state) => ({
    prices: { ...state.prices, ...newPrices }
  })),

  calculateUnrealizedPnL: (trade) => {
    const currentPrice = get().prices[trade.symbol];
    if (!currentPrice || trade.status !== 'ACTIVE') return 0;
    const isBuy = trade.type === 'BUY';
    const diff = isBuy ? (currentPrice - trade.entry_price) : (trade.entry_price - currentPrice);
    const multiplier = trade.symbol.includes('JPY') ? 1000 : (trade.symbol.includes('BTC') ? 1 : 100000);
    return diff * trade.size * multiplier;
  }
}));

export const useTradeStore = useStore;
