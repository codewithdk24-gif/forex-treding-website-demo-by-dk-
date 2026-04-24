export const OrderPanel = () => {
  return `
    <aside class="w-full xl:w-80 border-l border-gray-800 h-full flex flex-col bg-[#131722]/50 backdrop-blur-sm transition-colors duration-300 overflow-y-auto">
      <div class="p-6 md:p-8 border-b border-gray-800">
        <h2 class="text-lg md:text-xl font-black tracking-tight text-white">Execution</h2>
        <div class="flex items-center gap-2 mt-2">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          <p class="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">EUR/USD · Live Feed</p>
        </div>
      </div>

      <div class="flex-1 p-6 md:p-8 space-y-6 md:space-y-8">
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
        <div class="grid grid-cols-2 gap-3">
          <button class="py-3 md:py-4 rounded-xl border-2 border-green-500 bg-green-500/5 text-green-500 font-black text-xs md:text-sm tracking-widest shadow-lg shadow-green-500/10 transition-all hover:scale-[1.02]">BUY</button>
          <button class="py-3 md:py-4 rounded-xl border border-gray-800 bg-[#0f1115] text-gray-500 font-black text-xs md:text-sm tracking-widest hover:border-red-500 hover:text-red-500 hover:bg-red-500/5 transition-all hover:scale-[1.02]">SELL</button>
        </div>

        <!-- Parameters -->
        <div class="space-y-4 md:space-y-6">
          <div class="space-y-2 md:space-y-3">
            <label class="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Position Size</label>
            <div class="relative group">
              <input type="number" value="1.00" step="0.01" class="input-field py-3 md:py-4 pr-16 text-lg md:text-xl font-black text-white bg-[#0f1115]">
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] md:text-[10px] font-black text-gray-500 group-focus-within:text-blue-500 transition-colors">LOTS</span>
            </div>
            <div class="grid grid-cols-4 gap-2">
              ${[0.01, 0.1, 0.5, 1.0].map(val => `
                <button class="py-1 md:py-1.5 text-[8px] md:text-[9px] font-black rounded-lg bg-[#0f1115] border border-gray-800 hover:border-blue-500/50 hover:text-blue-500 transition-all text-gray-500">${val}</button>
              `).join('')}
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 md:gap-4">
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
          <div class="pt-2 border-t border-gray-800 flex justify-between text-[10px] md:text-xs font-black">
            <span class="text-gray-500 uppercase">Potential profit</span>
            <span class="text-green-500">+$1,000.00</span>
          </div>
        </div>
      </div>

      <div class="p-6 md:p-8 border-t border-gray-800 bg-[#131722]">
        <button class="btn-success w-full py-4 md:py-5 text-xs md:text-sm font-black tracking-widest uppercase shadow-xl hover:scale-[0.98]">
          Execute Order
        </button>
        <p class="text-[8px] md:text-[9px] text-gray-500/50 text-center mt-4 font-bold uppercase tracking-tighter leading-tight">
          Executing this order will utilize $450.00 of your margin.
        </p>
      </div>
    </aside>
  `;
};
