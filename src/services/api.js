/**
 * Real-world ready API Service layer using fetch.
 * Points to Next.js API routes (/api/*).
 */

export const TradeAPI = {
  // Fetch user profile
  fetchUserProfile: async (userId) => {
    try {
      const res = await fetch(`/api/user?id=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user profile');
      return await res.json();
    } catch (err) {
      console.error('API Error:', err);
      return { success: false, error: err.message };
    }
  },

  // Execute a market or limit order
  executeOrder: async (orderData, userId) => {
    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orderData, user_id: userId }),
      });
      if (!res.ok) throw new Error('Trade execution failed');
      return await res.json();
    } catch (err) {
      console.error('API Error:', err);
      return { success: false, error: err.message };
    }
  },

  // Close a trade
  closeTrade: async (tradeId, closePrice, pnl) => {
    try {
      const res = await fetch('/api/trade', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tradeId, closePrice, pnl }),
      });
      if (!res.ok) throw new Error('Failed to close trade');
      return await res.json();
    } catch (err) {
      console.error('API Error:', err);
      return { success: false, error: err.message };
    }
  },

  // Fetch trade history
  fetchTradeHistory: async (userId) => {
    try {
      const res = await fetch(`/api/trade?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch trades');
      return await res.json();
    } catch (err) {
      console.error('API Error:', err);
      return { success: false, error: err.message };
    }
  }
};
