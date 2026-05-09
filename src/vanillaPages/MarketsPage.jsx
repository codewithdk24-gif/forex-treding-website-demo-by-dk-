'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTradeStore } from '../store/useTradeStore';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  BarChart3, 
  PieChart, 
  Activity,
  ChevronRight,
  Globe,
  Coins,
  Gem
} from 'lucide-react';

const marketAssets = [
  { symbol: 'EUR/USD', cat: 'Majors', type: 'Forex · Major Pair', icon: <Globe size={20} /> },
  { symbol: 'GBP/USD', cat: 'Majors', type: 'Forex · Major Pair', icon: <Globe size={20} /> },
  { symbol: 'USD/JPY', cat: 'Majors', type: 'Forex · Major Pair', icon: <Globe size={20} /> },
  { symbol: 'BTC/USD', cat: 'Crypto', type: 'Crypto · Digital Asset', icon: <Coins size={20} /> },
  { symbol: 'ETH/USD', cat: 'Crypto', type: 'Crypto · Digital Asset', icon: <Coins size={20} /> },
  { symbol: 'XAU/USD', cat: 'Commodities', type: 'Commodity · Gold', icon: <Gem size={20} /> },
  { symbol: 'WTI/OIL', cat: 'Commodities', type: 'Commodity · Crude Oil', icon: <Activity size={20} /> },
  { symbol: 'AUD/USD', cat: 'Majors', type: 'Forex · Major Pair', icon: <Globe size={20} /> },
  { symbol: 'USD/CAD', cat: 'Majors', type: 'Forex · Major Pair', icon: <Globe size={20} /> },
  { symbol: 'SOL/USD', cat: 'Crypto', type: 'Crypto · Digital Asset', icon: <Coins size={20} /> },
  { symbol: 'BNB/USD', cat: 'Crypto', type: 'Crypto · Digital Asset', icon: <Coins size={20} /> },
  { symbol: 'SILVER', cat: 'Commodities', type: 'Commodity · Silver', icon: <Gem size={20} /> },
];

const categories = ['All', 'Majors', 'Crypto', 'Commodities'];

export const MarketsPage = () => {
  const router = useRouter();
  const { setActiveSymbol, prices = {}, priceHistory = {} } = useTradeStore();
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');

  const filteredAssets = useMemo(() => {
    return marketAssets.filter(asset => {
      const matchesCat = activeCat === 'All' || asset.cat === activeCat;
      const matchesSearch = asset.symbol.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCat, search]);

  const handleTrade = (symbol) => {
    setActiveSymbol(symbol);
    router.push('/dashboard');
  };

  return (
    <div className="institutional-container space-y-8 fade-in pb-12 pt-4 md:pt-8 overflow-x-hidden">
      {/* Search & Header Section */}
      <div className="pt-6 space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div className="space-y-1 flex-1">
            <h1 className="text-heading-1 text-white">
              Asset <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">Explorer.</span>
            </h1>
            <p className="text-subtitle mt-2">Access 500+ Institutional Liquidity Pools</p>
            
            <div className="relative group max-w-2xl mt-8">
               <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">
                  <Search size={22} strokeWidth={3} />
               </div>
               <input 
                 type="text" 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search assets, symbols, or categories..." 
                 className="w-full h-16 bg-[#131722] border border-white/[0.05] rounded-[1.25rem] pl-16 pr-6 text-base md:text-sm font-black focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all placeholder:text-gray-600 text-white"
               />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex bg-[#131722]/50 p-1.5 rounded-2xl border border-white/[0.05] overflow-x-auto no-scrollbar shrink-0 snap-x snap-mandatory backdrop-blur-md">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCat(cat)} 
                className={`snap-start px-8 py-3.5 text-[10px] font-black rounded-xl transition-all duration-300 whitespace-nowrap uppercase tracking-widest ${cat === activeCat ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 ring-1 ring-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredAssets.map((asset, i) => {
          const price = prices[asset.symbol] || (asset.cat === 'Crypto' ? (asset.symbol.startsWith('BTC') ? 64230 : 3420) : (asset.cat === 'Commodities' ? 2342 : 1.08240));
          const history = priceHistory[asset.symbol] || [price, price];
          const isUp = history[history.length - 1] >= history[0];
          
          // Generate simple polyline path for sparkline
          const min = Math.min(...history);
          const max = Math.max(...history);
          const range = max - min || 1;
          const points = history.map((p, idx) => {
            const x = (idx / (history.length - 1)) * 100;
            const y = 40 - ((p - min) / range) * 30; // Scale to 40px height
            return `${x},${y}`;
          }).join(' ');

          return (
            <div 
              key={asset.symbol}
              onClick={() => handleTrade(asset.symbol)} 
              className="group bg-gradient-to-br from-[#1e222d] to-[#0d1117] border border-white/[0.05] rounded-[2.5rem] p-7 hover:border-blue-500/40 transition-all duration-500 cursor-pointer relative overflow-hidden active:scale-[0.98] hover:shadow-2xl hover:shadow-blue-900/10" 
            >
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/5 border border-white/[0.05] flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/30 transition-all duration-500 shadow-inner">
                    {asset.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg tracking-tight group-hover:text-blue-400 transition-colors">{asset.symbol}</h3>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">{asset.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-white tabular-nums tracking-tighter">
                    {price.toFixed(asset.symbol.includes('BTC') ? 2 : 5)}
                  </p>
                  <div className={`flex items-center justify-end gap-1.5 mt-1 text-[11px] font-black ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>{isUp ? '+' : '-'}{((Math.abs(history[history.length - 1] - history[0]) / history[0]) * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-6 pt-2">
                 <div className="flex-1 h-10 opacity-30 group-hover:opacity-60 transition-opacity">
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                       <polyline points={points} stroke={isUp ? '#10b981' : '#f43f5e'} strokeWidth="3" fill="none" strokeLinejoin="round" />
                    </svg>
                 </div>
                 <button className="h-10 px-6 bg-white/[0.03] border border-white/[0.05] rounded-xl text-[10px] font-black text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all uppercase tracking-widest flex items-center gap-2">
                   Trade
                   <ChevronRight size={12} />
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketsPage;
