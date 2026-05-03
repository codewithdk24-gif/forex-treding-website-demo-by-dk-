'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { TradingViewChart } from '../components/TradingViewChart';
import { useStore } from '../store/useStore';
import { io } from 'socket.io-client';

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
  const updatePrices = useStore(state => state.updatePrices);
  const mode = useStore(state => state.mode);
  const setMode = useStore(state => state.setMode);

  // Profit/Risk previews
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
    console.log("EXECUTE CLICKED");
    setIsExecuting(true);

    const symbol = 'EUR/USD';
    const entryPrice = terminalPrice;

    console.log("DOM reads →", { symbol, size: lotSize, type: orderType, entryPrice });

    const now = new Date();
    const timeString = now.getFullYear() + '-' + 
                       String(now.getMonth()+1).padStart(2, '0') + '-' + 
                       String(now.getDate()).padStart(2, '0') + ' ' + 
                       String(now.getHours()).padStart(2, '0') + ':' + 
                       String(now.getMinutes()).padStart(2, '0') + ':' + 
                       String(now.getSeconds()).padStart(2, '0');

    const newOrder = {
      id: 'T-' + Math.floor(10000 + Math.random() * 90000),
      time: timeString,
      symbol: symbol,
      type: orderType,
      size: parseFloat(lotSize).toFixed(2),
      entry: entryPrice,
      current: entryPrice,
      pl: 0,
      status: 'ACTIVE'
    };

    console.log("New Order:", newOrder);

    // Update Zustand and localStorage
    addOrder(newOrder);
    console.log("Saved Order to Zustand & LocalStorage:", newOrder);

    // Hybrid Storage (Supabase)
    try {
      const userId = localStorage.getItem('current_user') || 'anonymous';
      const { error } = await supabase.from('orders').insert([{
        id: newOrder.id,
        user_id: userId,
        symbol: newOrder.symbol,
        type: newOrder.type,
        size: newOrder.size,
        entry: newOrder.entry,
        status: newOrder.status,
        time: newOrder.time
      }]);
      if (error) throw error;
      console.log("Supabase insert success");
    } catch (error) {
      console.log("Supabase error", error);
    }

    console.log("FINAL ORDER SAVED:", newOrder);

    // Dispatch global event for reactive updates
    window.dispatchEvent(new CustomEvent('tradeExecuted'));
    console.log("EVENT FIRED");

    setIsExecuting(false);
    closeOrderModal();

    if (window.showToast) {
      const toastType = orderType === 'BUY' ? 'success' : 'sell';
      const msg = `<span class="font-bold text-white">${orderType} Order Executed</span><br/>
                   <span class="text-xs text-gray-400">${symbol} • ${parseFloat(lotSize).toFixed(2)} Lot • Ticket ${newOrder.id}</span>`;
      window.showToast(msg, toastType);
    }
  };

  useEffect(() => {
    // Mount TradingViewChart
    TradingViewChart('tv-chart-container', 'FX:EURUSD', 'dark');

    // Simulated initial data load
    const loadTimer = setTimeout(() => setIsLoading(false), 1200);

    const socket = io('http://localhost:3001');
    let priceInterval = null;

    socket.on('connect', () => {
      console.log('Connected to socket price server');
      if (priceInterval) {
        clearInterval(priceInterval);
        priceInterval = null;
      }
    });

    socket.on('priceUpdate', (newPrices) => {
      // Update global Zustand store always to keep ticker fresh
      updatePrices(newPrices);

      // Only update terminal price if in LIVE mode
      const currentMode = useStore.getState().mode;
      if (currentMode === 'live') {
        setTerminalPrice(prev => {
          const currentPrice = newPrices['EUR/USD'];
          const prevPriceFloat = parseFloat(prev);
          
          if (currentPrice > prevPriceFloat) setPriceColor('text-green-500');
          else if (currentPrice < prevPriceFloat) setPriceColor('text-red-500');
          
          setTimeout(() => {
            setPriceColor('text-white');
          }, 800);

          return currentPrice.toFixed(5);
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket price server. Initiating fallback.');
      startFallback();
    });

    const startFallback = () => {
      if (priceInterval) clearInterval(priceInterval);
      priceInterval = setInterval(() => {
        // Only update if in DEMO mode
        const currentMode = useStore.getState().mode;
        if (currentMode === 'demo') {
          setTerminalPrice(prev => {
            const base = 1.08240;
            const rand = (Math.random() * 0.00004 - 0.00002).toFixed(5);
            const currentPrice = parseFloat(prev) || base;
            const newPrice = (currentPrice + parseFloat(rand)).toFixed(5);

            setPriceColor(newPrice > currentPrice ? 'text-green-500' : 'text-red-500');
            
            setTimeout(() => {
              setPriceColor('text-white');
            }, 800);

            return newPrice;
          });
        }

        // Random volatility notifications
        if (Math.random() > 0.98 && window.showToast) {
           const assets = ['EUR/USD', 'GBP/USD', 'BTC/USD', 'XAU/USD'];
           const asset = assets[Math.floor(Math.random() * assets.length)];
           const msgs = ['High Volatility Detected', 'Liquidity Surge', 'Institutional Block Trade'];
           const msg = msgs[Math.floor(Math.random() * msgs.length)];
           window.showToast(`${msg} on ${asset}`, 'info');
        }
      }, 1500);
    };

    // Start fallback initially until socket successfully connects
    startFallback();

    return () => {
      clearTimeout(loadTimer);
      socket.disconnect();
      if (priceInterval) clearInterval(priceInterval);
    };
  }, []);

  return (
    <div className="h-[100dvh] bg-[#0f1115] text-white flex flex-col overflow-hidden selection:bg-blue-500/20">
      
      {/* Global Ticker */}
      <div className="global-ticker-wrap hidden md:flex shrink-0">
         <div className="global-ticker gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
            {Array(4).fill().map((_, i) => (
              <span key={i} style={{ display: 'contents' }}>
                <span className="flex items-center gap-2">BTC/USD <span className="text-green-500">{prices['BTC/USD'] ? formatter.format(prices['BTC/USD']) : '94,241.50'}</span></span>
                <span className="flex items-center gap-2">EUR/USD <span className="text-red-500">{prices['EUR/USD'] ? prices['EUR/USD'].toFixed(5) : '1.08240'}</span></span>
                <span className="flex items-center gap-2">GBP/JPY <span className="text-green-500">191.45</span></span>
                <span className="flex items-center gap-2">XAU/USD <span className="text-green-500">{prices['XAU/USD'] ? formatter.format(prices['XAU/USD']) : '2,342.10'}</span></span>
                <span className="flex items-center gap-2">ETH/USD <span className="text-red-500">3,542.80</span></span>
                <span className="flex items-center gap-2">NQ100 <span className="text-green-500">18,254.25</span></span>
              </span>
            ))}
         </div>
      </div>

      {/* Top Trading Bar */}
      <nav className="h-14 md:h-16 border-b border-white/[0.05] flex items-center justify-between px-4 md:px-6 shrink-0 bg-[#0f1115]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
           <button onClick={() => window.navigateApp && window.navigateApp('/')} className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
           </button>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs">FX</div>
              <div>
                 <div className="flex items-center gap-2">
                     <h3 className="font-black text-sm tracking-tight" id="terminal-symbol">EUR/USD</h3>
                     <div className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded ${mode === 'live' ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${mode === 'live' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${mode === 'live' ? 'text-green-500' : 'text-orange-500'}`}>
                           {mode === 'live' ? 'Live Mode' : 'Demo Mode'}
                        </span>
                     </div>
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Institutional Terminal v2.4</p>
               </div>
            </div>
         </div>
        
        <div className="flex items-center gap-6">
           {/* Mode Toggle */}
           <div className="hidden lg:flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
              <button 
                 onClick={() => setMode('demo')}
                 className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'demo' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                 Demo
              </button>
              <button 
                 onClick={() => setMode('live')}
                 className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'live' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                 Live
              </button>
           </div>
           <div className="text-right hidden sm:block">
              <p className={`text-lg font-black tracking-tighter tabular-nums animate-price-flicker ${priceColor}`} style={{ transition: 'color 0.3s ease-in-out' }} id="terminal-price">{terminalPrice}</p>
              <p className="text-xs font-black text-green-500 uppercase tracking-widest">+1.42%</p>
           </div>
           <div className="w-px h-8 bg-white/5 hidden md:block"></div>
           <div className="hidden md:flex items-center gap-2">
              <button onClick={() => window.toggleChartFullscreen && window.toggleChartFullscreen()} className="p-2 text-gray-500 hover:text-white transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
              </button>
           </div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">

         {/* LEFT: Chart Area */}
         <div className="flex-1 relative bg-[#0d0f14] min-h-[40vh] md:min-h-0">
             <div id="tv-chart-container" className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`} data-symbol="FX:EURUSD"></div>
             {isLoading && (
               <div className="absolute inset-0 p-4 bg-[#0f1115] z-0 flex items-center justify-center">
                 <div className="w-full h-full skeleton opacity-20"></div>
                 <div className="absolute flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest animate-pulse">Initializing Data Feed...</p>
                 </div>
               </div>
             )}

            {/* Mobile Price Floating Overlay */}
            <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/5 flex items-center gap-3 z-20">
               <p className={`text-sm font-black tracking-tighter tabular-nums ${priceColor}`} style={{ transition: 'color 0.3s ease-in-out' }} id="mobile-terminal-price">{terminalPrice}</p>
               <span className="text-xs font-black text-green-500">+1.42%</span>
            </div>
         </div>

         {/* RIGHT: Desktop Execution Panel */}
         <div className="hidden md:flex w-[340px] border-l border-white/10 bg-[#0b0f1a] flex-col shrink-0 overflow-y-auto relative">
            {isLoading && (
              <div className="absolute inset-0 z-50 bg-[#0b0f1a] p-6 space-y-8">
                 <div className="space-y-4">
                    <div className="w-24 h-3 skeleton"></div>
                    <div className="w-full h-10 skeleton"></div>
                 </div>
                 <div className="space-y-4 pt-4">
                    <div className="w-32 h-3 skeleton"></div>
                    <div className="w-full h-12 skeleton"></div>
                 </div>
                 <div className="space-y-4 pt-4">
                    <div className="w-40 h-3 skeleton"></div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="h-10 skeleton"></div>
                       <div className="h-10 skeleton"></div>
                    </div>
                 </div>
                 <div className="pt-20 space-y-4">
                    <div className="w-full h-14 skeleton"></div>
                    <div className="w-full h-14 skeleton"></div>
                 </div>
              </div>
            )}
            
            {/* Panel Header */}
            <div className="px-6 pt-5 pb-4 border-b border-white/5">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Order Type</p>
               <div className="flex bg-white/5 rounded-xl p-1 gap-1">
                  <button className="flex-1 py-1.5 text-[10px] font-black rounded-lg bg-blue-600 text-white uppercase tracking-widest">Market</button>
                  <button className="flex-1 py-1.5 text-[10px] font-black rounded-lg text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Limit</button>
                  <button className="flex-1 py-1.5 text-[10px] font-black rounded-lg text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Stop</button>
               </div>
            </div>

            {/* Lot Size */}
            <div className="px-6 py-4 border-b border-white/5 space-y-3">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Position Size (Lots)</p>
               <div className="flex items-center gap-3">
                  <button onClick={() => adjustLotSize(-0.01)} className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-bold text-lg hover:bg-white/10 transition-colors">−</button>
                  <input type="number" id="desktop-lot-input" value={lotSize} onChange={(e) => setLotSize(e.target.value)} step="0.01" min="0.01"
                     className="flex-1 bg-white/5 border border-white/10 rounded-xl text-center font-black text-lg text-white py-2 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button onClick={() => adjustLotSize(0.01)} className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-bold text-lg hover:bg-white/10 transition-colors">+</button>
               </div>
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-green-500" id="desktop-profit-preview">+${formattedProfit} Gain</span>
                  <span className="text-red-500" id="desktop-risk-preview">−${formattedRisk} Risk</span>
               </div>
            </div>

            {/* TP / SL */}
            <div className="px-6 py-4 border-b border-white/5 space-y-3">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Take Profit / Stop Loss</p>
               <div className="grid grid-cols-2 gap-2">
                  <div>
                     <p className="text-[9px] text-gray-600 font-bold mb-1">Take Profit</p>
                     <input type="number" placeholder="0.00000" className="w-full bg-white/5 border border-green-500/20 rounded-lg px-3 py-2 text-xs font-mono text-green-400 focus:outline-none focus:border-green-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  </div>
                  <div>
                     <p className="text-[9px] text-gray-600 font-bold mb-1">Stop Loss</p>
                     <input type="number" placeholder="0.00000" className="w-full bg-white/5 border border-red-500/20 rounded-lg px-3 py-2 text-xs font-mono text-red-400 focus:outline-none focus:border-red-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  </div>
               </div>
            </div>

            {/* Market Stats */}
            <div className="px-6 py-4 border-b border-white/5 space-y-2">
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-600">Spread</span><span className="text-gray-400">0.2 pips</span>
               </div>
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-600">Commission</span><span className="text-gray-400">$0.10 / lot</span>
               </div>
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-600">Leverage</span><span className="text-gray-400">1:100</span>
               </div>
            </div>

            {/* BUY / SELL Buttons */}
            <div className="px-6 py-5 mt-auto space-y-3">
               <button onClick={() => initiateOrder('BUY')}
                  className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 active:scale-95 transition-all font-black text-sm tracking-widest text-white shadow-lg shadow-green-600/20">
                  BUY
               </button>
               <button onClick={() => initiateOrder('SELL')}
                  className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 transition-all font-black text-sm tracking-widest text-white shadow-lg shadow-red-600/20">
                  SELL
               </button>
            </div>

         </div>
      </main>

      {/* Mobile Fixed Bottom Panel (Zerodha/Groww Style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-[#0f1115] border-t border-white/10 px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-20px_40px_rgba(0,0,0,0.6)]">
         <div className="space-y-6">
            {/* Mobile Lot Input & Stats */}
            <div className="flex items-center justify-between gap-6">
               <div className="flex-1 space-y-2">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Lot Size</p>
                  <div className="flex items-center gap-3">
                     <button onClick={() => adjustLotSize(-0.01)} className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-bold text-lg">-</button>
                     <input type="number" id="mobile-lot-input" value={lotSize} onChange={(e) => setLotSize(e.target.value)} step="0.01" className="w-16 bg-transparent text-center font-black text-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                     <button onClick={() => adjustLotSize(0.01)} className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-bold text-lg">+</button>
                  </div>
               </div>
               <div className="text-right space-y-1">
                  <p className="text-xs font-black text-green-500 uppercase tracking-widest" id="mobile-profit-preview">+${formattedProfit} Gain</p>
                  <p className="text-xs font-black text-red-500 uppercase tracking-widest" id="mobile-risk-preview">-${formattedRisk} Risk</p>
                  <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Spread: 0.2 Pips</p>
               </div>
            </div>

            {/* Mobile Buy/Sell Buttons */}
            <div className="flex gap-4">
               <button onClick={() => initiateOrder('SELL')} className="flex-1 btn-danger shadow-xl shadow-red-500/10 active:scale-95 text-xs">Sell</button>
               <button onClick={() => initiateOrder('BUY')} className="flex-1 btn-success shadow-xl shadow-green-500/10 active:scale-95 text-xs">Buy</button>
            </div>
         </div>
      </div>

      {/* Order Confirmation Modal Overlay */}
      {isModalOpen && (
        <div id="order-modal" className="modal-overlay active">
           <div className="modal-content" id="modal-content">
              <div className="text-center space-y-6">
                 <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                 </div>
                 <h2 className="text-xl font-black uppercase tracking-tight text-white">Confirm <span id="modal-order-type" className={orderType === 'BUY' ? 'text-blue-500' : 'text-red-500'}>{orderType}</span> Order</h2>
                 
                 <div className="space-y-3 py-4 border-y border-white/5">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Asset</span>
                       <span className="text-xs font-black text-white">EUR / USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Size</span>
                       <span className="text-xs font-black text-white"><span id="modal-lot-size">{lotSize}</span> Lots</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Price</span>
                       <span className="text-xs font-black text-blue-500">Market</span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-3">
                    <button 
                      onClick={executeOrder} 
                      disabled={isExecuting}
                      className={`btn-primary w-full py-4 text-xs shadow-xl shadow-blue-600/20 transition-all active:scale-95 ${isExecuting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isExecuting ? 'Executing...' : 'Execute Order'}
                    </button>
                    <button onClick={closeOrderModal} className="w-full h-12 bg-transparent text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors active:scale-95">Cancel</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
