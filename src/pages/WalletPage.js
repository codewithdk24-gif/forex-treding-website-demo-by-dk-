export const WalletPage = () => {
  const assets = [
    { name: 'US Dollar', symbol: 'USD', balance: '124,592.00', value: '$124,592.00', change: '0.00%', icon: '💵' },
    { name: 'Euro', symbol: 'EUR', balance: '42,105.50', value: '$45,892.20', change: '+0.45%', icon: '💶' },
    { name: 'Bitcoin', symbol: 'BTC', balance: '1.45023', value: '$94,264.95', change: '+2.10%', icon: '₿' },
    { name: 'Gold', symbol: 'XAU', balance: '10.50', value: '$24,592.00', change: '-0.15%', icon: '🥇' },
  ];

  const transactions = [
    { id: 'TX-99210', type: 'DEPOSIT', asset: 'USD', amount: '+$10,000.00', status: 'COMPLETED', date: '2024-03-20' },
    { id: 'TX-99208', type: 'WITHDRAW', asset: 'EUR', amount: '-$2,500.00', status: 'COMPLETED', date: '2024-03-18' },
    { id: 'TX-99205', type: 'DEPOSIT', asset: 'BTC', amount: '+$500.00', status: 'COMPLETED', date: '2024-03-15' },
  ];

  return `
    <div class="section-container space-y-6 md:space-y-10 fade-in px-4 md:px-8 pb-32 lg:pb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-white">Capital Management</h1>
          <p class="text-gray-500 text-xs md:text-sm font-medium mt-1 uppercase tracking-widest">Institutional Liquidity · Assets</p>
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <button onclick="window.showToast('Withdrawal panel initialized', 'info')" class="flex-1 md:flex-none btn-outline px-8 py-3 text-xs font-black uppercase tracking-widest active:scale-95">Withdraw</button>
          <button onclick="window.showToast('Deposit panel initialized', 'info')" class="flex-1 md:flex-none btn-primary px-8 py-3 text-xs font-black uppercase tracking-widest shadow-lg active:scale-95">Deposit</button>
        </div>
      </div>

      <!-- Key Balances -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        ${[
          { label: 'Total Net Worth', value: '$289,341.15', sub: 'Across 12 Assets', color: 'blue' },
          { label: 'Available Margin', value: '$112,192.00', sub: '85% Liquid', color: 'green' },
          { label: 'Locked in Trades', value: '$45,400.00', sub: '4 Open Positions', color: 'gray' },
        ].map(stat => `
          <div class="card p-6 flex flex-col justify-between gap-4 border-l-4 ${stat.color === 'blue' ? 'border-l-blue-600' : stat.color === 'green' ? 'border-l-green-500' : 'border-l-gray-600'}">
            <span class="text-xs font-black text-gray-500 uppercase tracking-widest">${stat.label}</span>
            <div class="space-y-1">
              <p class="text-2xl font-black text-white">${stat.value}</p>
              <p class="text-xs font-bold text-gray-600 uppercase tracking-widest">${stat.sub}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex flex-col xl:flex-row gap-8">
        <!-- Assets Table -->
        <div class="flex-1 space-y-6">
          <div class="card p-0 overflow-hidden bg-[#131722]/50 border-gray-800">
            <div class="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 class="font-black text-white text-sm uppercase tracking-widest">Asset Allocation</h3>
              <button class="text-xs font-black text-blue-500 hover:text-white uppercase">Refresh</button>
            </div>
            <div class="overflow-x-auto no-scrollbar">
              <table class="w-full text-left min-w-[600px]">
                <thead>
                  <tr class="bg-white/5 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                    <th class="px-6 py-4">Asset</th>
                    <th class="px-6 py-4 text-right">Balance</th>
                    <th class="px-6 py-4 text-right">USD Value</th>
                    <th class="px-6 py-4 text-right">24h Change</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                  ${assets.map(asset => `
                    <tr class="group hover:bg-white/5 transition-all">
                      <td class="px-6 py-5">
                        <div class="flex items-center gap-3">
                          <span class="text-lg">${asset.icon}</span>
                          <div>
                            <p class="font-black text-white text-sm uppercase">${asset.symbol}</p>
                            <p class="text-xs font-bold text-gray-600">${asset.name}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-5 text-right font-mono text-sm text-gray-400">${asset.balance}</td>
                      <td class="px-6 py-5 text-right font-black text-white text-sm">${asset.value}</td>
                      <td class="px-6 py-5 text-right">
                        <span class="text-xs font-black ${asset.change.startsWith('+') ? 'text-green-500' : asset.change === '0.00%' ? 'text-gray-500' : 'text-red-500'}">
                          ${asset.change}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="w-full xl:w-96 space-y-6">
          <div class="flex items-center justify-between px-2">
            <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest">Recent Activity</h3>
            <button class="text-xs font-black text-blue-500 uppercase">View All</button>
          </div>
          
          <div class="space-y-3">
            ${transactions.map(tx => `
              <div class="card p-4 flex items-center justify-between group hover:border-gray-700">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-sm">
                    ${tx.type === 'DEPOSIT' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p class="font-black text-white text-xs uppercase">${tx.type}</p>
                    <p class="text-xs font-bold text-gray-600 uppercase tracking-tighter">${tx.date} · ${tx.asset}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-black text-sm ${tx.type === 'DEPOSIT' ? 'text-green-500' : 'text-white'}">${tx.amount}</p>
                  <p class="text-xs font-black text-blue-500 uppercase tracking-tighter">DONE</p>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Quick Tip -->
          <div class="card bg-blue-600/5 border-dashed border-blue-600/20 p-5 space-y-2">
             <p class="text-xs font-black text-blue-500 uppercase tracking-widest">Security Tip</p>
             <p class="text-xs text-gray-500 font-medium leading-relaxed">Large withdrawals over $50k may require L2 security verification for institutional compliance.</p>
          </div>
        </div>
      </div>
    </div>
  `;
};
