const Icons = {
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
};

export const Header = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  return `
    <header class="h-16 md:h-20 border-b border-gray-800 bg-[#0f1115]/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 relative z-40">
      <div class="flex items-center gap-4">
        <button onclick="window.toggleSidebar()" class="xl:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          ${Icons.menu}
        </button>

        <div class="relative hidden lg:block group">
           <input type="text" placeholder="Search markets (CMD+K)" class="w-64 bg-[#131722] border border-gray-800 rounded-xl py-2 px-10 text-[10px] font-black uppercase tracking-widest placeholder:text-gray-600 focus:border-blue-500/50 transition-all">
           <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">🔍</span>
        </div>
        
        ${user.role === 'admin' ? `
          <div class="flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span class="text-[9px] font-black text-blue-500 uppercase tracking-widest">Platform Control Panel</span>
          </div>
        ` : ''}
      </div>

      <div class="flex items-center gap-2 md:gap-6">
        <div class="hidden sm:flex flex-col items-end">
            <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Live Equity</p>
            <p id="header-balance" class="text-sm md:text-base font-black text-white leading-none">$124,592.00</p>
        </div>
        
        <div class="hidden sm:block h-8 w-px bg-gray-800 mx-1 md:mx-2"></div>

        <div class="flex items-center gap-3">
          <div class="flex flex-col items-end hidden sm:flex">
            <p class="text-[10px] font-black text-white leading-none truncate max-w-[100px]">${user.name || 'Trader'}</p>
            <p class="text-[8px] font-black text-blue-500 uppercase tracking-widest mt-1">${user.role || 'User'}</p>
          </div>
          <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20 text-xs md:text-sm uppercase">
            ${user.name ? user.name[0] : 'T'}
          </div>
        </div>
      </div>
    </header>
  `;
};
