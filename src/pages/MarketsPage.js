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
    const app = document.getElementById('app');
    if (app) app.innerHTML = MarketsPage();
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
    <div class="section-container space-y-8 fade-in">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-4 w-full max-w-xl">
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-white">Market Explorer</h1>
            <p class="text-gray-500 text-xs md:text-sm font-medium mt-1">Institutional-grade quotes across global assets</p>
          </div>
          
          <!-- Search Input -->
          <div class="relative group">
             <input type="text" 
                    oninput="window.filterMarkets(this.value)"
                    placeholder="Search symbols..." 
                    class="input-field pl-12 bg-[#131722] border-gray-800 group-hover:border-blue-500/30 transition-all text-sm">
             <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">🔍</span>
          </div>
        </div>

        <div class="flex bg-[#131722] rounded-xl p-1 border border-gray-800 overflow-x-auto no-scrollbar">
          ${categories.map(cat => `
            <button onclick="window.switchMarketCat('${cat}')" 
                    class="px-6 py-2.5 text-[10px] md:text-xs font-black rounded-lg transition-all shrink-0 ${cat === window.activeMarketCat ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}">
              ${cat.toUpperCase()}
            </button>
          `).join('')}
        </div>
      </div>

      <div id="markets-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        ${filteredAssets.map((asset, i) => {
          const isUp = Math.random() > 0.4;
          return `
            <div class="card market-card hover-lift cursor-pointer group p-5 md:p-6" data-symbol="${asset.symbol}" data-cat="${asset.cat}">
              <div class="flex justify-between items-start mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#0f1115] border border-gray-800 flex items-center justify-center font-black text-xs text-blue-500 group-hover:border-blue-500/30 transition-colors shadow-inner">
                    ${asset.symbol.split('/')[0].slice(0, 2)}
                  </div>
                  <div>
                    <h3 class="font-black text-white text-sm md:text-base">${asset.symbol}</h3>
                    <p class="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest">${asset.type}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-[9px] md:text-[10px] font-black px-2 py-1 rounded-md ${isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}">
                    ${isUp ? '↑' : '↓'} ${ (Math.random() * 2).toFixed(2) }%
                  </span>
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="flex justify-between items-end">
                  <div>
                    <p class="text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Bid</p>
                    <p class="text-base md:text-lg font-black text-white">${(1 + Math.random()).toFixed(5)}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Ask</p>
                    <p class="text-base md:text-lg font-black text-white">${(1 + Math.random()).toFixed(5)}</p>
                  </div>
                </div>
                
                <div class="h-1.5 w-full bg-[#0f1115] rounded-full overflow-hidden border border-gray-800/50">
                  <div class="h-full bg-blue-600/30 w-2/3 transition-all"></div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

