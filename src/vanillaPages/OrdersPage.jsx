'use client';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const orders = useStore(state => state.orders);
  const updateOrders = useStore(state => state.updateOrders);
  const syncFromLocalStorage = useStore(state => state.syncFromLocalStorage);

  // Initial load & Event Listener
  useEffect(() => {
    syncFromLocalStorage();

    const loadTimer = setTimeout(() => setIsLoading(false), 1000);

    const handleTradeExecuted = () => {
      console.log("EVENT RECEIVED: tradeExecuted");
      syncFromLocalStorage();
    };

    window.addEventListener('tradeExecuted', handleTradeExecuted);
    return () => {
      window.removeEventListener('tradeExecuted', handleTradeExecuted);
    };
  }, [syncFromLocalStorage]);

  // PnL Simulation Interval
  useEffect(() => {
    if (activeTab !== 'ACTIVE') return;

    const intervalId = setInterval(() => {
      let ordersUpdated = false;
      const newOrders = useStore.getState().orders.map(o => {
        if (o.status === 'ACTIVE') {
          // 10% chance to fill
          if (Math.random() > 0.90) {
            if (window.showToast) window.showToast(`Ticket ${o.id} Filled`, 'success');
            ordersUpdated = true;
            return { ...o, status: 'FILLED' };
          }
          // PnL swing
          const currentPl = parseFloat(o.pl || 0);
          const change = (Math.random() * 20 - 10);
          const newPl = currentPl + change;
          return { ...o, pl: newPl };
        }
        return o;
      });

      if (ordersUpdated) {
        updateOrders(newOrders);
      } else {
        useStore.setState({ orders: newOrders }); // Just update state without localstorage write if only PnL changed
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [activeTab]);

  const exportOrderData = () => {
    if (orders.length === 0) {
      if (window.showToast) window.showToast('No data to export', 'error');
      return;
    }
    const headers = ['Ticket ID', 'Time', 'Instrument', 'Action', 'Size', 'Entry Price', 'Current Price', 'P/L (USD)', 'Status'];
    const rows = orders.map(o => [o.id, o.time, o.symbol, o.type, o.size, o.entry, o.current, o.pl || 0, o.status]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(',') + '\n' 
        + rows.map(e => e.join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "institutional_orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (window.showToast) window.showToast('Data exported successfully', 'success');
  };

  const formatCurrency = (val) => {
    const num = parseFloat(val);
    const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(num));
    return num >= 0 ? `+$${formatted}` : `-$${formatted}`;
  };

  const getStatusBadge = (status) => {
    if (status === 'ACTIVE') return 'text-green-500 bg-green-500/10';
    if (status === 'FILLED') return 'text-gray-400 bg-gray-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  const filteredOrders = orders.filter(o => 
    o.status === activeTab &&
    (searchTerm === '' || o.id?.toLowerCase().includes(searchTerm.toLowerCase()) || o.symbol?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="section-container space-y-6 md:space-y-8 fade-in px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Institutional Orders</h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium mt-1 uppercase tracking-widest">Execution Log · Trade History</p>
        </div>
        <button onClick={exportOrderData} className="btn-primary w-full md:w-auto px-6 py-3 text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">EXPORT DATA</button>
      </div>

      <div className="card p-0 overflow-hidden bg-[#131722]/50 border-0 md:border md:border-gray-800">
        <div className="p-4 md:p-6 border-b border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex bg-[#0f1115] rounded-xl p-1 border border-gray-800 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {['ACTIVE', 'FILLED', 'CANCELLED'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`tab-btn flex-1 sm:flex-none px-6 py-2 text-xs font-black rounded-lg ${activeTab === tab ? 'active' : 'text-gray-500 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
           </div>
           <div className="relative w-full sm:w-64 group">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter Ticket ID..." 
                className="input-field py-2 px-10 text-base md:text-sm bg-[#0f1115] border-gray-800 focus:border-blue-500/50 w-full"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">🔍</span>
           </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto max-h-[60vh] overflow-y-auto no-scrollbar relative">
          <table className="w-full text-left min-w-[800px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#131722] text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                <th className="px-8 py-4">Execution Time</th>
                <th className="px-8 py-4">Instrument</th>
                <th className="px-8 py-4">Action</th>
                <th className="px-8 py-4 text-right">Size</th>
                <th className="px-8 py-4 text-right">Entry Price</th>
                <th className="px-8 py-4 text-right">P/L (USD)</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading ? (
                Array(5).fill().map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-5"><div className="h-4 w-24 skeleton"></div></td>
                    <td className="px-8 py-5"><div className="h-4 w-32 skeleton"></div></td>
                    <td className="px-8 py-5"><div className="h-4 w-16 skeleton"></div></td>
                    <td className="px-8 py-5 text-right"><div className="h-4 w-12 skeleton ml-auto"></div></td>
                    <td className="px-8 py-5 text-right"><div className="h-4 w-20 skeleton ml-auto"></div></td>
                    <td className="px-8 py-5 text-right"><div className="h-4 w-24 skeleton ml-auto"></div></td>
                    <td className="px-8 py-5 text-right"><div className="h-4 w-16 skeleton ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredOrders.length > 0 ? filteredOrders.map((order, index) => (
                <tr key={order.id} onClick={() => window.showOrderDetails && window.showOrderDetails(order.id)} className={`table-row group hover:bg-white/[0.04] cursor-pointer transition-colors animate-[fadeInUp_0.3s_ease-out] ${index === 0 && activeTab === 'ACTIVE' ? 'animate-pulse-glow' : ''}`}>
                  <td className="px-8 py-5">
                    <span className="text-xs font-mono text-gray-500">{order.time}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{order.symbol}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`badge ${order.type === 'BUY' ? 'text-blue-500 bg-blue-500/10' : 'text-red-500 bg-red-500/10'}`}>{order.type}</span>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-gray-400">{order.size}</td>
                  <td className="px-8 py-5 text-right font-mono text-xs opacity-60">{order.entry}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`order-pnl font-black ${parseFloat(order.pl || 0) >= 0 ? 'text-green-500' : 'text-red-500'} transition-colors duration-300`}>
                      {formatCurrency(order.pl || 0)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="px-8 py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-500 text-2xl">📋</div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No orders found</p>
                  <button onClick={() => window.navigateApp && window.navigateApp('/dashboard')} className="btn-outline px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600/10 hover:text-blue-500 hover:border-blue-500/50 transition-all">Start Trading</button>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-800">
           {isLoading ? (
             Array(3).fill().map((_, i) => (
               <div key={i} className="p-4 space-y-4 animate-pulse">
                 <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl skeleton"></div>
                     <div className="space-y-2">
                       <div className="h-3 w-20 skeleton"></div>
                       <div className="h-2 w-16 skeleton"></div>
                     </div>
                   </div>
                   <div className="h-4 w-12 skeleton"></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="h-12 skeleton"></div>
                   <div className="h-12 skeleton"></div>
                 </div>
               </div>
             ))
           ) : filteredOrders.length > 0 ? filteredOrders.map((order, index) => (
             <div key={order.id} onClick={() => window.showOrderDetails && window.showOrderDetails(order.id)} className={`p-4 space-y-4 cursor-pointer hover:bg-white/[0.02] transition-colors animate-[fadeInUp_0.3s_ease-out] ${index === 0 && activeTab === 'ACTIVE' ? 'animate-pulse-glow' : ''}`}>
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center font-black text-xs text-white uppercase">{(order.symbol || '').slice(0,2)}</div>
                      <div>
                         <p className="font-black text-white text-sm">{order.symbol}</p>
                         <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{order.time}</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-2">
                     <span className={`badge ${order.type === 'BUY' ? 'text-blue-500 bg-blue-500/10' : 'text-red-500 bg-red-500/10'}`}>{order.type}</span>
                     <span className={`text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(order.status)} px-2 py-0.5 rounded`}>{order.status}</span>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-[#0f1115] rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-500 font-black uppercase mb-1">Size</p>
                      <p className="text-xs font-black text-white">{order.size} Lots</p>
                   </div>
                   <div className="p-3 bg-[#0f1115] rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-500 font-black uppercase mb-1">Entry</p>
                      <p className="text-xs font-black text-white">{order.entry}</p>
                   </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                   <p className="text-xs font-black text-gray-500 uppercase">P/L (USD)</p>
                   <p className={`order-pnl-mobile text-lg font-black ${parseFloat(order.pl || 0) >= 0 ? 'text-green-500' : 'text-red-500'} transition-colors duration-300`}>{formatCurrency(order.pl || 0)}</p>
                </div>
             </div>
           )) : (
             <div className="p-12 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 text-2xl">📋</div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No orders found</p>
                <button onClick={() => window.navigateApp && window.navigateApp('/dashboard')} className="btn-outline px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600/10 hover:text-blue-500 transition-all">Start Trading</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
