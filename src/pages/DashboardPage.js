import { TradingViewChart } from '../components/TradingViewChart';

export const DashboardPage = () => {
  window.switchChartSymbol = (symbol) => {
    TradingViewChart('tv-chart-container', symbol, 'dark');
    document.querySelectorAll('.symbol-tab').forEach(btn => {
      btn.classList.toggle('bg-blue-600', btn.dataset.symbol === symbol);
      btn.classList.toggle('text-white', btn.dataset.symbol === symbol);
      btn.classList.toggle('text-gray-500', btn.dataset.symbol !== symbol);
    });
  };

  return `
    <div class="section-container space-y-8 fade-in">
      <!-- High-Density Stats (Mobile First Stack) -->
      <div class="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        ${[
          { label: 'Equity', value: '$124,592.00', change: '+2.4%', color: 'blue' },
          { label: 'Margin', value: '$112,192.00', change: '90.4%', color: 'gray' },
          { label: 'Open P/L', value: '+$4,210.50', change: '+12%', color: 'green' },
          { label: 'Risk Level', value: 'SAFE', change: '450%', color: 'blue' },
        ].map(stat => `
          <div class="card p-5 group flex flex-row sm:flex-col justify-between items-center sm:items-start gap-4">
            <div class="space-y-1">
              <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">${stat.label}</span>
              <p class="text-xl font-black text-white group-hover:text-blue-500 transition-colors">${stat.value}</p>
            </div>
            <span class="badge ${stat.color === 'green' ? 'bg-green-500/10 text-green-500' : 'bg-blue-600/10 text-blue-500'}">
              ${stat.change}
            </span>
          </div>
        `).join('')}
      </div>

      <!-- Trading Interface -->
      <div class="flex flex-col xl:flex-row gap-6">
        <div class="flex-1 space-y-6">
          <!-- Real TradingView Chart Preview -->
          <div class="card p-0 overflow-hidden shadow-2xl reveal active transition-transform duration-500 hover:scale-[1.005]">
            <div class="p-4 md:p-6 border-b border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center font-black text-xs text-blue-500 shadow-inner">FX</div>
                <div>
                  <h3 class="font-black text-white text-sm">Institutional Feed</h3>
                  <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">EUR/USD · Market Live</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                 <button onclick="window.toggleTerminal(true)" class="lg:hidden px-4 py-2 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest btn-glow">Full Terminal</button>
                 <div class="hidden sm:flex bg-[#0f1115] rounded-xl p-1 border border-gray-800 overflow-x-auto no-scrollbar w-full sm:w-auto">
                    ${[
                      { label: 'EURUSD', symbol: 'FX:EURUSD' },
                      { label: 'GBPUSD', symbol: 'FX:GBPUSD' },
                      { label: 'GOLD', symbol: 'OANDA:XAUUSD' },
                    ].map(s => `
                      <button onclick="window.switchChartSymbol('${s.symbol}')" 
                              data-symbol="${s.symbol}"
                              class="symbol-tab flex-1 sm:flex-none px-4 py-2 text-[10px] font-black rounded-lg transition-all shrink-0 ${s.label === 'EURUSD' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}">
                        ${s.label}
                      </button>
                    `).join('')}
                 </div>
              </div>
            </div>
            <div id="tv-chart-container" onclick="window.innerWidth < 1024 && window.toggleTerminal(true)" class="h-[450px] md:h-[550px] bg-[#0f1115] cursor-pointer shadow-blue-600/5 shadow-2xl"></div>
          </div>

          <!-- Position Cards (Mobile First) -->
          <div class="space-y-4">
             <div class="flex items-center justify-between px-2">
                <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-widest">Active Positions</h3>
                <a href="/#orders" class="text-[10px] font-black text-blue-500 uppercase">Manage All →</a>
             </div>

             
             ${[
               { symbol: 'EUR/USD', type: 'BUY', size: '1.00', entry: '1.08620', pl: '+$322.00', color: 'green' },
               { symbol: 'XAU/USD', type: 'BUY', size: '0.10', entry: '2342.10', pl: '-$37.00', color: 'red' },
             ].map(pos => `
               <div class="card p-5 group flex items-center justify-between hover-lift">
                  <div class="flex items-center gap-4">
                     <div class="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center font-black text-xs text-white">${pos.symbol.slice(0,2)}</div>
                     <div>
                        <p class="font-black text-white text-sm">${pos.symbol}</p>
                        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">${pos.type} · ${pos.size} Lots</p>
                     </div>
                  </div>
                  <div class="text-right">
                     <p class="font-black text-sm ${pos.pl.startsWith('+') ? 'text-green-500' : 'text-red-500'}">${pos.pl}</p>
                     <p class="text-[10px] font-bold text-gray-600">@ ${pos.entry}</p>
                  </div>
               </div>
             `).join('')}
          </div>

          <!-- Risk Analysis (Moved here for full width terminal) -->
          <div class="card bg-blue-600/5 border-blue-600/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 reveal">
             <div class="space-y-2 text-center md:text-left">
                <h4 class="text-[10px] font-black text-blue-500 uppercase tracking-widest">Risk Intelligence Analysis</h4>
                <p class="text-xs text-gray-400 leading-relaxed font-medium max-w-xl">Your portfolio is currently optimized. Deep liquidity access is guaranteed for your open positions. Risk exposure is within L4 protocol limits.</p>
             </div>
             <button onclick="window.showToast('Portfolio rebalancing initiated', 'info')" class="w-full md:w-auto btn-outline min-h-0 py-3 px-10 text-[10px] font-black border-blue-600/20 text-blue-500 hover:bg-blue-600 hover:text-white transition-all">REBALANCE PORTFOLIO</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

