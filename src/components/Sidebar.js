const Icons = {
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
  markets: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  orders: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  wallet: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  trades: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
  analytics: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
  logout: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  home: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

export const Sidebar = (isMobile = false) => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = user.role === 'admin';
  
  const userItems = [
    { id: 'dashboard', icon: Icons.dashboard, label: 'Dashboard' },
    { id: 'markets', icon: Icons.markets, label: 'Markets' },
    { id: 'orders', icon: Icons.orders, label: 'Orders' },
    { id: 'wallet', icon: Icons.wallet, label: 'Wallet' },
  ];

  const adminItems = [
    { id: 'admin', icon: Icons.dashboard, label: 'Overview' },
    { id: 'admin/users', icon: Icons.users, label: 'Users' },
    { id: 'admin/trades', icon: Icons.trades, label: 'Trades' },
    { id: 'admin/transactions', icon: Icons.wallet, label: 'Transactions' },
    { id: 'admin/analytics', icon: Icons.analytics, label: 'Analytics' },
  ];

  const menuItems = isAdmin ? adminItems : userItems;
  const currentHash = window.location.hash.slice(1) || (isAdmin ? 'admin' : 'dashboard');

  const baseClasses = isMobile 
    ? "sidebar-drawer w-72 h-screen flex flex-col bg-[#131722]" 
    : "hidden lg:flex w-20 xl:w-64 border-r border-gray-800 h-screen flex-col bg-[#131722] sticky top-0 transition-all duration-300 z-50";

  return `
    <aside id="${isMobile ? 'mobile-sidebar' : 'desktop-sidebar'}" class="${baseClasses}">
      <div class="p-6 mb-4 flex items-center justify-between gap-3">
        <a href="#landing" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/20 shrink-0 group-hover:scale-110 transition-transform">FX</div>
          <span class="text-xl font-black tracking-tighter ${isMobile ? 'block' : 'hidden xl:block'} text-white">Forex<span class="text-blue-500">Pro</span></span>
        </a>
        ${isMobile ? `
          <button onclick="window.toggleSidebar()" class="p-2 text-gray-500 hover:text-white transition-colors">
            ${Icons.close}
          </button>
        ` : ''}
      </div>
      
      <nav class="flex-1 px-3 xl:px-4 space-y-1">
        ${menuItems.map(item => `
          <a href="#${item.id}" 
             onclick="window.innerWidth < 1280 && window.toggleSidebar()"
             class="flex items-center justify-center xl:justify-start gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
             ${currentHash === item.id ? 'bg-blue-600/10 text-blue-500 shadow-sm' : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'}">
            <span class="opacity-80 group-hover:opacity-100">${item.icon}</span>
            <span class="font-semibold text-sm ${isMobile ? 'block' : 'hidden xl:block'}">${item.label}</span>
          </a>
        `).join('')}

        <div class="pt-4 mt-4 border-t border-white/5">
           <a href="#landing" class="flex items-center justify-center xl:justify-start gap-4 px-4 py-3.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
              <span class="group-hover:scale-110 transition-transform">${Icons.home}</span>
              <span class="font-semibold text-sm ${isMobile ? 'block' : 'hidden xl:block'}">Exit to Website</span>
           </a>
        </div>
      </nav>

      <!-- User Profile & Logout -->
      <div class="mt-auto space-y-4 pt-6 border-t border-white/5 pb-8 px-4">
        <div class="flex items-center justify-center xl:justify-start gap-4 px-2">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-blue-600/10 uppercase">
            ${user.name ? user.name[0] : (isAdmin ? 'A' : 'T')}
          </div>
          <div class="${isMobile ? 'block' : 'hidden xl:block'} min-w-0">
            <p class="text-sm font-black text-white truncate">${user.name || (isAdmin ? 'Platform Admin' : 'Trader')}</p>
            <p class="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] truncate">${user.role || 'User'}</p>
          </div>
        </div>
        
        <button onclick="const role = JSON.parse(localStorage.getItem('currentUser') || '{}').role; localStorage.removeItem('currentUser'); window.location.hash = role === 'admin' ? 'admin-login' : 'landing'; window.location.reload();" 
                class="w-full flex items-center justify-center xl:justify-start gap-4 px-4 py-3.5 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-500/5 group">
          <span class="group-hover:scale-110 transition-transform">${Icons.logout}</span>
          <span class="font-semibold text-sm ${isMobile ? 'block' : 'hidden xl:block'}">Logout</span>
        </button>
      </div>
    </aside>
  `;
};
