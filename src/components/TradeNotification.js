'use client';

import React from 'react';
import { useTradeStore } from '../store/useTradeStore';

export default function TradeNotification() {
  const { tradeNotification } = useTradeStore();

  if (!tradeNotification) return null;

  const { type, message } = tradeNotification;

  const getIcon = () => {
    switch (type) {
      case 'BUY': return '▲';
      case 'SELL': return '▼';
      case 'TP': return '💰';
      case 'SL': return '🛑';
      case 'INFO': return 'ℹ️';
      case 'SUCCESS': return '✅';
      case 'ERROR': return '❌';
      default: return '✨';
    }
  };

  const getColors = () => {
    const isGreen = type === 'BUY' || type === 'TP' || type === 'SUCCESS';
    const isRed = type === 'SELL' || type === 'SL' || type === 'ERROR';
    const isBlue = type === 'INFO';
    
    if (isGreen) return 'border-green-500/30 shadow-green-500/20 text-green-500 bg-green-500/20';
    if (isRed) return 'border-red-500/30 shadow-red-500/20 text-red-500 bg-red-500/20';
    if (isBlue) return 'border-blue-500/30 shadow-blue-500/20 text-blue-500 bg-blue-500/20';
    
    return 'border-white/10 shadow-black/20 text-white bg-white/5';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none px-6 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className={`bg-[#0b0f1a]/95 backdrop-blur-3xl border px-10 py-12 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.6)] animate-premium-success text-center max-w-sm w-full pointer-events-auto ${getColors().split(' ').slice(0, 2).join(' ')}`}>
        <div className="flex flex-col items-center gap-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-inner animate-bounce-subtle ${getColors().split(' ').slice(2).join(' ')}`}>
            {getIcon()}
          </div>
          <div className="space-y-2">
            <h2 className={`text-2xl font-black uppercase tracking-tight ${getColors().split(' ').slice(2, 3).join('')}`}>
              {message}
            </h2>
            <p className="text-white font-black text-xs uppercase tracking-[0.3em] opacity-40">System Notification</p>
          </div>
        </div>
      </div>
    </div>
  );
}
