'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../store/useStore';
import { 
  Search, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Filter, 
  ChevronRight,
  Loader2,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';

export const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const trades = useStore(state => state.trades) || [];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(trades)) return [];
    return trades.filter(order => {
      if (!order || !order.symbol) return false;
      const matchesTab = activeTab === 'ALL' || order.status === activeTab;
      const matchesSearch = order.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [trades, activeTab, searchQuery]);

  const stats = useMemo(() => {
    if (!Array.isArray(trades)) return { active: 0, closed: 0, totalPnl: 0 };
    const active = trades.filter(o => o.status === 'ACTIVE').length;
    const closed = trades.filter(o => o.status === 'CLOSED').length;
    const totalPnl = trades.reduce((acc, o) => acc + (parseFloat(o.pl) || 0), 0);
    return { active, closed, totalPnl };
  }, [trades]);

  const renderMobileCards = () => {
    if (isLoading) {
      return Array(3).fill(0).map((_, i) => (
        <div key={i} className="card p-5 mb-4 animate-pulse bg-white/[0.02] border-white/[0.05]">
          <div className="flex justify-between mb-4">
            <div className="w-24 h-4 bg-white/10 rounded-lg"></div>
            <div className="w-16 h-4 bg-white/10 rounded-lg"></div>
          </div>
          <div className="space-y-3">
            <div className="w-full h-3 bg-white/5 rounded-lg"></div>
            <div className="w-2/3 h-3 bg-white/5 rounded-lg"></div>
          </div>
        </div>
      ));
    }

    if (filteredOrders.length === 0) {
      return (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center mx-auto text-gray-600">
            <History size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.2em]">No order history found</p>
            <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">Adjust your filters or initiate a trade</p>
          </div>
        </div>
      );
    }

    return filteredOrders.map((order, i) => (
      <div 
        key={order.id || i} 
        className="group bg-gradient-to-br from-[#1e222d] to-[#0d1117] border border-white/[0.05] rounded-[2rem] p-6 mb-4 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden active:scale-[0.98]"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs shadow-lg transition-all ${order.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {order.type === 'BUY' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
            <div>
              <h3 className="font-black text-white text-sm tracking-tight uppercase">{order.symbol}</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{order.time}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${order.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border-white/5'}`}>
            {order.status}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-5 border-y border-white/[0.05] border-dashed">
          <div>
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5">Size</p>
            <p className="text-xs font-black text-white tracking-tight">{order.size} Lots</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5">Entry</p>
            <p className="text-xs font-black text-white tabular-nums">{order.entry}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5">Net PnL</p>
            <p className={`text-xs font-black tabular-nums ${parseFloat(order.pl) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {parseFloat(order.pl) >= 0 ? '+' : ''}${parseFloat(order.pl || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-gray-500">
           <div className="flex items-center gap-2">
              <Clock size={12} className="opacity-40" />
              <span className="text-[9px] font-black uppercase tracking-widest">Duration: 2h 45m</span>
           </div>
           <button className="text-[10px] font-black text-blue-500 hover:text-white uppercase tracking-widest flex items-center gap-1.5">
             Details
             <ChevronRight size={12} />
           </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="institutional-container space-y-8 fade-in pb-10 pt-4 md:pt-8 overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div className="space-y-1">
          <h1 className="text-heading-2 text-white">Execution <span className="text-blue-500">Log.</span></h1>
          <p className="text-subtitle">Institutional Transaction Records</p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Tickets..." 
            className="w-full h-12 bg-[#131722] border border-white/[0.05] rounded-2xl pl-11 pr-4 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600 text-white"
          />
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex items-center gap-2 bg-[#131722]/50 p-1.5 rounded-2xl border border-white/[0.05] overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {['ALL', 'ACTIVE', 'PENDING', 'CLOSED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`snap-start px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap
            ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 ring-1 ring-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block card p-0 overflow-hidden bg-[#131722]/50 border-white/[0.05]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/[0.05]">
                <th className="px-8 py-5">Symbol</th>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Size</th>
                <th className="px-8 py-5">Entry Price</th>
                <th className="px-8 py-5">Current</th>
                <th className="px-8 py-5">Net PnL</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="px-8 py-6">
                      <div className="w-full h-4 bg-white/5 rounded-lg"></div>
                    </td>
                  </tr>
                ))
              ) : filteredOrders.map((order, i) => (
                <tr key={order.id || i} className="group hover:bg-white/[0.02] transition-all cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/5 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black text-[10px] uppercase">
                        {order.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-black text-white text-sm tracking-tight uppercase">{order.symbol}</p>
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none mt-1">{order.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg ${order.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-sm text-gray-400">{order.size} Lots</td>
                  <td className="px-8 py-6 font-mono text-sm text-gray-300">{order.entry}</td>
                  <td className="px-8 py-6 font-mono text-sm text-white">{order.current || order.entry}</td>
                  <td className={`px-8 py-6 font-black text-sm tabular-nums ${parseFloat(order.pl) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {parseFloat(order.pl) >= 0 ? '+' : ''}${parseFloat(order.pl || 0).toFixed(2)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${order.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-sm shadow-blue-500/10' : 'bg-gray-500/10 text-gray-400 border-white/5'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="pb-8">
          {renderMobileCards()}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="card bg-blue-600/5 border-dashed border-blue-600/20 p-6 flex gap-4 items-start">
         <div className="p-2 bg-blue-600/10 rounded-lg text-blue-500">
            <Info size={16} />
         </div>
         <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Execution Standard</p>
            <p className="text-[10px] text-gray-500 font-bold leading-relaxed mt-1 uppercase tracking-tighter">All orders are executed via Tier-1 institutional liquidity providers with sub-millisecond latency.</p>
         </div>
      </div>
    </div>
  );
};

export default OrdersPage;
