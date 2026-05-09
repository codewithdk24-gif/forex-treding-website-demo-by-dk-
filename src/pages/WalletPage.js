'use client';

import React from 'react';
import { useTradeStore } from '../store/useTradeStore';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';

export default function WalletPage() {
  const { wallet } = useAuth();
  const { trades, showNotification } = useTradeStore();
  
  // Use real wallet balance from Supabase via AuthContext
  const balance = wallet?.balance ? parseFloat(wallet.balance) : 0;
  
  const activeOrders = trades.filter(o => o.status === 'ACTIVE');
  const closedOrders = trades.filter(o => o.status === 'CLOSED');
  
  // Real-time Equity & Margin Calc
  let marginUsed = 0;
  let activePnl = 0;
  activeOrders.forEach(o => {
     marginUsed += parseFloat(o.size) * 1000; // Institutional margin calculation
     activePnl += parseFloat(o.pnl || 0);
  });

  const equity = balance + activePnl;
  const freeMargin = balance - marginUsed; 
  
  // Performance Analytics
  const totalTrades = closedOrders?.length || 0;
  const winningTrades = closedOrders?.filter(o => parseFloat(o.pnl || 0) > 0).length || 0;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0.0';
  
  const totalProfit = closedOrders?.reduce((acc, o) => acc + (parseFloat(o.pnl || 0) > 0 ? parseFloat(o.pnl || 0) : 0), 0) || 0;
  const totalLoss = Math.abs(closedOrders?.reduce((acc, o) => acc + (parseFloat(o.pnl || 0) < 0 ? parseFloat(o.pnl || 0) : 0), 0) || 0);

  const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  const stats = [
    { label: 'Total Equity', value: formatCurrency(equity), sub: 'Balance + Live PnL', color: 'blue', glow: activePnl >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' },
    { label: 'Wallet Balance', value: formatCurrency(balance), sub: 'Settled Capital', color: 'gray' },
    { label: 'Free Margin', value: formatCurrency(freeMargin), sub: 'Available to Trade', color: 'green' },
  ];

  const handleDeposit = () => {
    window.dispatchEvent(new CustomEvent('openDepositModal'));
  };

  const handleComingSoon = (feature) => {
    showNotification({
      type: 'INFO',
      message: `${feature} Coming Soon`
    });
  };

  return (
    <div className="flex h-screen bg-[#0f1115] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="section-container space-y-8 md:space-y-12 fade-in px-4 md:px-8 pb-32 lg:pb-12 max-w-[1600px] mx-auto py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Financial <span className="text-blue-500">Summary.</span></h1>
              <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-[0.3em]">Institutional Liquidity Hub</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button onClick={() => handleComingSoon('Withdraw')} className="flex-1 md:flex-none px-10 py-4 bg-[#111318] border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">Withdraw</button>
              <button onClick={handleDeposit} className="flex-1 md:flex-none px-10 py-4 bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 active:scale-95 transition-all">Deposit</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="card p-8 bg-[#111318] border-white/5 relative overflow-hidden group rounded-[2rem]">
                <div className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700 group-hover:opacity-30" style={{ background: `radial-gradient(circle at top right, ${stat.glow || 'transparent'}, transparent 70%)` }}></div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white tabular-nums tracking-tight">{stat.value}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            <div className="xl:col-span-2 space-y-10">
              <div className="space-y-6">
                 <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] px-2">Performance Analytics</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-6 bg-[#111318] border border-white/5 rounded-[2rem]">
                       <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Total Trades</p>
                       <p className="text-xl font-black text-white">{totalTrades}</p>
                    </div>
                    <div className="p-6 bg-[#111318] border border-white/5 rounded-[2rem]">
                       <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Win Rate</p>
                       <p className="text-xl font-black text-green-500">{winRate}%</p>
                    </div>
                    <div className="p-6 bg-[#111318] border border-white/5 rounded-[2rem]">
                       <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Gross Profit</p>
                       <p className="text-xl font-black text-green-500">${totalProfit.toFixed(2)}</p>
                    </div>
                    <div className="p-6 bg-[#111318] border border-white/5 rounded-[2rem]">
                       <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Gross Loss</p>
                       <p className="text-xl font-black text-red-500">${totalLoss.toFixed(2)}</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] px-2">Institutional Trade History</h3>
                <div className="space-y-2">
                  {closedOrders.length > 0 ? closedOrders.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-4 bg-[#111318]/50 border border-white/5 rounded-2xl group hover:border-blue-500/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${parseFloat(trade.pnl) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <p className="text-xs font-bold text-white tracking-tight">{trade.symbol} • {trade.type}</p>
                          <p className="text-[10px] font-black text-gray-500 uppercase">{trade.size} Lots • @{trade.entry_price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${parseFloat(trade.pnl) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {parseFloat(trade.pnl) >= 0 ? '+' : ''}{trade.pnl.toFixed(2)} USD
                        </p>
                        <span className="text-[10px] font-mono text-gray-600">{new Date(trade.closed_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="p-10 text-center border border-dashed border-white/5 rounded-[2rem]">
                       <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No Trade History Detected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <div className="card bg-[#111318] border-white/5 p-8 rounded-[2.5rem] space-y-6">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Margin Summary</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <p className="text-xs font-bold text-gray-400">Margin Used</p>
                        <p className="text-sm font-black text-white">{formatCurrency(marginUsed)}</p>
                     </div>
                     <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${Math.min(100, (marginUsed / (balance || 1)) * 100)}%` }}></div>
                     </div>
                     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter">
                        <span className="text-gray-600">Usage Level</span>
                        <span className={marginUsed / (balance || 1) > 0.8 ? 'text-red-500' : 'text-blue-500'}>{((marginUsed / (balance || 1)) * 100).toFixed(1)}%</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
