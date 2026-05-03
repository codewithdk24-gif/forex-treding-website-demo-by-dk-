import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTradeStore = create(
  persist(
    (set, get) => ({
      balance: 289341.15,
      trades: [],
      activityLogs: [],
      tradeNotification: null,
      
      showNotification: (notification) => {
        set({ tradeNotification: notification });
        // Auto-clear after 2 seconds
        setTimeout(() => {
          const current = get().tradeNotification;
          if (current?.id === notification.id) {
            set({ tradeNotification: null });
          }
        }, 2000);
      },

      executeTrade: (trade) => {
        const activeCount = get().trades.filter(t => t.status === 'ACTIVE').length;
        if (activeCount >= 5) {
          throw new Error('Maximum 5 open positions allowed. Close existing trades to open new ones.');
        }

        set((state) => ({
          balance: state.balance - 10,
          trades: [trade, ...state.trades],
          activityLogs: [{ id: Date.now(), msg: `${trade.type} ${trade.symbol} executed`, time: new Date().toLocaleTimeString() }, ...state.activityLogs].slice(0, 10)
        }));

        get().showNotification({
          id: Date.now(),
          type: trade.type,
          message: `${trade.type} Order Executed`
        });
      },
      
      updateEngineState: (symbol, price) => {
        const { trades, activityLogs } = get();
        let notification = null;
        let newLogs = [...activityLogs];

        const updatedTrades = trades.map(t => {
          if (t.status !== 'ACTIVE' || t.symbol !== symbol) return t;
          
          const diff = t.type === 'BUY' ? (price - t.entry) : (t.entry - price);
          const pnl = diff * t.size * 100000;
          
          let shouldClose = false;
          let reason = 'MANUAL';

          if (t.type === 'BUY') {
            if (t.tp > 0 && price >= t.tp) { shouldClose = true; reason = 'TP HIT'; }
            if (t.sl > 0 && price <= t.sl) { shouldClose = true; reason = 'SL HIT'; }
          } else {
            if (t.tp > 0 && price <= t.tp) { shouldClose = true; reason = 'TP HIT'; }
            if (t.sl > 0 && price >= t.sl) { shouldClose = true; reason = 'SL HIT'; }
          }

          if (shouldClose) {
            notification = { 
              id: Date.now() + Math.random(), 
              type: reason.includes('TP') ? 'TP' : 'SL', 
              message: `${reason}: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}` 
            };
            newLogs = [{ id: Date.now() + Math.random(), msg: `${reason}: ${t.symbol} closed @ ${price.toFixed(5)}`, time: new Date().toLocaleTimeString() }, ...newLogs].slice(0, 10);
            return {
              ...t,
              status: 'CLOSED',
              closePrice: price.toFixed(5),
              closeTime: new Date().toISOString(),
              pl: pnl.toFixed(2),
              result: pnl >= 0 ? 'PROFIT' : 'LOSS',
              closeReason: reason
            };
          }

          return { ...t, current: price.toFixed(5), pl: pnl.toFixed(2) };
        });

        if (notification) {
           set((state) => ({
             balance: state.balance + parseFloat(notification.message.split('$')[1]),
             trades: updatedTrades,
             activityLogs: newLogs
           }));
           get().showNotification(notification);
        } else {
          set({ trades: updatedTrades });
        }
      },

      closeTrade: (id, reason = 'MANUAL') => {
        const trade = get().trades.find(t => t.id === id);
        if (!trade || trade.status !== 'ACTIVE') return;

        const pnl = parseFloat(trade.pl);
        set((state) => ({
          balance: state.balance + pnl,
          activityLogs: [{ id: Date.now(), msg: `Manual Close: ${trade.symbol}`, time: new Date().toLocaleTimeString() }, ...state.activityLogs].slice(0, 10),
          trades: state.trades.map(t => 
            t.id === id ? { 
              ...t, 
              status: 'CLOSED', 
              closeTime: new Date().toISOString(),
              closeReason: reason,
              result: pnl >= 0 ? 'PROFIT' : 'LOSS'
            } : t
          )
        }));

        get().showNotification({
          id: Date.now(),
          type: pnl >= 0 ? 'TP' : 'SL',
          message: `Trade Closed: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`
        });
      },

      clearHistory: () => set({ trades: [], activityLogs: [], tradeNotification: null }),
    }),
    {
      name: 'trading-terminal-storage',
    }
  )
);
