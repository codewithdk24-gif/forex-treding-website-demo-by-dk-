'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

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

const categories = ['All', 'Majors', 'Crypto', 'Commodities'];

export const MarketsPage = () => {
  const router = useRouter();
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
    // In a real app, we'd set the active symbol in a store
    if (typeof window !== 'undefined') {
      window.activeSymbol = symbol;
    }
    router.push('/dashboard');
  };

  return (
    <div className="section-container space-y-8 fade-in px-4 md:px-8 pb-12">
      <div className="pt-4 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 flex-1">
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Market <span className="text-blue-500">Explorer.</span></h1>
            <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-[0.3em]">Explore 500+ Institutional Grade Assets</p>
            
            <div className="relative group max-w-2xl">
               <input 
                 type="text" 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search symbols (e.g. EUR/USD, BTC)..." 
                 className="w-full h-14 bg-[#111318] border border-white/5 rounded-2xl px-12 text-base md:text-sm font-medium focus:border-blue-500/50 focus:outline-none transition-all placeholder:text-gray-500 text-white"
               />
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               </span>
            </div>
          </div>

          <div className="flex bg-[#111318] rounded-2xl p-1 border border-white/5 overflow-x-auto no-scrollbar shrink-0">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCat(cat)} 
                className={`px-8 py-3 text-xs font-black rounded-xl transition-all whitespace-nowrap ${cat === activeCat ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:text-white'}`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {filteredAssets.map((asset, i) => {
          const isUp = (i % 3 === 0);
          const price = (asset.cat === 'Crypto' ? (asset.symbol.startsWith('BTC') ? 64230 : 3420) : (asset.cat === 'Commodities' ? 2342 : 1.08240)).toFixed(5);
          
          return (
            <div 
              key={asset.symbol}
              onClick={() => handleTrade(asset.symbol)} 
              className="market-card group bg-[#111318] border border-white/5 rounded-[2rem] p-6 hover:border-blue-500/30 transition-all duration-500 cursor-pointer relative overflow-hidden" 
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/5 border border-white/5 flex items-center justify-center font-black text-xs text-blue-500 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 uppercase">
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base tracking-tight">{asset.symbol}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{asset.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white tabular-nums">{price}</p>
                  <p className={`text-xs font-black ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {isUp ? '+' : '-'}{(1.2 + i*0.1).toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                 <div className="flex-1 h-8 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                       <path d={`M0,${isUp ? 30 : 10} Q25,${isUp ? 20 : 30} 50,${isUp ? 35 : 5} T100,${isUp ? 10 : 35}`} stroke={isUp ? '#22c55e' : '#ef4444'} strokeWidth="2" fill="none"></path>
                    </svg>
                 </div>
                 <button className="px-5 py-2 bg-white/5 rounded-xl text-xs font-black text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">TRADE</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketsPage;
