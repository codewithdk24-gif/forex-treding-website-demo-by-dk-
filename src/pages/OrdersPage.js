'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTradeStore } from '../store/useTradeStore';

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const { trades, closeTrade } = useTradeStore();

  const activeTrades = trades.filter(o => o.status === 'ACTIVE');
  const closedTrades = trades.filter(o => o.status === 'CLOSED');
  
  const currentOrders = activeTab === 'ACTIVE' ? activeTrades : closedTrades;

  const formatCurrency = (val) => {
    const num = parseFloat(val);
    const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(num));
    return num >= 0 ? `+$${formatted}` : `-$${formatted}`;
  };

  return (
    <div className="section-container space-y-6 md:space-y-8 fade-in px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Trading <span className="text-blue-500">Analytics.</span></h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-widest">Live Positions · Execution History</p>
        </div>
        
        <div className="flex bg-[#111318] rounded-2xl p-1 border border-white/5 w-full md:w-auto">
           <button 
             onClick={() => setActiveTab('ACTIVE')} 
             className={`flex-1 md:flex-none px-8 py-3 text-xs font-black rounded-xl transition-all ${activeTab === 'ACTIVE' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:text-white'}`}
           >
             ACTIVE POSITIONS ({activeTrades.length})
           </button>
           <button 
             onClick={() => setActiveTab('CLOSED')} 
             className={`flex-1 md:flex-none px-8 py-3 text-xs font-black rounded-xl transition-all ${activeTab === 'CLOSED' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:text-white'}`}
           >
             HISTORY ({closedTrades.length})
           </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden bg-[#0f1115]/50 border-white/5 shadow-2xl">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto no-scrollbar relative">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-[#111318] text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-8 py-5">Instrument</th>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5 text-right">Size</th>
                <th className="px-8 py-5 text-right">Entry Price</th>
                <th className="px-8 py-5 text-right">Current/Close</th>
                <th className="px-8 py-5 text-right">PnL (USD)</th>
                <th className="px-8 py-5">Outcome</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentOrders.length > 0 ? currentOrders.map((order) => {
                const isProfit = parseFloat(order.pl || 0) >= 0;
                return (
                  <tr key={order.id} className="table-row group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center font-black text-[10px] text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">{order.symbol.slice(0,2)}</div>
                         <div>
                            <span className="font-black text-white text-sm uppercase block leading-none">{order.symbol}</span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{new Date(order.time).toLocaleTimeString()}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`badge px-3 py-1 ${order.type === 'BUY' ? 'text-blue-500 bg-blue-500/10' : 'text-red-500 bg-red-500/10'}`}>{order.type}</span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-gray-400 text-sm">{order.size} Lots</td>
                    <td className="px-8 py-6 text-right font-mono text-xs opacity-60 tabular-nums">{order.entry}</td>
                    <td className="px-8 py-6 text-right font-mono text-xs tabular-nums text-white">{order.status === 'ACTIVE' ? order.current : order.closePrice}</td>
                    <td className="px-8 py-6 text-right">
                      <span className={`font-black tabular-nums text-sm transition-all duration-500 ${isProfit ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]'}`}>
                        {formatCurrency(order.pl || 0)}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                       {order.status === 'ACTIVE' ? (
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-blue-500 uppercase">Live</span>
                         </div>
                       ) : (
                         <div className="flex flex-col gap-1">
                            <span className={`text-[10px] font-black uppercase ${order.result === 'PROFIT' ? 'text-green-500' : 'text-red-500'}`}>{order.result}</span>
                            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter">{order.closeReason}</span>
                         </div>
                       )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {order.status === 'ACTIVE' ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); closeTrade(order.id); }}
                          className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all uppercase tracking-widest shadow-lg active:scale-95"
                        >
                          Close Pos.
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-gray-600">{new Date(order.closeTime).toLocaleTimeString()}</span>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="8" className="px-8 py-24 text-center">
                  <div className="w-20 h-20 bg-blue-600/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-500/20 text-4xl border border-dashed border-blue-500/20">📊</div>
                  <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">No {activeTab.toLowerCase()} trades in terminal</h3>
                  <p className="text-gray-500 text-xs mb-8">Execute your first institutional trade via the dashboard terminal</p>
                  <button onClick={() => router.push('/dashboard')} className="btn-primary px-10 py-3 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all">Launch Terminal</button>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-white/5">
           {currentOrders.map((order) => {
              const isProfit = parseFloat(order.pl || 0) >= 0;
              return (
                <div key={order.id} className="p-5 space-y-5">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-2xl bg-gray-900 border border-white/5 flex items-center justify-center font-black text-xs text-blue-500 uppercase">{order.symbol.slice(0,2)}</div>
                         <div>
                            <p className="font-black text-white text-sm uppercase leading-none mb-1">{order.symbol}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{new Date(order.time).toLocaleTimeString()}</p>
                         </div>
                      </div>
                      <span className={`badge px-3 py-1 ${order.type === 'BUY' ? 'text-blue-500 bg-blue-500/10' : 'text-red-500 bg-red-500/10'}`}>{order.type}</span>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-[#111318] rounded-2xl border border-white/5">
                         <p className="text-[9px] text-gray-600 font-black uppercase mb-1">Entry Price</p>
                         <p className="text-sm font-mono font-black text-white">{order.entry}</p>
                      </div>
                      <div className="p-4 bg-[#111318] rounded-2xl border border-white/5 text-right">
                         <p className="text-[9px] text-gray-600 font-black uppercase mb-1">Live/Close</p>
                         <p className="text-sm font-mono font-black text-white">{order.status === 'ACTIVE' ? order.current : order.closePrice}</p>
                      </div>
                   </div>

                   <div className="flex justify-between items-center pt-2">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-600 uppercase">Unrealized P/L</p>
                         <p className={`text-xl font-black tabular-nums ${isProfit ? 'text-green-500 text-glow' : 'text-red-500'}`}>{formatCurrency(order.pl || 0)}</p>
                      </div>
                      {order.status === 'ACTIVE' ? (
                        <button 
                           onClick={(e) => { e.stopPropagation(); closeTrade(order.id); }}
                           className="px-8 py-3 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-500/30"
                        >
                          Close
                        </button>
                      ) : (
                        <div className="text-right">
                           <span className={`badge block mb-1 ${order.result === 'PROFIT' ? 'text-green-500' : 'text-red-500'}`}>{order.result}</span>
                           <span className="text-[8px] font-black text-gray-600 uppercase">{order.closeReason}</span>
                        </div>
                      )}
                   </div>
                </div>
              );
           })}
        </div>
      </div>
    </div>
  );
}
