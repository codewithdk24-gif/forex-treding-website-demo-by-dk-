'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TradingViewChart } from '../components/TradingViewChart';
import OrderPanel from '../components/OrderPanel';
import { useTradeStore } from '../store/useTradeStore';

export default function DashboardPage() {
  const router = useRouter();
  const showNotification = useTradeStore(state => state.showNotification);
  const [currentPrice, setCurrentPrice] = useState(1.08245);

  const [isChartLoading, setIsChartLoading] = useState(true);

  // Auth is handled by AuthContext — no localStorage guard needed here

  useEffect(() => {
    const priceInterval = setInterval(() => {
      const rand = (Math.random() * 0.00004 - 0.00002);
      setCurrentPrice(prev => parseFloat((prev + rand).toFixed(5)));

      if (Math.random() > 0.95) {
        const assets = ['EUR/USD', 'GBP/USD', 'BTC/USD', 'XAU/USD'];
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const msgs = ['High Volatility Detected', 'Liquidity Surge', 'Institutional Block Trade'];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        showNotification({ type: 'INFO', message: `${msg} on ${asset}` });
      }
    }, 1500);

    const timer = setTimeout(() => setIsChartLoading(false), 2000);

    return () => {
      clearInterval(priceInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0 selection:bg-blue-500/20 h-full">
      {/* Global Ticker */}
      <div className="global-ticker-wrap hidden md:flex shrink-0">
         <div className="global-ticker gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
            {Array(4).fill().map((_, i) => (
              <React.Fragment key={i}>
                <span className="flex items-center gap-2">BTC/USD <span className="text-green-500">94,241.50</span></span>
                <span className="flex items-center gap-2">EUR/USD <span className="text-red-500">1.0824</span></span>
                <span className="flex items-center gap-2">GBP/JPY <span className="text-green-500">191.45</span></span>
                <span className="flex items-center gap-2">XAU/USD <span className="text-green-500">2342.10</span></span>
                <span className="flex items-center gap-2">ETH/USD <span className="text-red-500">3542.80</span></span>
                <span className="flex items-center gap-2">NQ100 <span className="text-green-500">18254.25</span></span>
              </React.Fragment>
            ))}
         </div>
      </div>

      {/* Top Trading Bar */}
      <nav className="h-14 md:h-16 border-b border-white/[0.05] flex items-center justify-between px-4 md:px-6 shrink-0 bg-[#0f1115]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
           <button onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))} className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
           </button>
           <button onClick={() => router.push('/')} className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
           </button>

           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs">FX</div>
              <div>
                 <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm tracking-tight">EUR/USD</h3>
                    <div className="flex items-center gap-1.5 bg-red-500/10 px-1.5 py-0.5 rounded">
                       <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                       <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Live</span>
                    </div>
                 </div>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Institutional Terminal v2.4</p>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-right hidden sm:block">
              <p className="text-lg font-black tracking-tighter text-white tabular-nums animate-price-flicker">
                {currentPrice.toFixed(5)}
              </p>
              <p className="text-xs font-black text-green-500 uppercase tracking-widest">+1.42%</p>
           </div>
           <div className="w-px h-8 bg-white/5 hidden md:block"></div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
         {/* LEFT: Chart Area FULL WIDTH */}
         <div className="flex-1 relative bg-[#0d0f14] min-h-[40vh] md:min-h-0 h-full w-full">
            {isChartLoading && (
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none z-20">
                 <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest animate-pulse">Initializing Data Feed...</p>
              </div>
            )}
            <div className="w-full h-full">
               <TradingViewChart symbol="FX:EURUSD" />
            </div>

            {/* Mobile Price Floating Overlay */}
            <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/5 flex items-center gap-3 z-20">
               <p className="text-sm font-black tracking-tighter text-white tabular-nums">{currentPrice.toFixed(5)}</p>
               <span className="text-xs font-black text-green-500">+1.42%</span>
            </div>
         </div>

         {/* RIGHT: Order Panel ONLY HERE */}
         <div className="hidden md:flex w-[340px] border-l border-white/10 bg-[#0b0f1a] flex-col shrink-0 overflow-y-auto">
            <OrderPanel />
         </div>
      </main>
    </div>
  );
}
