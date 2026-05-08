'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useTradeStore } from '@/store/useTradeStore';

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const showNotification = useTradeStore(state => state.showNotification);

  const fetchDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('deposits')
        .select(`
          *,
          profiles:user_id (email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeposits(data);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleAction = async (depositId, userId, amount, action) => {
    const status = action === 'APPROVE' ? 'approved' : 'rejected';
    
    try {
      // 1. Start Transaction (Simulated via sequential calls or RPC)
      // Ideally, use a Supabase RPC function for atomicity
      
      const { error: depositError } = await supabase
        .from('deposits')
        .update({ status })
        .eq('id', depositId);

      if (depositError) throw depositError;

      if (action === 'APPROVE') {
        // Increment balance in profiles
        // Note: Using a direct increment query
        const { error: balanceError } = await supabase.rpc('increment_balance', {
          user_id: userId,
          amount_to_add: amount
        });

        // If RPC is not set up, we fallback to a query (less safe)
        if (balanceError) {
            console.warn('RPC increment_balance not found, falling back to query');
            const { data: profile } = await supabase.from('profiles').select('balance').eq('id', userId).single();
            await supabase.from('profiles').update({ balance: (profile.balance || 0) + amount }).eq('id', userId);
        }
      }

      showNotification({ type: 'SUCCESS', message: `Request ${status} successfully` });
      fetchDeposits();
    } catch (err) {
      console.error('Action Error:', err);
      showNotification({ type: 'ERROR', message: err.message });
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500 font-black uppercase tracking-widest animate-pulse">Synchronizing Node Data...</div>;

  return (
    <div className="min-h-screen bg-[#0f1115] p-6 lg:p-12 space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <p className="text-blue-500 font-bold text-xs uppercase tracking-[0.3em]">Administrative Module v2.4</p>
          <h1 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter">Deposit <span className="text-gray-700">Verification</span></h1>
        </div>
        <div className="flex gap-4">
           <div className="bg-[#131722] border border-white/5 p-4 rounded-2xl text-center min-w-[120px]">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Pending</p>
              <p className="text-xl font-black text-white">{deposits.filter(d => d.status === 'pending').length}</p>
           </div>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Participant</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount / UTR</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Evidence</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {deposits.map((d) => (
              <tr key={d.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="p-6">
                  <p className="text-sm font-black text-white">{d.profiles?.full_name || 'N/A'}</p>
                  <p className="text-[10px] text-gray-500 font-bold">{d.profiles?.email}</p>
                </td>
                <td className="p-6">
                  <p className="text-sm font-black text-blue-500">₹{d.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{d.utr}</p>
                </td>
                <td className="p-6">
                  <a href={d.screenshot_url} target="_blank" rel="noreferrer" className="group relative block h-12 w-20 rounded-lg overflow-hidden border border-white/10 hover:border-blue-500 transition-all">
                     <img src={d.screenshot_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Proof" />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                     </div>
                  </a>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    d.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                    d.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                    'bg-yellow-500/10 text-yellow-500 animate-pulse'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-6">
                  {d.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAction(d.id, d.user_id, d.amount, 'APPROVE')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-green-600/10"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleAction(d.id, d.user_id, d.amount, 'REJECT')}
                        className="px-4 py-2 bg-[#1a1d24] hover:bg-red-600 text-gray-400 hover:text-white text-[8px] font-black uppercase tracking-widest rounded-lg transition-all border border-white/5"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {d.status !== 'pending' && (
                    <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest">Authorized {new Date(d.created_at).toLocaleDateString()}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
