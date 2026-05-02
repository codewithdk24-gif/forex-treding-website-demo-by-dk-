import { TradingViewChart } from '../components/TradingViewChart';

export const initDashboard = () => {
  // Trading Logic
  const adjustLotSize = (delta) => {
    const desktopInput = document.getElementById('desktop-lot-input');
    const mobileInput = document.getElementById('mobile-lot-input');
    const current = parseFloat(desktopInput?.value || mobileInput?.value || 0.50);
    const newVal = Math.max(0.01, (current + delta)).toFixed(2);
    
    if (desktopInput) desktopInput.value = newVal;
    if (mobileInput) mobileInput.value = newVal;
    
    const profit = (newVal * 640).toFixed(2);
    const risk = (newVal * 360).toFixed(2);
    
    const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    document.querySelectorAll('[id$="-profit-preview"]').forEach(el => el.innerText = `+$${formatter.format(profit)}`);
    document.querySelectorAll('[id$="-risk-preview"]').forEach(el => el.innerText = `-$${formatter.format(risk)}`);
  };

  const initiateOrder = (type) => {
    const lotSize = document.getElementById('desktop-lot-input')?.value || document.getElementById('mobile-lot-input')?.value;
    const modal = document.getElementById('order-modal');
    const modalContent = document.getElementById('modal-content');
    const typeLabel = document.getElementById('modal-order-type');
    const lotLabel = document.getElementById('modal-lot-size');

    typeLabel.innerText = type;
    typeLabel.className = type === 'BUY' ? 'text-green-500' : 'text-red-500';
    lotLabel.innerText = lotSize;

    modal.classList.remove('hidden');
    setTimeout(() => {
       modalContent.classList.remove('scale-95', 'opacity-0');
    }, 10);
  };

  const closeOrderModal = () => {
    const modal = document.getElementById('order-modal');
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
  };

  const executeOrder = () => {
    const btn = document.querySelector('button[data-action="executeOrder"]');
    if (btn) {
      btn.innerText = 'Executing...';
      btn.classList.add('opacity-75', 'cursor-not-allowed');
      btn.disabled = true;
    }

    setTimeout(() => {
      const symbol = document.getElementById('terminal-symbol')?.innerText || 'EUR/USD';
      const size = document.getElementById('modal-lot-size')?.innerText || '1.00';
      const type = document.getElementById('modal-order-type')?.innerText || 'BUY';
      const entryPrice = document.getElementById('terminal-price')?.innerText || '1.08245';
      
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
        type: type,
        size: parseFloat(size).toFixed(2),
        entry: entryPrice,
        current: entryPrice,
        pl: 0,
        status: 'ACTIVE'
      };

      const existingOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
      existingOrders.unshift(newOrder); // Newest first
      localStorage.setItem('demo_orders', JSON.stringify(existingOrders));

      if (btn) {
        btn.innerText = 'Execute Order';
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
        btn.disabled = false;
      }
      closeOrderModal();
      
      if (window.showToast) {
        const toastType = type === 'BUY' ? 'success' : 'sell';
        const msg = `<span class="font-bold text-white">${type} Order Executed</span><br/>
                     <span class="text-xs text-gray-400">${symbol} • ${parseFloat(size).toFixed(2)} Lot • Ticket ${newOrder.id}</span>`;
        window.showToast(msg, toastType);
      }
      
      // Update Recent Trades UI if exists
      if (typeof window.__updateRecentTrades === 'function') {
         window.__updateRecentTrades();
      }
    }, 600); // 600ms simulated execution delay
  };

  window.__updateRecentTrades = () => {
    const container = document.getElementById('recent-trades-container');
    if (!container) return;
    
    const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    const recent = orders.slice(0, 3);
    
    if (recent.length === 0) {
      container.innerHTML = `
        <div class="text-center p-6 space-y-3 border border-white/5 rounded-xl bg-white/[0.02]">
           <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">No recent trades yet</p>
           <button class="text-xs font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">Start Trading</button>
        </div>
      `;
      return;
    }
    
    const formatCurrency = (val) => {
      const num = parseFloat(val);
      const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(num));
      return num >= 0 ? `+$${formatted}` : `-$${formatted}`;
    };

    container.innerHTML = recent.map(order => {
      const isProfit = parseFloat(order.pl || 0) >= 0;
      return `
        <div class="p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-default">
           <div class="flex justify-between items-start mb-2">
              <div class="flex items-center gap-2">
                 <span class="text-[10px] font-black px-1.5 py-0.5 rounded ${order.type === 'BUY' ? 'text-blue-500 bg-blue-500/10' : 'text-red-500 bg-red-500/10'}">${order.type}</span>
                 <span class="text-xs font-black text-white">${order.symbol}</span>
              </div>
              <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">${order.time.split(' ')[1] || order.time}</span>
           </div>
           <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-gray-400">${order.size} Lots</span>
              <span class="text-xs font-black ${isProfit ? 'text-green-500' : 'text-red-500'}">${formatCurrency(order.pl || 0)}</span>
           </div>
        </div>
      `;
    }).join('');
  };
  
  // Initial render of recent trades
  window.__updateRecentTrades();

  // Event Delegation for Dashboard
  if (!window.__dashboardInit) {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      
      const action = btn.dataset.action;
      const payload = btn.dataset.payload;
      
      if (action === 'adjustLotSize') adjustLotSize(parseFloat(payload));
      if (action === 'initiateOrder') initiateOrder(payload);
      if (action === 'closeOrderModal') closeOrderModal();
      if (action === 'executeOrder') executeOrder();
    });
    window.__dashboardInit = true;
  }

  // Price Flickering
  if (!window.appIntervals) window.appIntervals = [];
  if (window.__dashboardInterval) clearInterval(window.__dashboardInterval);
  const priceInterval = setInterval(() => {
    const prices = document.querySelectorAll('#terminal-price, #mobile-terminal-price');
    prices.forEach(p => {
       const base = 1.08240;
       const rand = (Math.random() * 0.00004 - 0.00002).toFixed(5);
       const currentPrice = parseFloat(p.innerText) || base;
       const newPrice = (currentPrice + parseFloat(rand)).toFixed(5);
       
       p.innerText = newPrice;
       p.style.transition = 'color 0.3s ease-in-out';
       p.classList.remove('text-white');
       p.classList.add(newPrice > currentPrice ? 'text-green-500' : 'text-red-500');
       
       setTimeout(() => {
          p.classList.remove('text-green-500', 'text-red-500');
          p.classList.add('text-white');
       }, 800);
    });

    // Random volatility notifications
    if (Math.random() > 0.95 && window.showToast) {
       const assets = ['EUR/USD', 'GBP/USD', 'BTC/USD', 'XAU/USD'];
       const asset = assets[Math.floor(Math.random() * assets.length)];
       const msgs = ['High Volatility Detected', 'Liquidity Surge', 'Institutional Block Trade'];
       const msg = msgs[Math.floor(Math.random() * msgs.length)];
       window.showToast(`${msg} on ${asset}`, 'info');
    }
  }, 1500);
  window.__dashboardInterval = priceInterval;
  window.appIntervals.push(priceInterval);
};

export const DashboardPage = () => {
  return `
    <div class="h-[100dvh] bg-[#0f1115] text-white flex flex-col overflow-hidden selection:bg-blue-500/20">
      
      <!-- Global Ticker -->
      <div class="global-ticker-wrap hidden md:flex shrink-0">
         <div class="global-ticker gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
            ${Array(4).fill().map(() => `
              <span class="flex items-center gap-2">BTC/USD <span class="text-green-500">94,241.50</span></span>
              <span class="flex items-center gap-2">EUR/USD <span class="text-red-500">1.0824</span></span>
              <span class="flex items-center gap-2">GBP/JPY <span class="text-green-500">191.45</span></span>
              <span class="flex items-center gap-2">XAU/USD <span class="text-green-500">2342.10</span></span>
              <span class="flex items-center gap-2">ETH/USD <span class="text-red-500">3542.80</span></span>
              <span class="flex items-center gap-2">NQ100 <span class="text-green-500">18254.25</span></span>
            `).join('')}
         </div>
      </div>

      <!-- Top Trading Bar -->
      <nav class="h-14 md:h-16 border-b border-white/[0.05] flex items-center justify-between px-4 md:px-6 shrink-0 bg-[#0f1115]/80 backdrop-blur-md z-50">
        <div class="flex items-center gap-4">
           <button onclick="window.location.hash = '#landing'" class="p-2 -ml-2 text-gray-500 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
           </button>
           <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs">FX</div>
              <div>
                 <div class="flex items-center gap-2">
                    <h3 class="font-black text-sm tracking-tight" id="terminal-symbol">EUR/USD</h3>
                    <div class="flex items-center gap-1.5 bg-red-500/10 px-1.5 py-0.5 rounded">
                       <div class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                       <span class="text-[9px] font-black text-red-500 uppercase tracking-widest">Live</span>
                    </div>
                 </div>
                 <p class="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Institutional Terminal v2.4</p>
              </div>
           </div>
        </div>
        
        <div class="flex items-center gap-6">
           <div class="text-right hidden sm:block">
              <p class="text-lg font-black tracking-tighter text-white tabular-nums animate-price-flicker" id="terminal-price">1.08245</p>
              <p class="text-xs font-black text-green-500 uppercase tracking-widest">+1.42%</p>
           </div>
           <div class="w-px h-8 bg-white/5 hidden md:block"></div>
           <div class="hidden md:flex items-center gap-2">
              <button onclick="window.toggleChartFullscreen()" class="p-2 text-gray-500 hover:text-white transition-colors">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
              </button>
           </div>
        </div>
      </nav>

      <!-- Main Layout -->
      <main class="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden pb-[200px] lg:pb-0 relative z-10">
         <!-- Left Side: Chart Area (Expanded) -->
         <div class="h-[50vh] lg:h-full lg:flex-1 relative bg-[#0d0f14] shrink-0 border-b lg:border-b-0 border-white/5">
            <div class="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none" id="chart-skeleton">
               <div class="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
               <p class="text-xs text-gray-500 font-bold uppercase tracking-widest animate-pulse">Initializing Data Feed...</p>
            </div>
            <div id="tv-chart-container" class="absolute inset-0 w-full h-full z-10"></div>
            
            <!-- Mobile Price Floating Overlay -->
            <div class="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/5 flex items-center gap-3 z-20">
               <p class="text-sm font-black tracking-tighter text-white tabular-nums" id="mobile-terminal-price">1.08245</p>
               <span class="text-xs font-black text-green-500">+1.42%</span>
            </div>
         </div>

         <!-- Right Side / Below Chart: Recent Trades -->
         <div class="w-full lg:w-[320px] bg-[#0f1115] lg:border-l border-white/5 shrink-0 flex flex-col">
            <div class="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0f1115] z-10">
               <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest">Recent Trades</h3>
               <button onclick="window.location.hash='#orders'" class="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">View All</button>
            </div>
            <div id="recent-trades-container" class="p-4 space-y-3 overflow-y-auto no-scrollbar lg:flex-1">
               <!-- Populated via JS -->
            </div>
         </div>
      </main>

      <!-- Mobile Fixed Bottom Panel (Zerodha/Groww Style) -->
      <div class="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-[#0f1115] border-t border-white/10 px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-20px_40px_rgba(0,0,0,0.6)]">
         <div class="space-y-6">
            <!-- Mobile Lot Input & Stats -->
            <div class="flex items-center justify-between gap-6">
               <div class="flex-1 space-y-2">
                  <p class="text-xs font-black text-gray-500 uppercase tracking-widest">Lot Size</p>
                  <div class="flex items-center gap-3">
                     <button data-action="adjustLotSize" data-payload="-0.01" class="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-bold text-lg">-</button>
                     <input type="number" id="mobile-lot-input" value="0.50" step="0.01" class="w-16 bg-transparent text-center font-black text-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                     <button data-action="adjustLotSize" data-payload="0.01" class="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-bold text-lg">+</button>
                  </div>
               </div>
               <div class="text-right space-y-1">
                  <p class="text-xs font-black text-green-500 uppercase tracking-widest" id="mobile-profit-preview">+$320.00 Gain</p>
                  <p class="text-xs font-black text-red-500 uppercase tracking-widest" id="mobile-risk-preview">-$180.00 Risk</p>
                  <p class="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Spread: 0.2 Pips</p>
               </div>
            </div>

            <!-- Mobile Buy/Sell Buttons -->
            <div class="flex gap-4">
               <button data-action="initiateOrder" data-payload="SELL" class="flex-1 btn-danger shadow-xl shadow-red-500/10 active:scale-95 text-xs">Sell</button>
               <button data-action="initiateOrder" data-payload="BUY" class="flex-1 btn-success shadow-xl shadow-green-500/10 active:scale-95 text-xs">Buy</button>
            </div>
         </div>
      </div>

      <!-- Order Confirmation Modal Overlay -->
      <div id="order-modal" class="fixed inset-0 z-[100] hidden flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
         <div class="w-full max-w-sm bg-[#161923] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl scale-95 opacity-0 transition-all duration-300" id="modal-content">
            <div class="text-center space-y-6">
               <div class="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
               </div>
               <h2 class="text-xl font-black uppercase tracking-tight text-white">Confirm <span id="modal-order-type" class="text-blue-500">BUY</span> Order</h2>
               
               <div class="space-y-3 py-4 border-y border-white/5">
                  <div class="flex justify-between items-center">
                     <span class="text-xs font-black text-gray-500 uppercase tracking-widest">Asset</span>
                     <span class="text-xs font-black text-white">EUR / USD</span>
                  </div>
                  <div class="flex justify-between items-center">
                     <span class="text-xs font-black text-gray-500 uppercase tracking-widest">Size</span>
                     <span class="text-xs font-black text-white"><span id="modal-lot-size">0.50</span> Lots</span>
                  </div>
                  <div class="flex justify-between items-center">
                     <span class="text-xs font-black text-gray-500 uppercase tracking-widest">Price</span>
                     <span class="text-xs font-black text-blue-500">Market</span>
                  </div>
               </div>

               <div class="flex flex-col gap-3">
                  <button data-action="executeOrder" class="btn-primary w-full py-4 text-xs shadow-xl shadow-blue-600/20 transition-all">Execute Order</button>
                  <button data-action="closeOrderModal" class="w-full h-12 bg-transparent text-gray-500 font-bold text-xs uppercase tracking-widest">Cancel</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  `;
};
