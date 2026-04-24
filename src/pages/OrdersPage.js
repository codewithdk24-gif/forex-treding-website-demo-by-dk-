export const OrdersPage = () => {
  return `
    <div class="flex-1 p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 fade-in">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-white">Execution Log</h1>
          <p class="text-gray-500 text-xs md:text-sm font-medium mt-1">Full history of your institutional order flow</p>
        </div>
        <div class="flex gap-3">
          <button class="btn-primary px-6 py-2.5 text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">EXPORT DATA</button>
        </div>
      </div>

      <div class="card p-0 overflow-hidden bg-[#131722]/50">
        <div class="p-6 border-b border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div class="flex bg-[#0f1115] rounded-lg p-0.5 border border-gray-800 w-full sm:w-auto">
              <button class="flex-1 sm:flex-none px-6 py-1.5 text-[10px] font-black rounded-md bg-blue-600 text-white shadow-lg">ACTIVE</button>
              <button class="flex-1 sm:flex-none px-6 py-1.5 text-[10px] font-black rounded-md text-gray-500 hover:text-white transition-all">FILLED</button>
              <button class="flex-1 sm:flex-none px-6 py-1.5 text-[10px] font-black rounded-md text-gray-500 hover:text-white transition-all">CANCELLED</button>
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
              ${[
                { time: '2024-03-21 14:22:10', symbol: 'EUR/USD', type: 'BUY', size: '1.00', entry: '1.08620', current: '1.08942', pl: '+$322.00', status: 'success' },
                { time: '2024-03-21 13:10:45', symbol: 'XAU/USD', type: 'BUY', size: '0.10', entry: '2342.10', current: '2338.40', pl: '-$37.00', status: 'danger' },
                { time: '2024-03-21 12:45:12', symbol: 'GBP/USD', type: 'SELL', size: '0.50', entry: '1.26540', current: '1.26420', pl: '+$60.00', status: 'success' },
                { time: '2024-03-21 10:15:33', symbol: 'USD/JPY', type: 'BUY', size: '2.00', entry: '151.250', current: '151.420', pl: '+$224.50', status: 'success' },
              ].map(order => `
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
                    <span class="badge ${order.type === 'BUY' ? 'text-blue-500 bg-blue-500/10' : 'text-gray-200 bg-gray-700'}">${order.type}</span>
                  </td>
                  <td class="px-8 py-5 text-right font-bold text-gray-400">${order.size}</td>
                  <td class="px-8 py-5 text-right font-mono text-xs opacity-60">${order.entry}</td>
                  <td class="px-8 py-5 text-right font-mono text-xs opacity-60">${order.current}</td>
                  <td class="px-8 py-5 text-right font-black ${order.pl.startsWith('+') ? 'text-green-500' : 'text-red-500'}">${order.pl}</td>
                  <td class="px-8 py-5 text-right">
                    <button class="text-xs font-black text-blue-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 uppercase tracking-tighter">Details</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="p-6 bg-white/[0.02] border-t border-gray-800 flex justify-between items-center">
           <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Showing 4 active engagements</p>
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
