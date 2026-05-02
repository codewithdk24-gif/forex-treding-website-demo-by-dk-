const Icons = {
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
};

export const MobileTerminal = () => {
  return `
    <div id="mobile-terminal" class="mobile-terminal">
      <!-- Header -->
      <div class="terminal-header">
        <button onclick="window.toggleTerminal(false)" class="p-2 -ml-2 text-gray-400 active:text-white transition-colors">
          ${Icons.close}
        </button>
        <div class="flex flex-col items-center">
          <div class="flex items-center gap-1">
             <span class="text-sm font-black text-white">EUR/USD</span>
             <span class="text-gray-600">${Icons.chevronDown}</span>
          </div>
          <span class="text-xs font-bold text-green-500">1.08942 (+0.24%)</span>
        </div>
        <div class="w-10"></div> <!-- Spacer for balance -->
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-h-0 bg-[#0f1115]">
        <!-- Chart Area -->
        <div id="terminal-chart-container" class="flex-1 w-full bg-black relative">
           <div class="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-xs uppercase tracking-widest opacity-20">
              Initializing Secure Stream...
           </div>
        </div>

        <!-- Terminal Tabs -->
        <div class="h-12 border-y border-gray-800 flex items-center bg-[#131722]/50 shrink-0">
           <button class="flex-1 h-full text-xs font-black text-blue-500 border-b-2 border-blue-500 bg-blue-500/5">POSITIONS</button>
           <button class="flex-1 h-full text-xs font-black text-gray-500">ORDERS</button>
           <button class="flex-1 h-full text-xs font-black text-gray-500">HISTORY</button>
        </div>
      </div>

      <!-- Footer / Order Panel -->
      <div class="terminal-footer">
        <div class="flex items-center justify-between gap-4">
           <div class="flex-1 space-y-1">
              <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Lot Size</label>
              <div class="flex items-center bg-[#0f1115] border border-gray-800 rounded-lg p-1">
                 <button class="w-8 h-8 flex items-center justify-center text-gray-500 font-black">-</button>
                 <input type="number" value="1.00" class="flex-1 bg-transparent text-center font-black text-sm text-white outline-none min-h-0">
                 <button class="w-8 h-8 flex items-center justify-center text-gray-500 font-black">+</button>
              </div>
           </div>
           <div class="flex-1 grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="text-xs font-black text-gray-500 uppercase tracking-widest">SL</label>
                <input type="text" placeholder="None" class="w-full bg-[#0f1115] border border-gray-800 rounded-lg py-2 px-2 text-xs font-black text-white outline-none focus:border-red-500/30">
              </div>
              <div class="space-y-1">
                <label class="text-xs font-black text-gray-500 uppercase tracking-widest">TP</label>
                <input type="text" placeholder="None" class="w-full bg-[#0f1115] border border-gray-800 rounded-lg py-2 px-2 text-xs font-black text-white outline-none focus:border-blue-500/30">
              </div>
           </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-2">
           <button class="btn-primary min-h-[56px] shadow-lg shadow-blue-600/30 font-black text-base flex flex-col gap-0 leading-tight">
              <span>BUY</span>
              <span class="text-xs font-bold opacity-60">1.08942</span>
           </button>
           <button class="btn-outline min-h-[56px] border-red-500/30 text-red-500 font-black text-base flex flex-col gap-0 leading-tight hover:bg-red-500/5 active:bg-red-500/10 active:border-red-500/50">
              <span>SELL</span>
              <span class="text-xs font-bold opacity-60">1.08940</span>
           </button>
        </div>
      </div>
    </div>
  `;
};
