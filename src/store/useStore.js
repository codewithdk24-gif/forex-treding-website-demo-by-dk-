import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  wallet: { balance: 10000 },
  orders: [],
  prices: { 'EUR/USD': 1.08245, 'BTC/USD': 94240.00 },
  mode: 'demo', // 'demo' | 'live'

  // Load initial state from localStorage safely (CSR only)
  syncFromLocalStorage: () => {
    if (typeof window === 'undefined') return;
    
    const user = localStorage.getItem('current_user') || null;
    const wallet = JSON.parse(localStorage.getItem('demo_wallet') || '{"balance": 10000}');
    const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    
    set({ user, wallet, orders });
  },

  updateWallet: (amount) => {
    set((state) => {
      const newWallet = { ...state.wallet, balance: state.wallet.balance + amount };
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo_wallet', JSON.stringify(newWallet));
      }
      return { wallet: newWallet };
    });
  },

  addOrder: (order) => {
    set((state) => {
      const newOrders = [order, ...state.orders];
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo_orders', JSON.stringify(newOrders));
      }
      return { orders: newOrders };
    });
  },

  updateOrders: (updatedOrders) => {
    set({ orders: updatedOrders });
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_orders', JSON.stringify(updatedOrders));
    }
  },

  updatePrices: (newPrices) => {
    set((state) => ({
      prices: { ...state.prices, ...newPrices }
    }));
  },

  setMode: (mode) => set({ mode })
}));
