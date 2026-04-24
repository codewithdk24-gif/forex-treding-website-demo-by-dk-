export const OrderPanel = (isBottomSheet = false) => {
  // Initialize state if not present
  if (window.orderState === undefined) {
    window.orderState = {
      type: 'BUY',
      symbol: 'EUR/USD',
      lots: 1.00
    };
  }

  window.setOrderDirection = (dir) => {
    window.orderState.type = dir;
    // Force re-render of components that use this
    const desktopPanel = document.getElementById('desktop-order-panel');
    if (desktopPanel) {
      desktopPanel.innerHTML = OrderPanel(false);
    }
    
    const sheetContent = document.querySelector('#trade-bottom-sheet > div:last-child');
    if (sheetContent) {
      sheetContent.innerHTML = OrderPanel(true);
    }
    
    // Update mobile terminal button if it exists
    const mobileExecBtn = document.querySelector('#mobile-terminal-execute');
    if (mobileExecBtn) {
      mobileExecBtn.className = dir === 'BUY' ? 'btn-success w-full py-4' : 'btn-danger w-full py-4';
      mobileExecBtn.innerText = `EXECUTE ${dir}`;
    }
  };

  window.executeTrade = () => {
    const { type, symbol, lots } = window.orderState;
    window.showModal('Confirm Trade', `
      <div class="space-y-4">
        <div class="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
          <div>
            <p class="text-[10px] font-black text-gray-500 uppercase">Instrument</p>
            <p class="text-lg font-black text-white">${symbol}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black text-gray-500 uppercase">Action</p>
            <p class="text-lg font-black ${type === 'BUY' ? 'text-green-500' : 'text-red-500'}">${type}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-white/5 rounded-xl border border-white/5">
            <p class="text-[10px] font-black text-gray-500 uppercase">Size</p>
            <p class="text-lg font-black text-white">${lots.toFixed(2)} Lots</p>
          </div>
          <div class="p-4 bg-white/5 rounded-xl border border-white/5">
            <p class="text-[10px] font-black text-gray-500 uppercase">Margin</p>
            <p class="text-lg font-black text-white">$450.00</p>
          </div>
        </div>
        <p class="text-[10px] text-gray-500 text-center uppercase font-bold">Execution is near-instant with institutional routing.</p>
        <button onclick="window.confirmTradeExecution()" class="w-full ${type === 'BUY' ? 'btn-success' : 'btn-danger'} py-4 font-black uppercase tracking-widest mt-4">Confirm Execution</button>
      </div>
    `);
  };

  window.confirmTradeExecution = () => {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.classList.remove('active');
    window.toggleBottomSheet(false);
    window.showToast('Order executed successfully', 'success');
  };

  const isBuy = window.orderState.type === 'BUY';

  return `
    <div class="${isBottomSheet ? 'w-full' : 'w-full xl:w-80 border-l border-gray-800 h-full bg-[#131722]/50 backdrop-blur-sm'} flex flex-col transition-colors duration-300">
      ${!isBottomSheet ? `
      <div class="p-6 md:p-8 border-b border-gray-800">
        <h2 class="text-lg md:text-xl font-black tracking-tight text-white">Execution</h2>
        <div class="flex items-center gap-2 mt-2">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          <p class="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">${window.orderState.symbol} · Live Feed</p>
        </div>
      </div>
      ` : ''}

      <div class="flex-1 ${isBottomSheet ? 'p-0' : 'p-6 md:p-8'} space-y-6 md:space-y-8">
        <!-- Execution Type -->
        <div class="space-y-3">
          <label class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Order Type</label>
          <div class="flex bg-[#0f1115] border border-gray-800 rounded-xl p-1">
            <button class="flex-1 py-1.5 md:py-2 text-[10px] md:text-xs font-black rounded-lg bg-[#131722] text-white shadow-sm border border-gray-800">Market</button>
            <button class="flex-1 py-1.5 md:py-2 text-[10px] md:text-xs font-bold text-gray-500 hover:text-white transition-colors">Limit</button>
            <button class="flex-1 py-1.5 md:py-2 text-[10px] md:text-xs font-bold text-gray-500 hover:text-white transition-colors">Stop</button>
          </div>
        </div>

        <!-- Position Direction -->
        <div class="grid ${isBottomSheet ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-3'}">
          <button onclick="window.setOrderDirection('BUY')" 
                  class="py-3 md:py-4 rounded-xl font-black text-xs md:text-sm tracking-widest transition-all hover:scale-[1.01] active:scale-95 ${isBuy ? 'border-2 border-green-500 bg-green-500/10 text-green-500 shadow-lg shadow-green-500/10' : 'border border-gray-800 bg-[#0f1115] text-gray-500'}">BUY</button>
          <button onclick="window.setOrderDirection('SELL')" 
                  class="py-3 md:py-4 rounded-xl font-black text-xs md:text-sm tracking-widest transition-all hover:scale-[1.01] active:scale-95 ${!isBuy ? 'border-2 border-red-500 bg-red-500/10 text-red-500 shadow-lg shadow-red-500/10' : 'border border-gray-800 bg-[#0f1115] text-gray-500'}">SELL</button>
        </div>

        <!-- Parameters -->
        <div class="space-y-4 md:space-y-6">
          <div class="space-y-2 md:space-y-3">
            <label class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Position Size</label>
            <div class="relative group">
              <input type="number" 
                     oninput="window.orderState.lots = parseFloat(this.value) || 0"
                     value="${window.orderState.lots}" step="0.01" class="input-field py-3 md:py-4 pr-16 text-lg md:text-xl font-black text-white bg-[#0f1115]">
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] md:text-[10px] font-black text-gray-500 group-focus-within:text-blue-500 transition-colors">LOTS</span>
            </div>
            <div class="grid grid-cols-4 gap-2">
              ${[0.01, 0.1, 0.5, 1.0].map(val => `
                <button onclick="window.orderState.lots = ${val}; window.setOrderDirection(window.orderState.type)" 
                        class="py-2 text-[10px] font-black rounded-lg bg-[#0f1115] border border-gray-800 hover:border-blue-500/50 hover:text-blue-500 transition-all text-gray-500">${val}</button>
              `).join('')}
            </div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
            <div class="space-y-2">
              <label class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Take Profit (TP)</label>
              <input type="text" placeholder="1.09500" class="input-field py-2.5 md:py-3 text-xs md:text-sm text-white border-gray-800 bg-[#0f1115] focus:border-blue-500">
            </div>
            <div class="space-y-2">
              <label class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Stop Loss (SL)</label>
              <input type="text" placeholder="1.08500" class="input-field py-2.5 md:py-3 text-xs md:text-sm text-white border-gray-800 bg-[#0f1115] focus:border-red-500/30">
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="card p-4 md:p-5 bg-[#0f1115]/50 border-dashed border-gray-800 space-y-2 md:space-y-3">
          <div class="flex justify-between text-[9px] md:text-[10px] font-bold">
            <span class="text-gray-500 uppercase tracking-wider">Margin Req.</span>
            <span class="text-white">$450.00</span>
          </div>
          <div class="flex justify-between text-[9px] md:text-[10px] font-bold">
            <span class="text-gray-500 uppercase tracking-wider">Estimated Pip</span>
            <span class="text-blue-500 font-black">$10.00</span>
          </div>
        </div>
      </div>

      <div class="${isBottomSheet ? 'pt-6' : 'p-6 md:p-8 border-t border-gray-800 bg-[#131722]'}">
        <button onclick="window.executeTrade()" 
                class="${isBuy ? 'btn-success' : 'btn-danger'} w-full py-4 md:py-5 text-xs md:text-sm font-black tracking-widest uppercase shadow-xl active:scale-[0.98]">
          Execute ${window.orderState.type}
        </button>
        <p class="text-[8px] md:text-[9px] text-gray-500/50 text-center mt-4 font-bold uppercase tracking-tighter leading-tight">
          Executing this order will utilize $450.00 of your margin.
        </p>
      </div>
    </div>
  `;
};


