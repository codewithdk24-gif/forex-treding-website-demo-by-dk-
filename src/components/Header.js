const Icons = {
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
};

export const Header = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  return `
    <header class="h-16 md:h-20 border-b border-gray-800 bg-[#0f1115]/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 relative z-40">
      <div class="flex items-center gap-3 md:gap-4">
        <button onclick="window.toggleSidebar()" class="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          ${Icons.menu}
        </button>

        <div class="relative hidden xl:block group">
           <input type="text" 
                  onkeydown="if(event.key === 'Enter') { window.showToast('Searching for assets...', 'info'); window.location.hash = 'markets'; }"
                  placeholder="Search symbols..." class="w-64 bg-[#131722] border border-gray-800 rounded-xl py-2 px-10 text-[10px] font-black uppercase tracking-widest placeholder:text-gray-600 focus:border-blue-500/50 transition-all">
           <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">🔍</span>
        </div>

        ${user.role === 'admin' ? `
          <div class="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span class="text-[9px] font-black text-blue-500 uppercase tracking-widest">Control Panel</span>
          </div>
        ` : ''}
      </div>

      <div class="flex items-center gap-4 md:gap-6">
        <div class="flex flex-col items-end">
            <p class="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Live Equity</p>
            <p id="header-balance" class="text-sm md:text-base font-black text-white leading-none tracking-tight">$124,592</p>
        </div>
        
        <div class="h-8 w-px bg-gray-800 mx-1"></div>

        <div class="flex items-center gap-3">
          <div class="flex flex-col items-end hidden sm:flex">
            <p class="text-[10px] font-black text-white leading-none truncate max-w-[100px] uppercase">${user.name || 'Trader'}</p>
            <p class="text-[8px] font-black text-blue-500 uppercase tracking-widest mt-1">${user.role || 'User'}</p>
          </div>
          <div class="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20 text-xs md:text-sm uppercase">
            ${user.name ? user.name[0] : 'T'}
          </div>
        </div>
      </div>
    </header>
  `;
};
