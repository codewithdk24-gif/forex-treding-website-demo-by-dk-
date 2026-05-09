'use client';

import React, { useState } from 'react';
import { useTradeStore } from '@/store/useTradeStore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';

export default function OrderPanel({ isBottomSheet = false }) {
  const { user, profile, wallet, refreshUserData } = useAuth();
  const { showNotification } = useTradeStore();
  
  const [type, setType] = useState('BUY');
  const [lots, setLots] = useState(1.00);
  const [symbol] = useState('EUR/USD');
  const [isExecuting, setIsExecuting] = useState(false);

  const balance = wallet?.balance || 0;
  const marginRequired = lots * 450; // Institutional margin calculation

  const handleExecute = async () => {
    if (!user) {
      showNotification({ type: 'ERROR', message: 'Authentication Required' });
      return;
    }

    if (balance < marginRequired) {
      showNotification({ type: 'ERROR', message: 'Insufficient Margin' });
      return;
    }

    setIsExecuting(true);
    
    try {
      const tradeData = {
        user_id: user.id,
        wallet_id: wallet.id,
        symbol,
        type,
        size: lots,
        entry_price: 1.08245, // In production, this comes from a real-time price feed
        status: 'ACTIVE'
      };

      await db.executeTrade(tradeData);
      
      // Refresh wallet balance to show impact of trade (margin used)
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`${type} Order Executed: ${lots} ${symbol}`, 'success');
      }
      
      // Wait a moment for database triggers to finish then refresh
      setTimeout(() => {
        if (user?.id) refreshUserData(user.id);
      }, 800);

    } catch (err) {
      console.error("Trade Execution Error:", err);
      showNotification({ type: 'ERROR', message: 'Execution Failed' });
    } finally {
      setIsExecuting(false);
    }
  };

  const isBuy = type === 'BUY';

  return (
    <div className={`${isBottomSheet ? 'w-full' : 'w-full h-full flex flex-col bg-[#131722]/50 backdrop-blur-sm'} transition-colors duration-300`}>
      {!isBottomSheet && (
        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-black tracking-tight text-white uppercase">Execution</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{symbol}</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[7px] font-black text-gray-500 uppercase mb-0">{wallet?.account_type === 'demo' ? 'Demo Balance' : 'Account Balance'}</p>
               <p className="text-xs font-black text-white">${Number(balance).toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2.5 border-t border-white/5">
             <div>
                <p className="text-[7px] font-black text-gray-500 uppercase mb-0">Margin Req.</p>
                <p className="text-xs font-black text-blue-500">${marginRequired.toFixed(2)}</p>
             </div>
             <div className="text-right">
                <p className="text-[7px] font-black text-gray-500 uppercase mb-0">Avail. Bal</p>
                <p className="text-xs font-black text-green-500">${(balance - marginRequired).toLocaleString()}</p>
             </div>
          </div>
        </div>
      )}

      <div className={`flex-1 ${isBottomSheet ? 'p-0' : 'p-5'} space-y-5`}>
        {/* Order Type */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Order Type</label>
          <div className="flex bg-[#0f1115] border border-white/5 rounded-xl p-1">
            <button className="flex-1 py-1.5 text-xs font-black rounded-lg bg-blue-600/10 text-blue-500 shadow-sm">Market</button>
            <button className="flex-1 py-1.5 text-xs font-bold text-gray-500 hover:text-white transition-colors">Limit</button>
            <button className="flex-1 py-1.5 text-xs font-bold text-gray-500 hover:text-white transition-colors">Stop</button>
          </div>
        </div>

        {/* Position Direction */}
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setType('BUY')} 
            className={`py-3 rounded-xl font-black text-xs tracking-widest transition-all active:scale-95 ${isBuy ? 'border-2 border-green-500 bg-green-500/10 text-green-500 shadow-lg shadow-green-500/10' : 'border border-white/5 bg-[#0f1115] text-gray-500'}`}
          >
            BUY
          </button>
          <button 
            onClick={() => setType('SELL')} 
            className={`py-3 rounded-xl font-black text-xs tracking-widest transition-all active:scale-95 ${!isBuy ? 'border-2 border-red-500 bg-red-500/10 text-red-500 shadow-lg shadow-red-500/10' : 'border border-white/5 bg-[#0f1115] text-gray-500'}`}
          >
            SELL
          </button>
        </div>

        {/* Position Size */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Position Size</label>
          <div className="relative group">
            <input 
              type="number" 
              value={lots} 
              onChange={(e) => setLots(parseFloat(e.target.value) || 0)}
              step="0.01" 
              className="input-field py-3 pr-16 text-lg font-black text-white bg-[#0f1115] border-white/5 w-full h-11" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-500">LOTS</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[0.01, 0.1, 0.5, 1.0].map(val => (
              <button 
                key={val}
                onClick={() => setLots(val)} 
                className={`py-1.5 text-xs font-black rounded-lg bg-[#0f1115] border border-white/5 hover:border-blue-500/50 hover:text-blue-500 transition-all ${lots === val ? 'text-blue-500 border-blue-500/30' : 'text-gray-500'}`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Management */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Take Profit</label>
            <input type="text" placeholder="None" className="input-field py-2 text-sm text-white border-white/5 bg-[#0f1115] h-9 w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Stop Loss</label>
            <input type="text" placeholder="None" className="input-field py-2 text-sm text-white border-white/5 bg-[#0f1115] h-9 w-full" />
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-3 bg-[#0f1115]/50 border border-dashed border-white/5 rounded-xl space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-gray-500 uppercase tracking-wider">Margin Required</span>
            <span className="text-white font-black">${marginRequired.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-gray-500 uppercase tracking-wider">Pip Value</span>
            <span className="text-blue-500 font-black">${(lots * 10).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={`${isBottomSheet ? 'pt-4' : 'p-5 border-t border-white/5 bg-[#131722]'}`}>
        <button 
          onClick={handleExecute}
          disabled={isExecuting || !wallet}
          className={`${isBuy ? 'btn-success' : 'btn-danger'} w-full py-4 text-xs font-black tracking-widest uppercase shadow-xl active:scale-[0.98] h-14 disabled:opacity-50`}
        >
          {isExecuting ? 'EXECUTING...' : `Execute ${type}`}
        </button>
        <p className="text-[9px] text-gray-500/50 text-center mt-3 font-bold uppercase tracking-tighter leading-tight">
          Direct Node Execution (STP)
        </p>
      </div>
    </div>
  );
}
