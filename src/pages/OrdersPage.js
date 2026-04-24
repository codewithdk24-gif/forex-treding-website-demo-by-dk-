export const OrdersPage = () => {
  if (window.activeOrderTab === undefined) window.activeOrderTab = 'ACTIVE';

  const mockData = {
    ACTIVE: [
      { id: 'T-88210', time: '2024-03-21 14:22:10', symbol: 'EUR/USD', type: 'BUY', size: '1.00', entry: '1.08620', current: '1.08942', pl: '+$322.00' },
      { id: 'T-88211', time: '2024-03-21 13:10:45', symbol: 'XAU/USD', type: 'BUY', size: '0.10', entry: '2342.10', current: '2338.40', pl: '-$37.00' },
    ],
    FILLED: [
      { id: 'T-88205', time: '2024-03-20 09:12:33', symbol: 'GBP/USD', type: 'SELL', size: '0.50', entry: '1.26540', current: '1.26120', pl: '+$210.00' },
      { id: 'T-88198', time: '2024-03-19 16:45:12', symbol: 'USD/JPY', type: 'BUY', size: '1.50', entry: '150.250', current: '151.420', pl: '+$840.50' },
      { id: 'T-88195', time: '2024-03-19 10:30:15', symbol: 'ETH/USD', type: 'BUY', size: '5.00', entry: '3450.00', current: '3520.00', pl: '+$350.00' },
    ],
    CANCELLED: [
      { id: 'T-88188', time: '2024-03-18 11:20:05', symbol: 'BTC/USD', type: 'BUY', size: '0.05', entry: '65200.00', current: '65200.00', pl: '$0.00' },
    ]
  };

  window.switchOrderTab = (tab) => {
    window.activeOrderTab = tab;
    const app = document.getElementById('app');
    if (app) app.innerHTML = OrdersPage();
  };

  const currentOrders = mockData[window.activeOrderTab] || [];

  return `
    <div class="flex-1 p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 fade-in">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-white">Institutional Orders</h1>
          <p class="text-gray-500 text-xs md:text-sm font-medium mt-1">Real-time execution log and trade history</p>
        </div>
        <div class="flex gap-3">
          <button onclick="window.showToast('Data exported successfully', 'info')" class="btn-primary px-6 py-2.5 text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">EXPORT DATA</button>
        </div>
      </div>

      <div class="card p-0 overflow-hidden bg-[#131722]/50">
        <div class="p-6 border-b border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div class="flex bg-[#0f1115] rounded-lg p-0.5 border border-gray-800 w-full sm:w-auto">
              ${['ACTIVE', 'FILLED', 'CANCELLED'].map(tab => `
                <button onclick="window.switchOrderTab('${tab}')" 
                        class="flex-1 sm:flex-none px-6 py-1.5 text-[10px] font-black rounded-md transition-all ${window.activeOrderTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}">
                  ${tab}
                </button>
              `).join('')}
           </div>
           <div class="flex items-center gap-3 w-full sm:w-auto">
              <input type="text" placeholder="Filter by Ticket ID..." class="input-field py-2 px-4 text-[10px] bg-[#0f1115] border-gray-800 focus:border-blue-500/50">
           </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left min-w-[800px]">
            <thead>
              <tr class="bg-white/5 text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                <th class="px-8 py-4">Execution Time</th>
                <th class="px-8 py-4">Instrument</th>
                <th class="px-8 py-4">Action</th>
                <th class="px-8 py-4 text-right">Size</th>
                <th class="px-8 py-4 text-right">Entry Price</th>
                <th class="px-8 py-4 text-right">Current</th>
                <th class="px-8 py-4 text-right">P/L (USD)</th>
                <th class="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              ${currentOrders.length > 0 ? currentOrders.map(order => `
                <tr class="table-row group">
                  <td class="px-8 py-5">
                    <span class="text-[10px] font-mono text-gray-500">${order.time}</span>
                  </td>
                  <td class="px-8 py-5">
                    <div class="flex items-center gap-2">
                      <span class="font-black text-white text-sm">${order.symbol}</span>
                      <span class="badge bg-gray-800 text-gray-400">INST</span>
                    </div>
                  </td>
                  <td class="px-8 py-5">
                    <span class="badge ${order.type === 'BUY' ? 'text-blue-500 bg-blue-500/10' : 'text-red-500 bg-red-500/10'}">${order.type}</span>
                  </td>
                  <td class="px-8 py-5 text-right font-bold text-gray-400">${order.size}</td>
                  <td class="px-8 py-5 text-right font-mono text-xs opacity-60">${order.entry}</td>
                  <td class="px-8 py-5 text-right font-mono text-xs opacity-60">${order.current}</td>
                  <td class="px-8 py-5 text-right font-black ${order.pl.startsWith('+') ? 'text-green-500' : 'text-red-500'}">${order.pl}</td>
                  <td class="px-8 py-5 text-right">
                    <button onclick="window.showToast('Ticket ${order.id} details requested', 'info')" class="text-xs font-black text-blue-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 uppercase tracking-tighter">Details</button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="8" class="px-8 py-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs opacity-50">No orders found in this category</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
        <div class="p-6 bg-white/[0.02] border-t border-gray-800 flex justify-between items-center">
           <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Showing ${currentOrders.length} ${window.activeOrderTab.toLowerCase()} orders</p>
           <div class="flex gap-2">
              <button class="w-8 h-8 rounded bg-[#0f1115] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-all cursor-not-allowed">←</button>
              <button class="w-8 h-8 rounded bg-[#0f1115] border border-gray-800 flex items-center justify-center text-white hover:border-blue-500/50 transition-all">1</button>
              <button class="w-8 h-8 rounded bg-[#0f1115] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-all">→</button>
           </div>
        </div>
      </div>
    </div>
  `;
};

