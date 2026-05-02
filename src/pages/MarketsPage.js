export const MarketsPage = () => {
  const categories = ['All', 'Majors', 'Crypto', 'Commodities'];
  if (window.activeMarketCat === undefined) window.activeMarketCat = 'All';

  const marketAssets = [
    { symbol: 'EUR/USD', cat: 'Majors', type: 'Forex · Major Pair' },
    { symbol: 'GBP/USD', cat: 'Majors', type: 'Forex · Major Pair' },
    { symbol: 'USD/JPY', cat: 'Majors', type: 'Forex · Major Pair' },
    { symbol: 'BTC/USD', cat: 'Crypto', type: 'Crypto · Digital Asset' },
    { symbol: 'ETH/USD', cat: 'Crypto', type: 'Crypto · Digital Asset' },
    { symbol: 'XAU/USD', cat: 'Commodities', type: 'Commodity · Gold' },
    { symbol: 'WTI/OIL', cat: 'Commodities', type: 'Commodity · Crude Oil' },
    { symbol: 'AUD/USD', cat: 'Majors', type: 'Forex · Major Pair' },
    { symbol: 'USD/CAD', cat: 'Majors', type: 'Forex · Major Pair' },
    { symbol: 'SOL/USD', cat: 'Crypto', type: 'Crypto · Digital Asset' },
    { symbol: 'BNB/USD', cat: 'Crypto', type: 'Crypto · Digital Asset' },
    { symbol: 'SILVER', cat: 'Commodities', type: 'Commodity · Silver' },
  ];

  window.switchMarketCat = (cat) => {
    window.activeMarketCat = cat;
    const view = document.getElementById('router-view');
    if (view) view.innerHTML = MarketsPage();
  };

  window.filterMarkets = (query) => {
    const cards = document.querySelectorAll('.market-card');
    cards.forEach(card => {
      const symbol = card.dataset.symbol.toLowerCase();
      const matchesSearch = symbol.includes(query.toLowerCase());
      const matchesCat = window.activeMarketCat === 'All' || card.dataset.cat === window.activeMarketCat;
      
      if (matchesSearch && matchesCat) {
        card.style.display = 'block';
        card.classList.add('fade-in');
      } else {
        card.style.display = 'none';
      }
    });
  };

  const filteredAssets = window.activeMarketCat === 'All' 
    ? marketAssets 
    : marketAssets.filter(a => a.cat === window.activeMarketCat);

  return `
    <div class="section-container space-y-8 fade-in px-4 md:px-8 pb-12">
      <!-- Minimal Header & Search -->
      <div class="pt-4 space-y-8">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div class="space-y-4 flex-1">
            <h1 class="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Market <span class="text-blue-500">Explorer.</span></h1>
            <p class="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-[0.3em]">Explore 500+ Institutional Grade Assets</p>
            
            <div class="relative group max-w-2xl">
               <input type="text" 
                      oninput="window.filterMarkets(this.value)"
                      placeholder="Search symbols (e.g. EUR/USD, BTC)..." 
                      class="w-full h-14 bg-[#111318] border border-white/5 rounded-2xl px-12 text-sm font-medium focus:border-blue-500/50 focus:outline-none transition-all placeholder:text-gray-700">
               <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-blue-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               </span>
            </div>
          </div>

          <!-- Category Tabs -->
          <div class="flex bg-[#111318] rounded-2xl p-1 border border-white/5 overflow-x-auto no-scrollbar shrink-0">
            ${categories.map(cat => `
              <button onclick="window.switchMarketCat('${cat}')" 
                      class="px-8 py-3 text-xs font-black rounded-xl transition-all whitespace-nowrap ${cat === window.activeMarketCat ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:text-white'}">
                ${cat.toUpperCase()}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Assets Grid -->
      <div id="markets-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        ${filteredAssets.map((asset, i) => {
          const isUp = Math.random() > 0.4;
          const price = (asset.cat === 'Crypto' ? (asset.symbol.startsWith('BTC') ? 64230 : 3420) : (asset.cat === 'Commodities' ? 2342 : 1.08240)).toFixed(5);
          return `
            <div onclick="window.location.hash = 'dashboard'" 
                 class="market-card group bg-[#111318] border border-white/5 rounded-[2rem] p-6 hover:border-blue-500/30 transition-all duration-500 cursor-pointer relative overflow-hidden" 
                 data-symbol="${asset.symbol}" 
                 data-cat="${asset.cat}">
              
              <div class="flex justify-between items-start mb-8">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-blue-600/5 border border-white/5 flex items-center justify-center font-black text-xs text-blue-500 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    ${asset.symbol.split('/')[0].slice(0, 2)}
                  </div>
                  <div>
                    <h3 class="font-black text-white text-base tracking-tight">${asset.symbol}</h3>
                    <p class="text-xs text-gray-600 font-bold uppercase tracking-widest">${asset.type}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black text-white tabular-nums">${price}</p>
                  <p class="text-xs font-black ${isUp ? 'text-green-500' : 'text-red-500'}">
                    ${isUp ? '+' : '-'}${(Math.random() * 2).toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div class="flex items-center justify-between gap-4">
                 <div class="flex-1 h-8 opacity-20">
                    <svg class="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                       <path d="M0,${isUp ? 30 : 10} Q25,${isUp ? 20 : 30} 50,${isUp ? 35 : 5} T100,${isUp ? 10 : 35}" stroke="${isUp ? '#22c55e' : '#ef4444'}" stroke-width="2" fill="none"></path>
                    </svg>
                 </div>
                 <button class="px-5 py-2 bg-white/5 rounded-xl text-xs font-black text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">TRADE</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};
