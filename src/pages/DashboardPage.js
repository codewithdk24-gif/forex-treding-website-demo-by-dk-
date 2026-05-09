'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TradingViewChart } from '../components/TradingViewChart';
import OrderPanel from '../components/OrderPanel';
import { useTradeStore } from '../store/useTradeStore';
import { useAuth } from '@/context/AuthContext';

import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const showNotification = useTradeStore(state => state.showNotification);
  const [currentPrice, setCurrentPrice] = useState(1.08245);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Format creation date: "Joined May 2024"
  const joinedDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

  const [isChartLoading, setIsChartLoading] = useState(true);

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
    <div className="flex h-screen bg-[#0f1115] overflow-hidden relative">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 selection:bg-blue-500/20">
        <DashboardHeader />

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

        {/* Main Layout */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
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

              {/* Mobile Floating Action Button */}
              <button 
                onClick={() => setIsMobileDrawerOpen(true)}
                className="md:hidden fixed bottom-6 right-6 z-[60] bg-blue-600 text-white w-14 h-14 rounded-full shadow-2xl shadow-blue-600/40 flex items-center justify-center active:scale-90 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              </button>

              {/* Mobile Price Floating Overlay */}
              <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/5 flex items-center gap-3 z-20">
                 <p className="text-sm font-black tracking-tighter text-white tabular-nums">{currentPrice.toFixed(5)}</p>
                 <span className="text-xs font-black text-green-500">+1.42%</span>
              </div>
           </div>

           {/* RIGHT: Order Panel (Desktop) */}
           <div className="hidden md:flex w-[340px] border-l border-white/10 bg-[#0b0f1a] flex-col shrink-0 overflow-y-auto">
              <OrderPanel />
           </div>

           {/* MOBILE: Order Drawer */}
           <div className={`md:hidden fixed inset-0 z-[110] transition-opacity duration-300 ${isMobileDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileDrawerOpen(false)}></div>
              <div className={`absolute bottom-0 left-0 right-0 bg-[#0b0f1a] border-t border-white/10 rounded-t-[2.5rem] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                 <div className="flex flex-col h-full max-h-[85vh]">
                    <div className="flex items-center justify-between px-8 pt-6 pb-2">
                       <h3 className="text-sm font-black text-white uppercase tracking-widest">Execute Trade</h3>
                       <button onClick={() => setIsMobileDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                       </button>
                    </div>
                    <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-4"></div>
                    <div className="flex-1 overflow-y-auto px-8 pb-12">
                       <OrderPanel isBottomSheet={true} />
                    </div>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
}
