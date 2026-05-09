'use client';
import React, { useMemo } from 'react';
import { useTradeStore } from '../store/useTradeStore';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function ActivePositions() {
  const { user } = useAuth();
  const { trades, calculateUnrealizedPnL, prices } = useTradeStore();

  React.useEffect(() => {
    if (user?.id && (!trades || trades.length === 0)) {
      console.log("[ACTIVE POSITIONS] Initial fallback fetch...");
      const fetchActive = async () => {
        const { data } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['ACTIVE', 'PENDING']);
        
        if (data) {
          useTradeStore.setState({ trades: [...data, ...(trades || []).filter(t => !data.find(d => d.id === t.id))] });
        }
      };
      fetchActive();
    }
  }, [user?.id]);

  const activeTrades = useMemo(() => {
    return (trades || []).filter(t => t.status === 'ACTIVE' || t.status === 'PENDING')
                 .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [trades]);

  const handleClose = async (trade) => {
    if (trade.status === 'PENDING') {
      await supabase.from('trades').update({ status: 'CANCELLED' }).eq('id', trade.id);
      return;
    }

    const currentPrice = prices[trade.symbol];
    if (!currentPrice) return;

    const pnl = calculateUnrealizedPnL(trade);
    
    // Use the RPC close_trade we verified in the schema
    const { error } = await supabase.rpc('close_trade', {
      trade_id: trade.id,
      final_exit_price: currentPrice,
      final_pnl: pnl
    });

    if (error) {
      console.error("Error closing trade:", error);
    }
  };

  if (activeTrades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
         <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
         </div>
         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">No Active Exposure</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activeTrades.map(trade => {
        const pnl = calculateUnrealizedPnL(trade);
        const isUp = pnl >= 0;
        const isBuy = trade.type === 'BUY';

        return (
          <div key={trade.id} className="group bg-[#111318] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${isBuy ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {trade.type}
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{trade.symbol}</h4>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
                    {trade.size} Lots @ {parseFloat(trade.entry_price).toFixed(5)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {trade.status === 'PENDING' ? (
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">Pending</span>
                ) : (
                  <>
                    <p className={`text-sm font-black tabular-nums ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {isUp ? '+' : ''}{pnl.toFixed(2)}
                    </p>
                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">USD PnL</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.03]">
               <div className="flex gap-4">
                  <div>
                    <p className="text-[8px] text-gray-600 font-black uppercase mb-0.5">TP</p>
                    <p className="text-[10px] font-bold text-gray-400">{trade.tp ? parseFloat(trade.tp).toFixed(5) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-600 font-black uppercase mb-0.5">SL</p>
                    <p className="text-[10px] font-bold text-gray-400">{trade.sl ? parseFloat(trade.sl).toFixed(5) : '-'}</p>
                  </div>
               </div>
               <button 
                onClick={() => handleClose(trade)}
                className="px-4 py-1.5 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg text-[9px] font-black text-gray-500 transition-all uppercase tracking-widest"
               >
                 {trade.status === 'PENDING' ? 'Cancel' : 'Close'}
               </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
