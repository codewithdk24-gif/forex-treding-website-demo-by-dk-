'use client';

import React, { useState } from 'react';
import { useTradeStore } from '../store/useTradeStore';
import { useAuth } from '../context/AuthContext';
import * as db from '../lib/db';

export default function MobileExecutionBar() {
  const { user, wallet, refreshUserData } = useAuth();
  const { showNotification, activeSymbol, prices } = useTradeStore();

  const [lots, setLots] = useState(1.00);
  const [symbol, setSymbol] = useState(activeSymbol);
  const [isExecuting, setIsExecuting] = useState(false);

  const currentPrice = prices[activeSymbol] || 1.08245;

  React.useEffect(() => {
    setSymbol(activeSymbol);
  }, [activeSymbol]);

  const balance = wallet?.balance || 0;
  const marginRequired = lots * 450;

  const handleExecute = async (type) => {
    console.log("[MOBILE EXEC] Order Start:", { type, lots, symbol });
    if (!user || !wallet) {
      showNotification({ type: 'ERROR', message: 'Auth Required' });
      return;
    }

    if (balance < marginRequired) {
      showNotification({ type: 'ERROR', message: 'Insufficient Margin' });
      return;
    }

    setIsExecuting(true);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Mobile Node Timeout")), 10000)
    );

    try {
      const tradeData = {
        user_id: user.id,
        wallet_id: wallet.id,
        symbol,
        type,
        size: lots,
        entry_price: currentPrice,
        status: 'ACTIVE'
      };

      console.log("[MOBILE EXEC] Syncing to DB...");
      const executionPromise = db.executeTrade(tradeData);

      await Promise.race([executionPromise, timeoutPromise]);
      console.log("[MOBILE EXEC] Success");

      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`${type} Executed: ${lots} ${symbol}`, 'success');
      }

      setTimeout(() => {
        if (user?.id) {
          console.log("[MOBILE EXEC] Refreshing User Data");
          refreshUserData(user.id);
        }
      }, 800);

    } catch (err) {
      console.error("[MOBILE EXEC] Trade Error:", err.message || err);
      showNotification({
        type: 'ERROR',
        message: err.message === "Mobile Node Timeout" ? "Execution Timeout" : "Execution Failed"
      });
    } finally {
      console.log("[MOBILE EXEC] Cleanup");
      setIsExecuting(false);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[999] bg-[#0b0f1a]/95 backdrop-blur-xl border-t border-white/10 px-4 pt-3 pb-safe-area shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3 mb-3">
        {/* Lot Size Control */}
        <div className="flex-1 flex items-center bg-black/40 rounded-xl border border-white/5 h-11 overflow-hidden px-3">
          <span className="text-[10px] font-black text-gray-500 uppercase mr-2 shrink-0">Size</span>
          <input
            type="number"
            value={lots}
            onChange={(e) => setLots(parseFloat(e.target.value) || 0.01)}
            step="0.01"
            className="bg-transparent border-0 text-white font-black text-sm w-full focus:ring-0 p-0"
          />
          <div className="flex gap-1">
            <button onClick={() => setLots(prev => Math.max(0.01, prev - 0.1))} className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 text-gray-400 active:scale-90">-</button>
            <button onClick={() => setLots(prev => prev + 0.1)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 text-gray-400 active:scale-90">+</button>
          </div>
        </div>

        {/* Margin Info Badge */}
        <div className="shrink-0 px-3 h-11 bg-blue-600/10 rounded-xl border border-blue-500/20 flex flex-col justify-center">
          <span className="text-[7px] font-black text-blue-500 uppercase leading-none mb-0.5">Margin</span>
          <span className="text-[10px] font-black text-white leading-none">${marginRequired.toFixed(0)}</span>
        </div>
      </div>

      <div className="flex gap-3 h-14">
        <button
          onClick={() => handleExecute('BUY')}
          disabled={isExecuting}
          className="flex-1 bg-green-500 hover:bg-green-400 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-green-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          <span className="text-xs font-black tracking-widest uppercase">BUY</span>
          <span className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">Market Order</span>
        </button>

        <button
          onClick={() => handleExecute('SELL')}
          disabled={isExecuting}
          className="flex-1 bg-red-500 hover:bg-red-400 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-red-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          <span className="text-xs font-black tracking-widest uppercase">SELL</span>
          <span className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">Market Order</span>
        </button>
      </div>

      <div className="flex justify-between items-center mt-2 px-1">
        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Institutional STP Node</p>
        <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Balance: ${balance.toLocaleString()}</p>
      </div>
    </div>
  );
}
