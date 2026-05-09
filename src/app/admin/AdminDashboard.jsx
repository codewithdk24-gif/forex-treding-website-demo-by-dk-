'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useTradeStore } from '@/store/useStore';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { showNotification } = useTradeStore();
  const [users, setUsers] = useState([]);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalVolume: 0, pendingFunding: 0 });
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [uRes, dRes, sRes] = await Promise.all([
        supabase.from('profiles').select('*, wallets(*)').limit(100),
        supabase.from('transactions').select('*, profiles(full_name, email)').eq('status', 'PENDING').eq('type', 'DEPOSIT'),
        supabase.from('wallets').select('balance')
      ]);

      setUsers(uRes.data || []);
      setPendingDeposits(dRes.data || []);
      
      const totalBal = sRes.data?.reduce((acc, w) => acc + Number(w.balance), 0) || 0;
      setStats({
        totalUsers: uRes.data?.length || 0,
        totalVolume: totalBal,
        pendingFunding: dRes.data?.length || 0
      });

    } catch (err) {
      console.error("Admin Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (txId, userId, walletId, amount) => {
    try {
      // 1. Update Transaction Status
      await supabase.from('transactions').update({ status: 'COMPLETED' }).eq('id', txId);
      
      // 2. Increment Wallet Balance
      const { data: wallet } = await supabase.from('wallets').select('balance').eq('id', walletId).single();
      const newBal = Number(wallet.balance) + Number(amount);
      await supabase.from('wallets').update({ balance: newBal }).eq('id', walletId);

      // 3. Log Audit
      await supabase.from('audit_logs').insert({
        admin_id: profile.id,
        user_id: userId,
        action: 'DEPOSIT_APPROVE',
        entity_type: 'TRANSACTION',
        entity_id: txId,
        metadata: { amount }
      });

      showNotification({ type: 'SUCCESS', message: 'Deposit Approved' });
      fetchAdminData();
    } catch (err) {
      showNotification({ type: 'ERROR', message: 'Approval Failed' });
    }
  };

  if (!isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0d0f14] text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-red-500">Access Denied</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Insufficient Permissions for Institutional Control</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 space-y-12 bg-[#0d0f14] min-h-screen text-white overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Command <span className="text-blue-500">Center.</span></h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.3em] mt-2">Institutional Node Management v4.0</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-gray-500 uppercase">System Status</p>
              <p className="text-xs font-black text-green-500 uppercase">Operational</p>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Network Users', value: stats.totalUsers, color: 'blue' },
          { label: 'Total TVL', value: `$${stats.totalVolume.toLocaleString()}`, color: 'green' },
          { label: 'Pending Funding', value: stats.pendingFunding, color: 'orange' }
        ].map((s, i) => (
          <div key={i} className="p-8 bg-[#131722] border border-white/5 rounded-[2rem] space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <div className={`w-24 h-24 rounded-full bg-${s.color}-500 blur-3xl`}></div>
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.label}</p>
            <p className="text-3xl font-black tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        
        {/* Pending Funding Requests */}
        <div className="space-y-6">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] px-2">Funding Requests</h2>
          <div className="space-y-3">
            {pendingDeposits.length > 0 ? pendingDeposits.map(tx => (
              <div key={tx.id} className="p-6 bg-[#131722] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-blue-500/20 transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-black tracking-tight">{tx.profiles?.full_name || 'Unknown Trader'}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">{tx.profiles?.email}</p>
                  <div className="flex gap-2 mt-2">
                     <span className="px-2 py-0.5 bg-blue-600/10 text-blue-500 text-[9px] font-black rounded uppercase">UTR: {tx.utr}</span>
                     <span className="px-2 py-0.5 bg-green-600/10 text-green-500 text-[9px] font-black rounded uppercase">${tx.amount}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {tx.screenshot_url && (
                    <a href={tx.screenshot_url} target="_blank" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                    </a>
                  )}
                  <button 
                    onClick={() => handleApproveDeposit(tx.id, tx.user_id, tx.wallet_id, tx.amount)}
                    className="px-6 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
                  >
                    Approve
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center border border-dashed border-white/5 rounded-[2.5rem]">
                 <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No Pending Signals Detected</p>
              </div>
            )}
          </div>
        </div>

        {/* User Management */}
        <div className="space-y-6">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] px-2">User Registry</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {users.map(u => (
              <div key={u.id} className="p-4 bg-[#131722]/50 border border-white/5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center font-black text-xs text-blue-500 border border-blue-500/10">
                    {u.full_name?.[0] || 'T'}
                  </div>
                  <div>
                    <p className="text-xs font-black">{u.full_name}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase">{u.role} • {u.wallets?.[0]?.balance || 0} USD</p>
                  </div>
                </div>
                <button className="p-2 text-gray-600 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
