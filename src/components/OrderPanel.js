'use client';

import React, { useState, useEffect } from 'react';
import { useTradeStore } from '../store/useTradeStore';

export default function OrderPanel() {
  const [lotSize, setLotSize] = useState(0.50);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [executionType, setExecutionType] = useState('MARKET'); // MARKET or LIMIT
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSide, setOrderSide] = useState('BUY'); // BUY or SELL
  const [currentPrice, setCurrentPrice] = useState(1.08245);
  const [priceDirection, setPriceDirection] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [flash, setFlash] = useState(null);
  
  const { executeTrade, updateEngineState, trades } = useTradeStore();

  useEffect(() => {
    const priceInterval = setInterval(() => {
      const rand = (Math.random() * 0.00004 - 0.00002);
      const nextPrice = parseFloat((currentPrice + rand).toFixed(5));
      
      setPriceDirection(nextPrice > currentPrice ? 'up' : 'down');
      setCurrentPrice(nextPrice);
      updateEngineState('EUR/USD', nextPrice);

      setTimeout(() => setPriceDirection(null), 800);
    }, 1500);

    return () => clearInterval(priceInterval);
  }, [currentPrice, updateEngineState]);

  const increaseLot = () => setLotSize(prev => Math.min(parseFloat((prev + 0.1).toFixed(2)), 10));
  const decreaseLot = () => setLotSize(prev => Math.max(parseFloat((prev - 0.1).toFixed(2)), 0.1));

  const initiateOrder = (side) => {
    setOrderSide(side);
    setIsModalOpen(true);
  };

  const playSuccessSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const executeOrder = async () => {
    try {
      setIsExecuting(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      const symbol = 'EUR/USD';
      const entryPrice = executionType === 'LIMIT' ? parseFloat(limitPrice) : currentPrice;
      
      const newTrade = {
        id: 'T-' + Math.floor(100000 + Math.random() * 900000),
        time: new Date().toISOString(),
        symbol: symbol,
        type: orderSide,
        execution: executionType,
        size: lotSize,
        entry: entryPrice,
        tp: parseFloat(takeProfit) || 0,
        sl: parseFloat(stopLoss) || 0,
        current: entryPrice.toFixed(5),
        pl: "0.00",
        status: 'ACTIVE'
      };

      executeTrade(newTrade);

      setFlash(orderSide);
      setTimeout(() => setFlash(null), 800);
      playSuccessSound();

      setIsExecuting(false);
      setIsModalOpen(false);
      setTakeProfit('');
      setStopLoss('');
      setLimitPrice('');
    } catch (error) {
      alert(error.message);
      setIsExecuting(false);
      setIsModalOpen(false);
    }
  };

  const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const profitPreview = (lotSize * 640).toFixed(2);
  const riskPreview = (lotSize * 360).toFixed(2);

  const activeCount = trades.filter(t => t.status === 'ACTIVE').length;

  return (
    <>
      {flash && (
        <div className={`fixed inset-0 pointer-events-none z-[150] animate-flash-${flash.toLowerCase()}`}></div>
      )}

      <div className="flex w-full h-full flex-col shrink-0 overflow-y-auto relative no-scrollbar fade-in">
        
        {/* Market / Limit Toggles */}
        <div className="px-6 pt-5 pb-4 border-b border-white/5">
           <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Order Execution</p>
              <div className="flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${activeCount >= 5 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                 <span className="text-[9px] font-black text-gray-500 uppercase">{activeCount}/5 Active</span>
              </div>
           </div>
           <div className="flex bg-white/5 rounded-xl p-1 gap-1">
              <button 
                onClick={() => setExecutionType('MARKET')}
                className={`flex-1 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all ${executionType === 'MARKET' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Market
              </button>
              <button 
                onClick={() => setExecutionType('LIMIT')}
                className={`flex-1 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all ${executionType === 'LIMIT' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Limit
              </button>
           </div>
        </div>

        {/* Conditional Limit Price Input */}
        {executionType === 'LIMIT' && (
           <div className="px-6 py-4 border-b border-white/5 animate-in slide-in-from-top-2 duration-300">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Limit Entry Price</p>
              <input 
                type="number" 
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="Enter entry price..." 
                className="w-full bg-white/5 border border-blue-500/20 rounded-xl px-4 py-3 text-sm font-mono text-blue-400 focus:outline-none focus:border-blue-500/50" 
              />
           </div>
        )}

        {/* Premium Lot Control */}
        <div className="px-6 py-4 border-b border-white/5 space-y-3">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Position Size (Lots)</p>
           <div className="lot-control">
              <button onClick={decreaseLot} className="lot-btn">−</button>
              <div className="lot-value tabular-nums">{lotSize.toFixed(2)}</div>
              <button onClick={increaseLot} className="lot-btn">+</button>
           </div>
           <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-green-500">+${formatter.format(profitPreview)} Gain</span>
              <span className="text-red-500">−${formatter.format(riskPreview)} Risk</span>
           </div>
        </div>

        {/* TP / SL Inputs */}
        <div className="px-6 py-4 border-b border-white/5 space-y-3">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Take Profit / Stop Loss</p>
           <div className="grid grid-cols-2 gap-2">
              <div>
                 <p className="text-[9px] text-gray-600 font-bold mb-1">Take Profit</p>
                 <input 
                   type="number" 
                   value={takeProfit}
                   onChange={(e) => setTakeProfit(e.target.value)}
                   placeholder="0.00000" 
                   className="w-full bg-white/5 border border-green-500/20 rounded-lg px-3 py-2 text-xs font-mono text-green-400 focus:outline-none focus:border-green-500/50" 
                 />
              </div>
              <div>
                 <p className="text-[9px] text-gray-600 font-bold mb-1">Stop Loss</p>
                 <input 
                   type="number" 
                   value={stopLoss}
                   onChange={(e) => setStopLoss(e.target.value)}
                   placeholder="0.00000" 
                   className="w-full bg-white/5 border border-red-500/20 rounded-lg px-3 py-2 text-xs font-mono text-red-400 focus:outline-none focus:border-red-500/50" 
                 />
              </div>
           </div>
        </div>

        {/* Live Price Monitor */}
        <div className="px-6 py-4 flex flex-col items-center justify-center gap-1 border-b border-white/5 bg-white/[0.02]">
           <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Live Market Rate</p>
           <p className={`text-2xl font-black tabular-nums transition-all duration-300 ${priceDirection === 'up' ? 'text-green-500 scale-105' : priceDirection === 'down' ? 'text-red-500 scale-105' : 'text-white'}`}>
              {currentPrice.toFixed(5)}
           </p>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-5 mt-auto space-y-3">
           <button onClick={() => initiateOrder('BUY')}
              disabled={activeCount >= 5}
              className={`w-full py-4 rounded-xl font-black text-sm tracking-widest text-white shadow-lg transition-all uppercase btn-success ${activeCount >= 5 ? 'bg-gray-800 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-500 active:scale-[0.98]'}`}>
              {activeCount >= 5 ? 'Risk Limit Reached' : `Buy ${executionType}`}
           </button>
           <button onClick={() => initiateOrder('SELL')}
              disabled={activeCount >= 5}
              className={`w-full py-4 rounded-xl font-black text-sm tracking-widest text-white shadow-lg transition-all uppercase btn-danger ${activeCount >= 5 ? 'bg-gray-800 cursor-not-allowed opacity-50' : 'bg-red-600 hover:bg-red-500 active:scale-[0.98]'}`}>
              {activeCount >= 5 ? 'Risk Limit Reached' : `Sell ${executionType}`}
           </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
           <div className={`w-full max-w-sm bg-[#161923] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in duration-300`}>
              <div className="text-center space-y-6">
                 <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    {isExecuting ? (
                       <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                       <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    )}
                 </div>
                 <h2 className="text-xl font-black uppercase tracking-tight text-white">
                    {isExecuting ? 'Processing Order...' : `Confirm ${orderSide} ${executionType}`}
                 </h2>
                 
                 <div className="space-y-3 py-4 border-y border-white/5">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Type</span>
                       <span className="text-xs font-black text-white">{executionType} {orderSide}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Entry</span>
                       <span className="text-xs font-black text-blue-500">{executionType === 'LIMIT' ? limitPrice : 'Market'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Size</span>
                       <span className="text-xs font-black text-white">{lotSize.toFixed(2)} Lots</span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-3">
                    <button 
                      onClick={executeOrder} 
                      disabled={isExecuting}
                      className="btn-primary w-full py-4 text-xs shadow-xl shadow-blue-600/20 transition-all font-black uppercase tracking-widest bg-blue-600 text-white rounded-xl active:scale-95 disabled:opacity-50"
                    >
                      {isExecuting ? 'Transmitting...' : 'Execute Order'}
                    </button>
                    <button disabled={isExecuting} onClick={() => setIsModalOpen(false)} className="w-full h-12 bg-transparent text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
