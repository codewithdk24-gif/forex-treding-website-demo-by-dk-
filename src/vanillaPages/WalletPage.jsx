'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../store/useStore';

export const WalletPage = () => {
  const assets = [
    { name: 'US Dollar', symbol: 'USD', balance: '124,592.00', value: '$124,592.00', change: '0.00%', icon: '💵' },
    { name: 'Euro', symbol: 'EUR', balance: '42,105.50', value: '$45,892.20', change: '+0.45%', icon: '💶' },
    { name: 'Bitcoin', symbol: 'BTC', balance: '1.45023', value: '$94,264.95', change: '+2.10%', icon: '₿' },
    { name: 'Gold', symbol: 'XAU', balance: '10.50', value: '$24,592.00', change: '-0.15%', icon: '🥇' },
  ];

  const [txHistory, setTxHistory] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const wallet = useStore(state => state.wallet);
  const orders = useStore(state => state.orders);
  const updateWallet = useStore(state => state.updateWallet);
  
  const baseBalance = wallet?.balance || 10000;

  let marginUsed = 0;
  let activePnl = 0;
  const activeOrders = orders.filter(o => o.status === 'ACTIVE');
  
  activeOrders.forEach(o => {
     marginUsed += parseFloat(o.size) * 1000;
     activePnl += parseFloat(o.pl || 0);
  });
  
  const activeOrdersCount = activeOrders.length;

  const totalNetWorth = baseBalance + activePnl;
  const availableMargin = totalNetWorth - marginUsed;
  
  const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);

    if (!depositAmount || isNaN(amount) || amount <= 0) {
      if (window.showToast) window.showToast('Please enter a valid amount > 0', 'error');
      return;
    }

    setIsDepositing(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update Zustand & localStorage
    updateWallet(amount);

    // Update Supabase
    const userId = localStorage.getItem('current_user') || 'anonymous';
    try {
      const { error } = await supabase.from('transactions').insert([{
        id: 'TX-' + Math.floor(10000 + Math.random() * 90000),
        user_id: userId,
        amount: amount,
        type: 'deposit',
        time: new Date().toISOString()
      }]);
      if (error) throw error;
      console.log("Supabase insert success");
    } catch (err) {
      console.log("Supabase error", err);
    }

    if (window.showToast) window.showToast('Deposit Successful', 'success');
    setDepositAmount('');
    setIsDepositing(false);
    fetchTransactions();
  };

  const fetchTransactions = async () => {
    const userId = localStorage.getItem('current_user') || 'anonymous';
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('time', { ascending: false });
      
      if (!error && data) {
        setTxHistory(data);
      }
    } catch (err) {
      console.error("Fetch transactions error:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="section-container space-y-6 md:space-y-10 fade-in px-4 md:px-8 pb-32 lg:pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Capital Management</h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium mt-1 uppercase tracking-widest">Institutional Liquidity · Assets</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => window.showModal && window.showModal('Withdraw Funds', 'Select a verified bank account or crypto address to initiate withdrawal. Standard processing time is 1-3 business days.')} className="flex-1 md:flex-none btn-outline px-8 py-3 text-xs font-black uppercase tracking-widest active:scale-95 transition-all">Withdraw</button>
          <button onClick={() => window.showModal && window.showModal('Deposit Funds', 'Choose your preferred deposit method. Crypto deposits are credited after 3 network confirmations. Wire transfers may take up to 24 hours.')} className="flex-1 md:flex-none btn-primary px-8 py-3 text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Deposit</button>
        </div>
      </div>

      {/* Key Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
          Array(3).fill().map((_, i) => (
            <div key={i} className="card p-6 h-32 flex flex-col justify-between">
              <div className="w-24 h-3 skeleton"></div>
              <div className="space-y-2">
                <div className="w-32 h-6 skeleton"></div>
                <div className="w-20 h-2 skeleton"></div>
              </div>
            </div>
          ))
        ) : [
          { label: 'Total Net Worth', value: formatCurrency(totalNetWorth), sub: 'Includes Active PnL', color: 'blue' },
          { label: 'Available Margin', value: formatCurrency(availableMargin), sub: 'Liquid Capital', color: 'green' },
          { label: 'Locked Margin', value: formatCurrency(marginUsed), sub: `${activeOrdersCount} Open Positions`, color: 'gray' },
        ].map((stat, i) => (
          <div key={i} className={`card p-6 flex flex-col justify-between gap-4 border-l-4 ${stat.color === 'blue' ? 'border-l-blue-600' : stat.color === 'green' ? 'border-l-green-500' : 'border-l-gray-600'}`}>
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
            <div className="space-y-1">
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Assets Table */}
        <div className="flex-1 space-y-6">
          <div className="card p-0 overflow-hidden bg-[#131722]/50 border-gray-800">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-black text-white text-sm uppercase tracking-widest">Asset Allocation</h3>
              <button className="text-xs font-black text-blue-500 hover:text-white uppercase">Refresh</button>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-white/5 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                    <th className="px-6 py-4">Asset</th>
                    <th className="px-6 py-4 text-right">Balance</th>
                    <th className="px-6 py-4 text-right">USD Value</th>
                    <th className="px-6 py-4 text-right">24h Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {assets.map((asset, i) => (
                    <tr key={i} className="group hover:bg-white/5 transition-all">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{asset.icon}</span>
                          <div>
                            <p className="font-black text-white text-sm uppercase">{asset.symbol}</p>
                            <p className="text-xs font-bold text-gray-400">{asset.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-mono text-sm text-gray-400">{asset.balance}</td>
                      <td className="px-6 py-5 text-right font-black text-white text-sm">{asset.value}</td>
                      <td className="px-6 py-5 text-right">
                        <span className={`text-xs font-black ${asset.change.startsWith('+') ? 'text-green-500' : asset.change === '0.00%' ? 'text-gray-500' : 'text-red-500'}`}>
                          {asset.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full xl:w-96 space-y-6">
          {/* Quick Deposit */}
          <div className="card p-6 border-l-4 border-l-blue-600 bg-[#131722]/50 border-gray-800 space-y-4">
            <div>
              <h3 className="font-black text-white text-sm uppercase tracking-widest">Quick Deposit</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">Add funds to your trading wallet</p>
            </div>
            <div className="space-y-3">
              <input 
                type="number" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount (e.g. 500)" 
                className="w-full bg-[#0f1115] border border-gray-800 rounded-xl px-4 py-3 text-sm font-black text-white focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all" 
              />
              <button 
                onClick={handleDeposit} 
                disabled={isDepositing}
                className="btn-primary w-full py-3 text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isDepositing ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                ) : (
                  'Add Funds'
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Recent Activity</h3>
            <button className="text-xs font-black text-blue-500 uppercase">View All</button>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
            {txHistory.length > 0 ? txHistory.map((tx, i) => (
              <div key={tx.id || i} className="card p-4 flex items-center justify-between group hover:border-gray-700 transition-all animate-[fadeInUp_0.3s_ease-out]">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {tx.type === 'deposit' ? '↓' : '⇄'}
                  </div>
                  <div>
                    <p className="font-black text-white text-[10px] uppercase tracking-widest">{tx.type}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                      {new Date(tx.time).toLocaleDateString()} · {tx.asset || 'USD'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${tx.type === 'deposit' ? 'text-green-500' : 'text-white'}`}>
                    {tx.type === 'deposit' ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">COMPLETED</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No transactions yet</p>
              </div>
            )}
          </div>

          {/* Quick Tip */}
          <div className="card bg-blue-600/5 border-dashed border-blue-600/20 p-5 space-y-2">
             <p className="text-xs font-black text-blue-500 uppercase tracking-widest">Security Tip</p>
             <p className="text-xs text-gray-500 font-medium leading-relaxed">Large withdrawals over $50k may require L2 security verification for institutional compliance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
