'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { TradingViewChart } from '../components/TradingViewChart';
import { useStore } from '../store/useStore';
import { db } from '../lib/db';
import { useAuth } from '../context/AuthContext';
import {
   Zap,
   TrendingUp,
   TrendingDown,
   ArrowUp,
   ArrowDown,
   Loader2,
   BarChart3,
   MousePointer2,
   Crosshair,
   Timer
} from 'lucide-react';

export const DashboardPage = () => {
   const [lotSize, setLotSize] = useState('0.50');
   const [orderType, setOrderType] = useState('BUY');
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isExecuting, setIsExecuting] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [terminalPrice, setTerminalPrice] = useState('1.08245');
   const [priceColor, setPriceColor] = useState('text-white');

   const { user, refreshUserData } = useAuth();

   const addOrder = useStore(state => state.addOrder);
   const prices = useStore(state => state.prices);
   const mode = useStore(state => state.mode);
   const setMode = useStore(state => state.setMode);
   const activeSymbol = useStore(state => state.activeSymbol);
   const wallet = useStore(state => state.wallet);

   const profit = (parseFloat(lotSize) * 640).toFixed(2);
   const risk = (parseFloat(lotSize) * 360).toFixed(2);
   const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
   const formattedProfit = formatter.format(profit);
   const formattedRisk = formatter.format(risk);

   const adjustLotSize = (delta) => {
      const current = parseFloat(lotSize);
      const newVal = Math.max(0.01, (current + delta)).toFixed(2);
      setLotSize(newVal);
   };

   const initiateOrder = (type) => {
      setOrderType(type);
      setIsModalOpen(true);
   };

   const closeOrderModal = () => {
      setIsModalOpen(false);
   };

   const executeOrder = async () => {
      console.log("[EXECUTION] Start:", { orderType, lotSize, activeSymbol });
      setIsExecuting(true);

      if (!db) {
         console.error("[EXECUTION] Critical Error: DB module not initialized");
         setIsExecuting(false);
         return;
      }

      if (!user) {
         console.error("[EXECUTION] Critical Error: Unauthenticated user attempt");
         if (window.showToast) window.showToast("Authentication Required", "error");
         setIsExecuting(false);
         return;
      }

      if (!wallet) {
         console.error("[EXECUTION] Critical Error: Wallet Node Not Linked");
         if (window.showToast) window.showToast("Wallet Connection Failed", "error");
         setIsExecuting(false);
         return;
      }

      const symbol = activeSymbol || 'EUR/USD';
      const entryPrice = terminalPrice;

      const now = new Date();
      const timeString = now.toISOString().replace('T', ' ').split('.')[0];

      const newOrder = {
         id: crypto.randomUUID(),
         time: timeString,
         symbol: symbol,
         type: orderType,
         size: parseFloat(lotSize).toFixed(2),
         entry_price: entryPrice,
         current: entryPrice,
         pl: 0,
         status: 'ACTIVE'
      };

      console.log("[EXECUTION] Local State Update:", newOrder.id);
      addOrder(newOrder);

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
         setTimeout(() => reject(new Error("Execution Timeout (10s)")), 10000)
      );

      try {
         console.log("[EXECUTION] Syncing to Supabase...");

         const executionPromise = (async () => {
            console.log("[EXECUTION_START] Initiating Node Sync...");
            const startTime = Date.now();
            const tradeData = {
               id: newOrder.id,
               user_id: user.id,
               wallet_id: wallet.id,
               symbol: newOrder.symbol,
               type: newOrder.type,
               size: parseFloat(newOrder.size),
               entry_price: parseFloat(newOrder.entry_price),
               status: newOrder.status
            };

            console.log("[INSERT_START] Sending to Supabase Trades Layer...");
            const result = await db.executeTrade(tradeData);
            console.log(`[INSERT_SUCCESS] Trade Node Synchronized in ${Date.now() - startTime}ms:`, result?.id);
            return true;
         })();

         // Race between execution and timeout
         await Promise.race([executionPromise, timeoutPromise]);

         console.log("[EXECUTION_COMPLETE] Flow Success");
         if (window.showToast) {
            const toastType = orderType === 'BUY' ? 'success' : 'sell';
            const msg = `<span class="font-bold text-white">${orderType} Order Executed Successfully</span><br/>
                      <span class="text-[10px] text-gray-400 uppercase tracking-widest">${symbol} • ${parseFloat(lotSize).toFixed(2)} Lot</span>`;
            window.showToast(msg, toastType);
         }

         // Refresh data to reflect wallet balance change
         if (refreshUserData && user?.id) {
            console.log("[SYNC_START] Updating Wallet and Positions...");
            refreshUserData(user.id);
         }

      } catch (err) {
         console.error("[EXECUTION] Failure:", err.message || err);
         if (window.showToast) {
            window.showToast(`Execution Failed: ${err.message || 'Node Error'}`, 'error');
         }
      } finally {
         console.log("[EXECUTION] Loading State Cleanup");
         setIsExecuting(false);
         closeOrderModal();
      }
   };

   // Institutional Price Sync (Using local store simulator)
   useEffect(() => {
      const loadTimer = setTimeout(() => setIsLoading(false), 1200);

      const symbolKey = activeSymbol || 'EUR/USD';

      const interval = setInterval(() => {
         const currentPrice = prices[symbolKey];
         if (currentPrice) {
            setTerminalPrice(prev => {
               const prevVal = parseFloat(prev);
               if (currentPrice > prevVal) setPriceColor('text-emerald-500');
               else if (currentPrice < prevVal) setPriceColor('text-rose-500');
               setTimeout(() => setPriceColor('text-white'), 800);
               return currentPrice.toFixed(5);
            });
         }
      }, 500);

      return () => {
         clearTimeout(loadTimer);
         clearInterval(interval);
      };
   }, [activeSymbol, prices]);

   return (
      <div className="min-h-[100dvh] lg:h-[100dvh] bg-[#0d1117] text-white flex flex-col overflow-x-hidden lg:overflow-hidden selection:bg-blue-500/20 max-w-[1600px] mx-auto w-full relative border-x border-white/5 shadow-2xl">

         {/* Institutional Ticker - Compact Desktop Only */}
         <div className="hidden lg:flex shrink-0 bg-black/40 border-b border-white/5 py-1.5 overflow-hidden">
            <div className="global-ticker gap-10 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
               {Array(4).fill().map((_, i) => (
                  <span key={i} style={{ display: 'contents' }}>
                     <span className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">BTC/USD <span className="text-emerald-500 tabular-nums">{prices['BTC/USD'] ? formatter.format(prices['BTC/USD']) : '94,241.50'}</span></span>
                     <span className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">EUR/USD <span className="text-rose-500 tabular-nums">{prices['EUR/USD'] ? prices['EUR/USD'].toFixed(5) : '1.08240'}</span></span>
                     <span className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">XAU/USD <span className="text-emerald-500 tabular-nums">{prices['XAU/USD'] ? formatter.format(prices['XAU/USD']) : '2,342.10'}</span></span>
                     <span className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">ETH/USD <span className="text-rose-500 tabular-nums">3,542.80</span></span>
                  </span>
               ))}
            </div>
         </div>

         {/* Terminal Control Bar - Compact for Mobile */}
         <div className="h-10 lg:h-14 flex items-center justify-between px-3 md:px-6 bg-[#0d1117]/40 backdrop-blur-md border-b border-white/5 z-40 shrink-0">
            <div className="flex items-center gap-3 lg:gap-6">
               <div className="hidden lg:flex items-center gap-3 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
                  <BarChart3 size={14} className="text-blue-500" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{activeSymbol || 'EUR / USD'}</span>
               </div>

               <div className="flex items-center bg-white/[0.03] p-0.5 lg:p-1 rounded-lg lg:rounded-xl border border-white/5">
                  <button onClick={() => setMode('demo')} className={`px-2 lg:px-4 py-1 text-[8px] lg:text-[9px] font-black uppercase tracking-widest rounded-md lg:rounded-lg transition-all ${mode === 'demo' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Demo</button>
                  <button onClick={() => setMode('live')} className={`px-2 lg:px-4 py-1 text-[8px] lg:text-[9px] font-black uppercase tracking-widest rounded-md lg:rounded-lg transition-all ${mode === 'live' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Live</button>
               </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
               <div className="hidden lg:flex items-center gap-4 bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                  <p className={`text-lg font-black tracking-tighter tabular-nums ${priceColor} transition-all duration-300 leading-none`}>{terminalPrice}</p>
                  <div className="flex flex-col">
                     <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">+1.42%</span>
                  </div>
               </div>
               <div className="flex items-center gap-1 lg:gap-2">
                  <button className="p-1.5 text-gray-500 hover:text-white transition-colors"><MousePointer2 size={14} /></button>
                  <button className="p-1.5 text-gray-500 hover:text-white transition-colors"><Crosshair size={14} /></button>
                  <button className="p-1.5 text-gray-500 hover:text-white transition-colors lg:block hidden"><Timer size={14} /></button>
               </div>
            </div>
         </div>

         {/* Main Terminal Area */}
         <main className="flex-1 flex flex-col md:flex-row relative h-auto lg:h-full">
            {/* Chart Area */}
            <div className="flex-1 relative bg-[#090c10] h-full overflow-hidden pb-24 lg:pb-0">
               {!isLoading && (
                  <div className="absolute inset-0 w-full h-full z-10 pl-0 md:pl-0">
                     <TradingViewChart symbol={activeSymbol || 'FX:EURUSD'} theme="dark" />
                  </div>
               )}

               {isLoading && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d1117]">
                     <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] animate-pulse">Syncing Liquidity Nodes...</p>
                  </div>
               )}

               {/* Compact Mobile Floating Info Strip */}
               <div className="lg:hidden absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-xl rounded-lg border border-white/10 flex items-center gap-2.5 z-20 shadow-2xl pointer-events-none ring-1 ring-white/10">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{activeSymbol || 'EUR/USD'}</span>
                  <div className="w-px h-2.5 bg-white/10"></div>
                  <p className={`text-[11px] font-black tracking-tighter tabular-nums ${priceColor} transition-all duration-300`}>{terminalPrice}</p>
                  <div className="w-px h-2.5 bg-white/10"></div>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">+1.42%</span>
               </div>
            </div>

            {/* Desktop Side Panel */}
            <div className="hidden md:flex w-[350px] border-l border-white/5 bg-[#0d1117] flex-col shrink-0 overflow-y-auto relative z-30">
               <div className="p-5 pb-20 space-y-5">
                  {/* Order Selector */}
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Execution Type</p>
                     <div className="flex bg-white/[0.03] rounded-2xl p-1 gap-1 border border-white/5">
                        <button className="flex-1 py-2 text-[10px] font-black rounded-xl bg-blue-600 text-white uppercase tracking-widest shadow-lg shadow-blue-600/20">Market</button>
                        <button className="flex-1 py-2 text-[10px] font-black rounded-xl text-gray-500 hover:text-white uppercase tracking-widest transition-all">Limit</button>
                        <button className="flex-1 py-2 text-[10px] font-black rounded-xl text-gray-500 hover:text-white uppercase tracking-widest transition-all">Stop</button>
                     </div>
                  </div>

                  {/* Lot Size Input */}
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Position Size</p>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Standard Lot</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <button onClick={() => adjustLotSize(-0.01)} className="w-14 h-14 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-center font-black text-xl hover:bg-white/10 transition-all active:scale-90 text-gray-400">−</button>
                        <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl relative overflow-hidden group focus-within:border-blue-500/50 transition-all">
                           <input type="number" value={lotSize} onChange={(e) => setLotSize(e.target.value)} step="0.01" min="0.01"
                              className="w-full h-14 bg-transparent text-center font-black text-xl text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                        </div>
                        <button onClick={() => adjustLotSize(0.01)} className="w-14 h-14 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-center font-black text-xl hover:bg-white/10 transition-all active:scale-90 text-gray-400">+</button>
                     </div>
                     <div className="flex justify-between p-5 bg-gradient-to-br from-white/[0.03] to-transparent rounded-3xl border border-white/5 border-dashed">
                        <div className="text-center flex-1">
                           <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5">Max Profit</p>
                           <p className="text-sm font-black text-emerald-500 tabular-nums tracking-tight">+${formattedProfit}</p>
                        </div>
                        <div className="w-px h-10 bg-white/5 self-center"></div>
                        <div className="text-center flex-1">
                           <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5">Max Risk</p>
                           <p className="text-sm font-black text-rose-500 tabular-nums tracking-tight">−${formattedRisk}</p>
                        </div>
                     </div>
                  </div>

                  {/* Order Stats */}
                  <div className="space-y-3 pt-3 border-t border-white/5">
                     {[
                        { label: 'Market Spread', val: '0.2 pips' },
                        { label: 'Commission Fee', val: '$0.10 / lot' },
                        { label: 'Margin Required', val: '$100.00' },
                        { label: 'Trade Leverage', val: '1:500' },
                     ].map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">{s.label}</span>
                           <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest tabular-nums">{s.val}</span>
                        </div>
                     ))}
                  </div>

                  {/* Execution Buttons */}
                  {/* Execution Buttons */}
                  <div className="pt-2 grid grid-cols-2 gap-3">
                     <button onClick={() => initiateOrder('BUY')}
                        className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] transition-all font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-2xl shadow-emerald-900/30 ring-1 ring-white/10 flex flex-col items-center justify-center gap-1.5">
                        <ArrowUp size={16} strokeWidth={3} />
                        Buy
                     </button>
                     <button onClick={() => initiateOrder('SELL')}
                        className="py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-[0.97] transition-all font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-2xl shadow-rose-900/30 ring-1 ring-white/10 flex flex-col items-center justify-center gap-1.5">
                        <ArrowDown size={16} strokeWidth={3} />
                        Sell
                     </button>
                  </div>
               </div>
            </div>
         </main>

         {/* Mobile Bottom Execution Bar - Institutional Layout */}
         <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d1117]/95 backdrop-blur-2xl border-t border-white/10 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col gap-2">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-white/[0.03] px-2 py-1 rounded-lg border border-white/5">
                     <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">SIZE:</p>
                     <input type="number" value={lotSize} onChange={(e) => setLotSize(e.target.value)} step="0.01" className="w-10 bg-transparent text-center font-black text-[10px] text-white focus:outline-none" />
                  </div>
                  <div className="flex gap-3">
                     <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">PROFIT: +${formattedProfit}</p>
                     <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest">RISK: -${formattedRisk}</p>
                  </div>
               </div>

               <div className="flex gap-2">
                  <button onClick={() => initiateOrder('SELL')} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-900/30 active:scale-95 transition-all">Sell</button>
                  <button onClick={() => initiateOrder('BUY')} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/30 active:scale-95 transition-all">Buy</button>
               </div>
            </div>
         </div>

         {/* Professional Order Confirmation Modal */}
         {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
               <div className="absolute inset-0 bg-[#0d1117]/90 backdrop-blur-2xl" onClick={closeOrderModal}></div>

               <div className="relative w-full max-w-md bg-[#131722] border border-white/10 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-400"></div>

                  <div className="text-center space-y-8">
                     <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-2 shadow-inner ring-1 ring-white/10 ${orderType === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {orderType === 'BUY' ? <TrendingUp size={40} /> : <TrendingDown size={40} />}
                     </div>

                     <div className="space-y-3">
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Execution <span className={orderType === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}>{orderType}</span></h2>
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Sub-Millisecond Node Confirmation</p>
                     </div>

                     <div className="space-y-5 py-10 border-y border-white/[0.05]">
                        {[
                           { label: 'Pair / Symbol', val: activeSymbol || 'EUR / USD', color: 'text-white' },
                           { label: 'Position Size', val: `${lotSize} Lots`, color: 'text-white' },
                           { label: 'Execution Mode', val: 'Market Direct', color: 'text-blue-500' },
                           { label: 'Target Margin', val: '$100.00', color: 'text-gray-500' },
                        ].map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                              <span className={`text-[11px] font-black uppercase tracking-[0.1em] ${item.color}`}>{item.val}</span>
                           </div>
                        ))}
                     </div>

                     <div className="flex flex-col gap-4 pt-4">
                        <button
                           onClick={executeOrder}
                           disabled={isExecuting}
                           className="w-full py-5 rounded-[1.5rem] bg-blue-600 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/40 transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 disabled:opacity-75 ring-1 ring-white/20"
                        >
                           {isExecuting ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} className="fill-white" />}
                           {isExecuting ? 'Processing Transaction...' : 'Confirm Execution'}
                        </button>
                        <button onClick={closeOrderModal} className="w-full py-4 bg-transparent text-gray-700 font-black text-[10px] uppercase tracking-[0.4em] hover:text-white transition-all active:scale-95">Abort Trade Node</button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default DashboardPage;
