import { TradingViewChart } from '../components/TradingViewChart';

// Analytics State
if (window.analyticsFilter === undefined) window.analyticsFilter = '30D';

export const AdminPage = () => {
  // Data Fetching Helpers
  const getUsers = () => JSON.parse(localStorage.getItem('admin_users') || '[]');
  const getTrades = () => JSON.parse(localStorage.getItem('admin_trades') || '[]');
  const getTransactions = () => JSON.parse(localStorage.getItem('admin_transactions') || '[]');
  const getLogs = () => JSON.parse(localStorage.getItem('admin_logs') || '[]');

  const currentHash = window.location.hash.slice(1);
  const tab = currentHash.split('/')[1] || 'dashboard';

  // UI Helpers
  const showToast = (message) => {
    const existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'admin-toast fixed bottom-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-black px-8 py-4 rounded-2xl shadow-2xl z-[500] fade-in border border-white/20 backdrop-blur-xl';
    toast.innerText = message.toUpperCase();
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add('opacity-0'); setTimeout(() => toast.remove(), 300); }, 2000);
  };

  window.setAnalyticsFilter = (filter) => {
    window.analyticsFilter = filter;
    const container = document.getElementById('router-view') || document.getElementById('app');
    if (container) container.innerHTML = AdminPage();
  };

  // Interaction Handlers
  window.adminAction = (type, payload) => {
    let data;
    switch (type) {
      case 'toggleUser':
        data = getUsers();
        const userIdx = data.findIndex(u => u.email === payload);
        data[userIdx].status = data[userIdx].status === 'active' ? 'suspended' : 'active';
        localStorage.setItem('admin_users', JSON.stringify(data));
        showToast(`User ${data[userIdx].status}`);
        break;
      case 'closeTrade':
        data = getTrades();
        const tradeIdx = data.findIndex(t => t.id === payload);
        data.splice(tradeIdx, 1);
        localStorage.setItem('admin_trades', JSON.stringify(data));
        showToast('Trade Closed');
        break;
      case 'approveTx':
        data = getTransactions();
        const txIdx = data.findIndex(t => t.amount === payload);
        data[txIdx].status = 'completed';
        localStorage.setItem('admin_transactions', JSON.stringify(data));
        showToast('Withdrawal Approved');
        break;
      case 'systemAction':
        // DON'T RE-RENDER for simple system actions to avoid "redirect" feeling
        showToast(`${payload} Active`);
        return; 
    }
    const container = document.getElementById('router-view') || document.getElementById('app');
    if (container) container.innerHTML = AdminPage();
  };

  const renderContent = () => {
    switch (tab) {
      case 'users':
        return `
          <div class="space-y-6 fade-in">
            <div class="flex justify-between items-center">
               <div>
                  <h2 class="text-2xl font-black text-white tracking-tighter">User Registry</h2>
                  <p class="text-xs text-gray-500 font-medium">Manage all registered trading nodes and balances.</p>
               </div>
            </div>
            <div class="card p-0 overflow-hidden bg-[#131722]/50 border-gray-800">
              <div class="overflow-x-auto">
                <table class="w-full text-left min-w-[800px]">
                  <thead>
                    <tr class="bg-white/5 text-xs font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-800">
                      <th class="px-8 py-5">Operator</th>
                      <th class="px-8 py-5">Equity</th>
                      <th class="px-8 py-5">Status</th>
                      <th class="px-8 py-5 text-right">Terminal Control</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-800">
                    ${getUsers().map(u => `
                      <tr class="hover:bg-white/[0.02] transition-all">
                        <td class="px-8 py-5 flex items-center gap-4">
                          <div class="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center font-black text-xs text-blue-500 border border-blue-600/20">${u.name[0]}</div>
                          <div>
                            <p class="font-black text-white text-sm">${u.name}</p>
                            <p class="text-xs text-gray-600 font-bold uppercase tracking-tight">${u.email}</p>
                          </div>
                        </td>
                        <td class="px-8 py-5 font-black text-white">$${u.balance.toLocaleString()}</td>
                        <td class="px-8 py-5">
                          <span class="badge ${u.status === 'suspended' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}">
                            ${u.status.toUpperCase()}
                          </span>
                        </td>
                        <td class="px-8 py-5 text-right">
                          <button onclick="window.adminAction('toggleUser', '${u.email}')" class="text-xs font-black ${u.status === 'active' ? 'text-red-500' : 'text-green-500'} border border-gray-800 px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-all">
                             ${u.status === 'active' ? 'SUSPEND' : 'ACTIVATE'}
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;
      case 'trades':
        return `
          <div class="space-y-6 fade-in">
            <h2 class="text-2xl font-black text-white tracking-tighter">Market Order Book</h2>
            <div class="card p-0 overflow-hidden bg-[#131722]/50 border-gray-800">
              <div class="overflow-x-auto">
                <table class="w-full text-left min-w-[800px]">
                  <thead>
                    <tr class="bg-white/5 text-xs font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-800">
                      <th class="px-8 py-5">Order ID</th>
                      <th class="px-8 py-5">Asset</th>
                      <th class="px-8 py-5">Type</th>
                      <th class="px-8 py-5">PnL</th>
                      <th class="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-800">
                    ${getTrades().map(t => `
                      <tr class="hover:bg-white/[0.02] transition-all">
                        <td class="px-8 py-5 font-black text-gray-500 text-xs">${t.id}</td>
                        <td class="px-8 py-5 font-black text-white">${t.pair}</td>
                        <td class="px-8 py-5"><span class="badge ${t.type === 'BUY' ? 'bg-blue-600/10 text-blue-500' : 'bg-red-500/10 text-red-500'}">${t.type}</span></td>
                        <td class="px-8 py-5 font-black ${t.pl > 0 ? 'text-green-500' : 'text-red-500'}">${t.pl > 0 ? '+' : ''}$${t.pl.toLocaleString()}</td>
                        <td class="px-8 py-5 text-right">
                          <button onclick="window.adminAction('closeTrade', '${t.id}')" class="text-xs font-black text-red-500 border border-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all">FORCE CLOSE</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;
      case 'transactions':
        return `
          <div class="space-y-6 fade-in">
            <h2 class="text-2xl font-black text-white tracking-tighter">Liquidity Registry</h2>
            <div class="card p-0 overflow-hidden bg-[#131722]/50 border-gray-800">
              <div class="overflow-x-auto">
                <table class="w-full text-left min-w-[800px]">
                  <thead>
                    <tr class="bg-white/5 text-xs font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-800">
                      <th class="px-8 py-5">Operator</th>
                      <th class="px-8 py-5">Type</th>
                      <th class="px-8 py-5">Amount</th>
                      <th class="px-8 py-5">Status</th>
                      <th class="px-8 py-5 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-800">
                    ${getTransactions().map(tx => `
                      <tr class="hover:bg-white/[0.02] transition-all">
                        <td class="px-8 py-5 font-black text-white text-sm">${tx.name}</td>
                        <td class="px-8 py-5 font-black text-gray-500 text-xs uppercase">${tx.type}</td>
                        <td class="px-8 py-5 font-black text-white">${tx.amount}</td>
                        <td class="px-8 py-5">
                          <span class="badge ${tx.status === 'completed' ? 'bg-green-500/10 text-green-500' : (tx.status === 'pending' ? 'bg-blue-600/10 text-blue-500' : 'bg-red-500/10 text-red-500')}">
                            ${tx.status.toUpperCase()}
                          </span>
                        </td>
                        <td class="px-8 py-5 text-right">
                          ${tx.status === 'pending' ? `<button onclick="window.adminAction('approveTx', '${tx.amount}')" class="text-xs font-black text-green-500 border border-green-500/20 px-4 py-2 rounded-lg hover:bg-green-500 hover:text-white transition-all">APPROVE</button>` : '—'}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;
      case 'analytics':
        const filter = window.analyticsFilter;
        const volumeFactor = filter === '1Y' ? 4.5 : (filter === '30D' ? 2.4 : (filter === '7D' ? 1.2 : 0.8));
        
        return `
          <div class="space-y-8 fade-in">
             <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 class="text-3xl font-black text-white tracking-tighter">Institutional Analytics</h2>
                  <p class="text-sm text-gray-500 font-medium">Global platform performance and risk exposure metrics.</p>
                </div>
                <div class="flex bg-[#131722] p-1.5 rounded-2xl border border-white/5 shadow-inner">
                   ${['Today', '7D', '30D', '1Y'].map(f => `
                      <button onclick="window.setAnalyticsFilter('${f}')" class="px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}">${f}</button>
                   `).join('')}
                </div>
             </div>
             <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${[
                  { label: 'Total Volume', value: `$${volumeFactor}B`, change: '+12.4%', color: 'blue' },
                  { label: 'Active Users', value: '3,291', change: '+5.2%', color: 'green' },
                  { label: 'Revenue (Fee)', value: '$42,590', change: '+8.1%', color: 'blue' },
                  { label: 'Risk Exposure', value: '68%', change: 'MODERATE', color: 'yellow' },
                ].map(kpi => `
                   <div class="card p-8 bg-gradient-to-br from-[#1a1f2e] to-transparent border-gray-800 hover:border-blue-500/20 transition-all hover:scale-[1.02] cursor-default group">
                      <div class="flex justify-between items-center mb-4"><span class="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">${kpi.label}</span><span class="text-xs font-black ${kpi.change.startsWith('+') ? 'text-green-500 bg-green-500/10' : 'text-yellow-500 bg-yellow-500/10'} px-2 py-0.5 rounded-full">${kpi.change}</span></div>
                      <p class="text-4xl font-black text-white tracking-tighter group-hover:text-blue-500 transition-colors">${kpi.value}</p>
                   </div>
                `).join('')}
             </div>
             <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 card p-8 bg-[#131722]/40 backdrop-blur-md relative overflow-hidden">
                   <div class="flex justify-between items-center mb-10"><h3 class="text-xs font-black text-white uppercase tracking-[0.3em]">Revenue Growth Path</h3><div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-blue-600 shadow-glow"></span><span class="text-xs font-black text-gray-500">REAL-TIME SYNC</span></div></div>
                   <div class="h-64 w-full relative"><svg class="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:rgba(37, 99, 235, 0.2)" /><stop offset="100%" style="stop-color:rgba(37, 99, 235, 0)" /></linearGradient></defs><path d="M0,250 Q100,220 200,240 T400,180 T600,210 T800,120 T1000,150 L1000,300 L0,300 Z" fill="url(#grad)" /><path d="M0,250 Q100,220 200,240 T400,180 T600,210 T800,120 T1000,150" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round" class="line-draw" /></svg></div>
                </div>
                <div class="card p-8 bg-[#131722]/40 backdrop-blur-md space-y-8">
                   <h3 class="text-xs font-black text-white uppercase tracking-[0.3em]">Market Velocity</h3>
                   <div class="space-y-6">${[{ asset: 'EUR/USD', vol: '42%', p: 85, color: 'blue' },{ asset: 'XAU/USD', vol: '28%', p: 65, color: 'yellow' },{ asset: 'BTC/USD', vol: '15%', p: 45, color: 'purple' }].map(item => `<div class="space-y-2"><div class="flex justify-between items-center"><span class="text-xs font-black text-white">${item.asset}</span><span class="text-xs font-black text-gray-500">${item.vol} Volume</span></div><div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-${item.color}-600 rounded-full" style="width: ${item.p}%"></div></div></div>`).join('')}</div>
                </div>
             </div>
          </div>
        `;
      case 'logs':
        return `
          <div class="space-y-6 fade-in">
            <h2 class="text-2xl font-black text-white tracking-tighter">Platform Logs</h2>
            <div class="card p-0 overflow-hidden bg-[#131722]/50 border-gray-800">
               <div class="divide-y divide-gray-800">
                  ${getLogs().map(log => `
                    <div class="p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                       <div class="flex items-center gap-6">
                          <div class="w-2 h-2 rounded-full ${log.type === 'security' ? 'bg-red-500' : 'bg-blue-600'}"></div>
                          <div>
                             <p class="text-sm font-black text-white">${log.event}</p>
                             <p class="text-xs text-gray-500 font-bold uppercase tracking-tight">Operator: ${log.user}</p>
                          </div>
                       </div>
                       <span class="text-xs font-bold text-gray-600 uppercase">${log.time}</span>
                    </div>
                  `).join('')}
               </div>
            </div>
          </div>
        `;
      case 'settings':
        return `
          <div class="space-y-8 fade-in max-w-2xl">
            <h2 class="text-2xl font-black text-white tracking-tighter">Global Parameters</h2>
            <div class="card p-8 space-y-10">
               <div class="space-y-6">
                  <div class="flex items-center justify-between">
                     <div><p class="text-sm font-black text-white">Platform Operations</p><p class="text-xs text-gray-500 font-medium">Emergency shutdown for all market nodes.</p></div>
                     <button class="w-12 h-6 bg-blue-600 rounded-full relative shadow-lg shadow-blue-600/30"><div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></button>
                  </div>
                  <div class="flex items-center justify-between">
                     <div><p class="text-sm font-black text-white">Maintenance Mode</p><p class="text-xs text-gray-500 font-medium">Restrict user access to terminals.</p></div>
                     <button class="w-12 h-6 bg-gray-800 rounded-full relative"><div class="absolute left-1 top-1 w-4 h-4 bg-gray-600 rounded-full"></div></button>
                  </div>
               </div>
               <div class="space-y-4">
                  <div class="flex justify-between items-center"><p class="text-xs font-black text-gray-500 uppercase tracking-widest">Market Spread Multiplier</p><span class="text-xs font-black text-blue-500">1.5x</span></div>
                  <div class="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden"><div class="h-full bg-blue-600 w-1/3"></div></div>
               </div>
               <button onclick="window.adminAction('save', '')" class="btn-primary w-full py-5 btn-glow font-black tracking-widest">SAVE SYSTEM CONFIG</button>
            </div>
          </div>
        `;
      default:
        return `
          <div class="space-y-8 fade-in">
             <!-- Top Control Bar -->
             <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                  <h1 class="text-3xl font-black text-white tracking-tighter">System Control Center</h1>
                  <p class="text-sm text-gray-500 font-medium">Global platform oversight and emergency operations.</p>
                </div>
                
                <div class="flex items-center gap-3 bg-red-500/5 border border-red-500/10 px-4 py-2 rounded-2xl">
                   <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                   <p class="text-xs font-black text-red-500 uppercase tracking-widest">High Risk: Institutional Exposure Active</p>
                </div>
             </div>

             <!-- KPI Grid -->
             <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${[
                  { label: 'Total Operators', value: '12,842', change: '+2.4%', icon: '👥', color: 'blue' },
                  { label: 'Active Trades', value: '329', change: '+12%', icon: '📈', color: 'green' },
                  { label: 'Network Profit', value: '$42,590', change: '+8.1%', icon: '💰', color: 'blue' },
                  { label: 'System Uptime', value: '99.99%', change: 'OPTIMAL', icon: '🛡️', color: 'green' },
                ].map(stat => `
                   <div class="card p-6 border-gray-800 hover:border-blue-500/20 transition-all group cursor-default">
                      <div class="flex justify-between items-start mb-4">
                         <span class="text-xl">${stat.icon}</span>
                         <span class="text-xs font-black ${stat.change.startsWith('+') ? 'text-green-500 bg-green-500/10' : 'text-blue-500 bg-blue-500/10'} px-2 py-0.5 rounded-full">${stat.change}</span>
                      </div>
                      <div>
                         <p class="text-xs font-black text-gray-600 uppercase tracking-widest">${stat.label}</p>
                         <p class="text-2xl font-black text-white mt-1 group-hover:text-blue-500 transition-colors tracking-tighter">${stat.value}</p>
                      </div>
                   </div>
                `).join('')}
             </div>

             <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- System Split Hero -->
                <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div class="card p-8 bg-gradient-to-br from-blue-600/20 via-[#131722] to-transparent border-blue-600/10 relative overflow-hidden">
                      <div class="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
                      <div class="relative z-10 space-y-6">
                         <h3 class="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">Node Status</h3>
                         <h2 class="text-3xl font-black text-white leading-tight tracking-tighter">Institutional <br> Liquidity Active</h2>
                         <p class="text-xs text-gray-400 font-medium">All sub-systems synced with <br> Global feeds at <span class="text-white">0.4ms</span>.</p>
                      </div>
                   </div>
                   
                   <!-- Quick Actions Panel -->
                   <div class="card p-8 space-y-4 bg-[#131722]/50 border-gray-800">
                      <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Emergency Operations</h3>
                      <button onclick="window.adminAction('systemAction', 'Trading Suspension')" class="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Suspend Trading</button>
                      <button onclick="window.adminAction('systemAction', 'System Reboot')" class="w-full py-3 px-4 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-600/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Restart System</button>
                      <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                         <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Maintenance Mode</span>
                         <div class="w-10 h-5 bg-gray-800 rounded-full relative"><div class="absolute left-1 top-1 w-3 h-3 bg-gray-600 rounded-full"></div></div>
                      </div>
                   </div>
                </div>

                <!-- System Health Monitor -->
                <div class="card p-8 space-y-6 bg-[#131722]/40 backdrop-blur-md border-gray-800">
                   <h3 class="text-xs font-black text-white uppercase tracking-[0.3em]">Network Health</h3>
                   <div class="space-y-5">
                      ${[
                        { label: 'Server Load', p: 42, color: 'blue' },
                        { label: 'Liquidity Depth', p: 88, color: 'green' },
                        { label: 'API Latency', p: 12, color: 'red' },
                      ].map(h => `
                         <div class="space-y-2">
                            <div class="flex justify-between items-center"><span class="text-xs font-black text-gray-500 uppercase">${h.label}</span><span class="text-xs font-black text-white">${h.p}%</span></div>
                            <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-${h.color}-600 rounded-full" style="width: ${h.p}%"></div></div>
                         </div>
                      `).join('')}
                   </div>
                   <div class="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span class="text-xs font-black text-gray-500 uppercase">Uptime Chain</span>
                      <div class="flex gap-1">
                         ${[1,1,1,1,1,0.5].map(v => `<div class="w-1 h-3 bg-green-500 rounded-full" style="opacity: ${v}"></div>`).join('')}
                      </div>
                   </div>
                </div>
             </div>

             <!-- Bottom Grid -->
             <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Mini Analytics (Trades per Hour) -->
                <div class="card p-10 space-y-6">
                   <div class="flex justify-between items-center">
                      <h3 class="text-xs font-black text-white uppercase tracking-widest">Activity Distribution</h3>
                      <span class="text-xs font-black text-blue-500 uppercase">Hourly View</span>
                   </div>
                   <div class="flex items-end gap-2 h-32">
                      ${[20, 40, 30, 70, 50, 90, 60, 100, 80, 40, 60, 30].map(h => `<div class="flex-1 bg-blue-600/20 rounded-t-lg hover:bg-blue-600 transition-all" style="height: ${h}%"></div>`).join('')}
                   </div>
                </div>

                <!-- Live Security Feed -->
                <div class="card p-0 overflow-hidden bg-[#131722]/40 backdrop-blur-md">
                   <div class="p-6 border-b border-gray-800 flex justify-between items-center">
                      <h3 class="text-xs font-black text-white uppercase tracking-widest">Global Activity</h3>
                      <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                   </div>
                   <div class="max-h-[280px] overflow-y-auto divide-y divide-gray-800 custom-scrollbar">
                      ${[
                        { ev: 'Deposit Verified: $12,400', u: 'Alex Rivera', t: 'Just Now', icon: '💰' },
                        { ev: 'Trade Executed: Gold/USD', u: 'Sarah Chen', t: '2m ago', icon: '⚡' },
                        { ev: 'Withdrawal Pending: $5k', u: 'Demo User', t: '12m ago', icon: '💸' },
                        { ev: 'Root Access Verified', u: 'System Admin', t: '1h ago', icon: '🔒' },
                        { ev: 'Security Patch Applied', u: 'Kernel', t: '3h ago', icon: '🛡️' },
                      ].map(log => `
                         <div class="p-6 flex items-center justify-between hover:bg-white/[0.03] transition-all group">
                            <div class="flex items-center gap-5">
                               <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">${log.icon}</div>
                               <div>
                                  <p class="text-sm font-black text-white group-hover:text-blue-500 transition-colors">${log.ev}</p>
                                  <p class="text-xs font-black text-gray-500 uppercase tracking-widest mt-1">${log.u}</p>
                               </div>
                            </div>
                            <span class="text-xs font-black text-gray-600 uppercase">${log.t}</span>
                         </div>
                      `).join('')}
                   </div>
                </div>
             </div>
          </div>
        `;
    }
  };

  return `<div class="section-container space-y-8 fade-in h-full">${renderContent()}</div>`;
};
