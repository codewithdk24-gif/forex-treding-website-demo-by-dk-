'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { TradingViewChart } from '../components/TradingViewChart';
import { useStore } from '../store/useStore';
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
      
      const symbol = activeSymbol || 'EUR/USD';
      const entryPrice = terminalPrice;

      const now = new Date();
      const timeString = now.toISOString().replace('T', ' ').split('.')[0];

      const newOrder = {
         id: 'T-' + Math.floor(10000 + Math.random() * 90000),
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
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || 'anonymous';
            
            console.log("[EXECUTION] Database Insert Start:", userId);
            const tradeData = {
               id: newOrder.id,
               user_id: userId,
               wallet_id: wallet?.id,
               symbol: newOrder.symbol,
               type: newOrder.type,
               size: parseFloat(newOrder.size),
               entry_price: parseFloat(newOrder.entry_price),
               status: newOrder.status,
               time: newOrder.time
            };

            const result = await db.executeTrade(tradeData);
            console.log("[EXECUTION] Database Insert Success:", result);
            return true;
         })();

         // Race between execution and timeout
         await Promise.race([executionPromise, timeoutPromise]);
         
         console.log("[EXECUTION] Flow Complete");
         if (window.showToast) {
            const toastType = orderType === 'BUY' ? 'success' : 'sell';
            const msg = `<span class="font-bold text-white">${orderType} Order Executed</span><br/>
                      <span class="text-[10px] text-gray-400 uppercase tracking-widest">${symbol} • ${parseFloat(lotSize).toFixed(2)} Lot</span>`;
            window.showToast(msg, toastType);
         }
      } catch (error) {
         console.error("[EXECUTION] Failure:", error.message || error);
         if (window.showToast) {
            window.showToast(`<span class="text-rose-500 font-bold">Execution Error</span><br/><span class="text-[10px] opacity-70">${error.message || 'Node Timeout'}</span>`, 'error');
         }
      } finally {
         console.log("[EXECUTION] Cleanup & UI Reset");
         window.dispatchEvent(new CustomEvent('tradeExecuted'));
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
      <div className="h-full bg-[#0d1117] text-white flex flex-col overflow-hidden selection:bg-blue-500/20 max-w-[1600px] mx-auto w-full relative border-x border-white/5 shadow-2xl">

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

         {/* Terminal Control Bar */}
         <div className="h-14 flex items-center justify-between px-4 md:px-6 bg-[#0d1117]/40 backdrop-blur-md border-b border-white/5 z-40 shrink-0">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
                  <BarChart3 size={14} className="text-blue-500" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{activeSymbol || 'EUR / USD'}</span>
               </div>
               
               <div className="hidden sm:flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/5">
                  <button onClick={() => setMode('demo')} className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'demo' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Demo</button>
                  <button onClick={() => setMode('live')} className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'live' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Live</button>
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="flex items-center gap-4 bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                  <p className={`text-lg font-black tracking-tighter tabular-nums ${priceColor} transition-all duration-300 leading-none`}>{terminalPrice}</p>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">+1.42%</span>
                  </div>
               </div>
               <div className="hidden md:flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-white transition-colors"><MousePointer2 size={16} /></button>
                  <button className="p-2 text-gray-500 hover:text-white transition-colors"><Crosshair size={16} /></button>
                  <button className="p-2 text-gray-500 hover:text-white transition-colors"><Timer size={16} /></button>
               </div>
            </div>
         </div>

         {/* Main Terminal Area */}
         <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            {/* Chart Area */}
            <div className="flex-1 relative bg-[#090c10] min-h-[40vh] md:min-h-0 overflow-hidden">
               {!isLoading && (
                  <div className="absolute inset-0 w-full h-full z-10">
                     <TradingViewChart symbol={activeSymbol || 'FX:EURUSD'} theme="dark" />
                  </div>
               )}
               
               {isLoading && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d1117]">
                     <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] animate-pulse">Syncing Liquidity Nodes...</p>
                  </div>
               )}

               {/* Mobile Header Overlay */}
               <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-black/70 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-4 z-20 shadow-2xl">
                  <p className={`text-sm font-black tracking-tighter tabular-nums ${priceColor} transition-all duration-300`}>{terminalPrice}</p>
                  <div className="w-px h-3 bg-white/10"></div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+1.42%</span>
               </div>
            </div>

            {/* Desktop Side Panel */}
            <div className="hidden md:flex w-[350px] border-l border-white/5 bg-[#0d1117] flex-col shrink-0 overflow-y-auto no-scrollbar relative z-30">
               <div className="p-8 space-y-10">
                  {/* Order Selector */}
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Execution Type</p>
                     <div className="flex bg-white/[0.03] rounded-2xl p-1.5 gap-1.5 border border-white/5">
                        <button className="flex-1 py-2.5 text-[10px] font-black rounded-xl bg-blue-600 text-white uppercase tracking-widest shadow-lg shadow-blue-600/20">Market</button>
                        <button className="flex-1 py-2.5 text-[10px] font-black rounded-xl text-gray-500 hover:text-white uppercase tracking-widest transition-all">Limit</button>
                        <button className="flex-1 py-2.5 text-[10px] font-black rounded-xl text-gray-500 hover:text-white uppercase tracking-widest transition-all">Stop</button>
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
                  <div className="space-y-4 pt-4 border-t border-white/5">
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
                  <div className="pt-8 space-y-4">
                     <button onClick={() => initiateOrder('BUY')}
                        className="w-full py-5 rounded-[2rem] bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] transition-all font-black text-xs uppercase tracking-[0.3em] text-white shadow-2xl shadow-emerald-900/30 ring-1 ring-white/10 flex items-center justify-center gap-3">
                        <ArrowUp size={18} strokeWidth={3} />
                        Execute Buy
                     </button>
                     <button onClick={() => initiateOrder('SELL')}
                        className="w-full py-5 rounded-[2rem] bg-rose-600 hover:bg-rose-500 active:scale-[0.97] transition-all font-black text-xs uppercase tracking-[0.3em] text-white shadow-2xl shadow-rose-900/30 ring-1 ring-white/10 flex items-center justify-center gap-3">
                        <ArrowDown size={18} strokeWidth={3} />
                        Execute Sell
                     </button>
                  </div>
               </div>
            </div>
         </main>

         {/* Mobile Bottom Execution Bar */}
         <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d1117]/95 backdrop-blur-3xl border-t border-white/10 px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_rgba(0,0,0,0.9)]">
            <div className="space-y-6">
               <div className="flex items-center justify-between gap-10">
                  <div className="flex-1 space-y-3">
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Trade Size</p>
                     <div className="flex items-center gap-4">
                        <button onClick={() => adjustLotSize(-0.01)} className="w-12 h-12 bg-white/[0.05] rounded-2xl border border-white/10 flex items-center justify-center font-black text-xl active:scale-90 text-gray-400">-</button>
                        <input type="number" value={lotSize} onChange={(e) => setLotSize(e.target.value)} step="0.01" className="w-16 bg-transparent text-center font-black text-xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                        <button onClick={() => adjustLotSize(0.01)} className="w-12 h-12 bg-white/[0.05] rounded-2xl border border-white/10 flex items-center justify-center font-black text-xl active:scale-90 text-gray-400">+</button>
                     </div>
                  </div>
                  <div className="text-right space-y-2 pt-4">
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+${formattedProfit} Profit</p>
                     <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">-${formattedRisk} Risk</p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => initiateOrder('SELL')} className="flex-1 py-5 rounded-[1.5rem] bg-rose-600 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-900/40 active:scale-95 transition-all ring-1 ring-white/10">Sell</button>
                  <button onClick={() => initiateOrder('BUY')} className="flex-1 py-5 rounded-[1.5rem] bg-emerald-600 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/40 active:scale-95 transition-all ring-1 ring-white/10">Buy</button>
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
