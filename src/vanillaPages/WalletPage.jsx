'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  ShieldCheck, 
  Zap,
  TrendingUp,
  CreditCard,
  History,
  Info,
  Loader2,
  X,
  Search,
  ChevronRight,
  Filter,
  Download,
  Smartphone,
  Globe,
  Coins,
  CheckCircle2,
  AlertCircle,
  Building2,
  Fingerprint
} from 'lucide-react';

// Institutional Metrics Component with Animated Counter
const FinancialCard = ({ label, value, sub, icon, trend, color, isLoading }) => (
  <div className={`group relative p-6 rounded-[2.5rem] border border-white/[0.05] bg-gradient-to-br ${color} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl overflow-hidden`}>
    <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 group-hover:text-white transition-colors">
        {icon}
      </div>
      {trend && (
        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${trend > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{label}</p>
      <div className="flex items-baseline gap-2">
         {isLoading ? (
           <div className="h-10 w-40 bg-white/5 animate-pulse rounded-lg"></div>
         ) : (
           <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter tabular-nums leading-none">{value}</h3>
         )}
      </div>
      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2">{sub}</p>
    </div>
  </div>
);

export const WalletPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [txHistory, setTxHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const wallet = useStore(state => state.wallet);
  const trades = useStore(state => state.trades) || [];
  
  const baseBalance = wallet?.balance || 0;

  // Real-time Calculations
  const metrics = useMemo(() => {
    let marginUsed = 0;
    let activePnl = 0;
    const activeOrders = Array.isArray(trades) ? trades.filter(o => o.status === 'ACTIVE') : [];
    
    activeOrders.forEach(o => {
       marginUsed += parseFloat(o.size) * 1000;
       activePnl += parseFloat(o.pl || 0);
    });

    const totalNetWorth = baseBalance + activePnl;
    const availableMargin = totalNetWorth - marginUsed;
    const marginLevel = marginUsed > 0 ? (totalNetWorth / marginUsed) * 100 : 0;

    return {
      equity: totalNetWorth,
      marginUsed,
      freeMargin: availableMargin,
      pnl: activePnl,
      marginLevel,
      openPositions: activeOrders.length
    };
  }, [trades, baseBalance]);

  const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  const fetchTransactions = async () => {
    if (!user || !user.id) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) setTxHistory(data);
    } catch (err) {
      console.error("[INFRA] Fetch transactions error:", err);
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [user]);

  const filteredHistory = useMemo(() => {
    return txHistory.filter(tx => 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [txHistory, searchQuery]);

  return (
    <div className="institutional-container space-y-8 md:space-y-12 fade-in pb-16 selection:bg-blue-500/20 overflow-x-hidden pt-4 md:pt-8">
      
      {/* Institutional Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pt-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
             <h1 className="text-heading-1 text-white">
               Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">Hub.</span>
             </h1>
          </div>
          <p className="text-subtitle">Multi-Asset Institutional Custody Node</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/[0.02] p-2 rounded-[2rem] border border-white/5 backdrop-blur-md">
           <button 
             onClick={() => router.push('/wallet/withdraw')}
             className="px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all active:scale-95"
           >
             Withdraw
           </button>
           <button 
             onClick={() => router.push('/wallet/deposit')}
             className="px-10 py-5 rounded-[1.5rem] bg-blue-600 text-[11px] font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95 ring-1 ring-white/10"
           >
             Deposit Funds
           </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <FinancialCard 
          label="Total Equity" 
          value={formatCurrency(metrics.equity)} 
          sub="Combined Real-time Worth" 
          icon={<Globe size={20} />} 
          trend={1.2}
          color="from-blue-600/10 to-[#0d1117]" 
          isLoading={isLoading}
        />
        <FinancialCard 
          label="Available Margin" 
          value={formatCurrency(metrics.freeMargin)} 
          sub="Liquidity Available" 
          icon={<Zap size={20} />} 
          color="from-emerald-600/10 to-[#0d1117]" 
          isLoading={isLoading}
        />
        <FinancialCard 
          label="Floating PnL" 
          value={formatCurrency(metrics.pnl)} 
          sub={`${metrics.openPositions} Active Positions`} 
          icon={<TrendingUp size={20} />} 
          color={metrics.pnl >= 0 ? "from-emerald-600/10 to-[#0d1117]" : "from-rose-600/10 to-[#0d1117]"} 
          isLoading={isLoading}
        />
        <FinancialCard 
          label="Margin Level" 
          value={`${metrics.marginLevel.toFixed(1)}%`} 
          sub="Account Safety Node" 
          icon={<ShieldCheck size={20} />} 
          color="from-purple-600/10 to-[#0d1117]" 
          isLoading={isLoading}
        />
      </div>

      {/* Broker Ledger & Tools */}
      <div className="flex flex-col xl:flex-row gap-10">
        <div className="flex-1 space-y-8 min-w-0">
          <div className="bg-[#131722]/50 border border-white/[0.05] rounded-[3rem] overflow-hidden shadow-2xl">
            {/* Table Header / Filters */}
            <div className="p-8 border-b border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-inner">
                    <History size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg uppercase tracking-tight">Institutional Ledger</h3>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-0.5">Verified Transaction Records</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                  <div className="relative group max-w-xs">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                     <input 
                       type="text" 
                       placeholder="Search Ticket ID..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="h-12 bg-black/20 border border-white/[0.05] rounded-xl pl-12 pr-6 text-[11px] font-black text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600 uppercase" 
                     />
                  </div>
                  <button className="h-12 w-12 flex items-center justify-center bg-white/[0.03] border border-white/[0.05] rounded-xl text-gray-500 hover:text-white transition-all">
                    <Filter size={18} />
                  </button>
                  <button className="h-12 w-12 flex items-center justify-center bg-white/[0.03] border border-white/[0.05] rounded-xl text-gray-500 hover:text-white transition-all">
                    <Download size={18} />
                  </button>
               </div>
            </div>

            {/* Ledger Table */}
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="bg-white/[0.02] text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/[0.05]">
                    <th className="px-10 py-6">Transaction ID</th>
                    <th className="px-10 py-6">Timestamp</th>
                    <th className="px-10 py-6">Method</th>
                    <th className="px-10 py-6 text-right">Amount (USD)</th>
                    <th className="px-10 py-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {filteredHistory.length > 0 ? filteredHistory.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-white/[0.02] transition-all cursor-pointer">
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          </span>
                          <div>
                            <p className="text-[11px] font-black text-white uppercase tracking-widest">{tx.id}</p>
                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{tx.type} • Direct Node</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7 text-[10px] font-bold text-gray-500 uppercase tabular-nums">
                        {new Date(tx.created_at || tx.time).toLocaleString()}
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-2">
                           <Globe size={14} className="text-gray-600" />
                           <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Network Transfer</span>
                        </div>
                      </td>
                      <td className={`px-10 py-7 text-right font-black tabular-nums text-sm ${tx.type === 'DEPOSIT' ? 'text-emerald-500' : 'text-white'}`}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td className="px-10 py-7 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">Settled</span>
                         </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-24 text-center">
                         <div className="flex flex-col items-center gap-4 opacity-30">
                            <History size={48} className="text-gray-500" />
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">No Ledger Activity Recorded</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Intelligence */}
        <div className="w-full xl:w-[400px] space-y-8">
           <div className="bg-gradient-to-br from-[#1e222d] to-[#0d1117] border border-white/[0.05] rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={120} />
              </div>
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <h3 className="font-black text-white text-[11px] uppercase tracking-[0.2em]">Security Protocol</h3>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Verified</span>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/[0.05] flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                          <Fingerprint size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Biometric Guard</p>
                          <p className="text-sm font-black text-white">ENABLED</p>
                       </div>
                    </div>
                    <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/[0.05] flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-500">
                          <Smartphone size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">2FA Protection</p>
                          <p className="text-sm font-black text-white">ACTIVE</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-blue-600/5 rounded-3xl border border-blue-600/20 border-dashed">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                       <Info size={14} />
                       Withdrawal Limit
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-tighter">
                      Your current Tier 1 verification allows daily withdrawals up to $50,000. Upgrade to institutional tier for unlimited liquidity access.
                    </p>
                 </div>
              </div>
           </div>

           <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8">
              <h3 className="font-black text-white text-[11px] uppercase tracking-[0.2em] mb-6">Market Notice</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Bank Processing', time: 'EST 2-4H', icon: <Building2 size={14} /> },
                   { label: 'Crypto Network', time: 'EST 10M', icon: <Coins size={14} /> },
                 ].map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center group cursor-pointer">
                      <div className="flex items-center gap-3 text-gray-500 group-hover:text-white transition-colors">
                        {item.icon}
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest tabular-nums">{item.time}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
