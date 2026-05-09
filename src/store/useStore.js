import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export const useStore = create((set, get) => ({
  // --- Core State ---
  trades: [],
  notifications: [],
  prices: { 'EUR/USD': 1.08245, 'BTC/USD': 94240.00 },
  isHydrated: false,

  // --- Real-time Sync Logic ---
  initializeRealtime: (userId) => {
    if (!userId) return;

    // 1. Initial Load
    const fetchInitialData = async () => {
      const { data: trades } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      set({ trades: trades || [], isHydrated: true });
    };

    fetchInitialData();

    // 2. Setup Real-time Channel
    const channel = supabase
      .channel(`user-trades-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const currentTrades = get().trades;
          
          if (payload.eventType === 'INSERT') {
            set({ trades: [payload.new, ...currentTrades] });
            get().showNotification({ type: 'SUCCESS', message: `Trade Executed: ${payload.new.symbol}` });
          } 
          else if (payload.eventType === 'UPDATE') {
            const updated = currentTrades.map(t => t.id === payload.new.id ? payload.new : t);
            set({ trades: updated });
            if (payload.new.status === 'CLOSED') {
               get().showNotification({ 
                 type: payload.new.pnl >= 0 ? 'SUCCESS' : 'ERROR', 
                 message: `Trade Closed: ${payload.new.pnl >= 0 ? '+' : ''}${payload.new.pnl.toFixed(2)} USD` 
               });
            }
          }
          else if (payload.eventType === 'DELETE') {
            set({ trades: currentTrades.filter(t => t.id !== payload.old.id) });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // --- Actions ---
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

  // Legacy compatibility / Mock helpers
  addOrder: async (orderData) => {
     // In Phase 2, this calls Supabase via db.js directly in the component,
     // and the store updates via Realtime. This is just a fallback.
     return;
  }
}));

// Compatibility Alias
export const useTradeStore = useStore;
