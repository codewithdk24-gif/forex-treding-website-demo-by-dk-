export const AdminPage = () => {
  // Data Fetching
  const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
  const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
  const wallet = JSON.parse(localStorage.getItem('demo_wallet') || '{"balance": 10000}');

  // Methods
  window.adminClearOrders = () => {
    localStorage.removeItem('demo_orders');
    window.showToast('Orders Cleared', 'success');
    const container = document.getElementById('router-view') || document.getElementById('app');
    if (container) container.innerHTML = AdminPage();
  };

  window.adminResetWallet = () => {
    localStorage.setItem('demo_wallet', JSON.stringify({ balance: 10000 }));
    window.showToast('Wallet Reset', 'success');
    const container = document.getElementById('router-view') || document.getElementById('app');
    if (container) container.innerHTML = AdminPage();
  };

  return `
    <div class="section-container space-y-8 fade-in h-full text-white px-4 md:px-8 py-6 pb-24 lg:pb-8 overflow-y-auto custom-scrollbar">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 class="text-3xl font-black tracking-tighter">Admin Control</h1>
          <p class="text-sm text-gray-500 font-medium">System Data & Controls</p>
        </div>
        <div class="flex gap-4">
           <button onclick="window.adminClearOrders()" class="btn-outline px-6 py-2 text-xs font-black uppercase tracking-widest text-red-500 border-red-500/20 hover:bg-red-500/10 active:scale-95 transition-transform">Clear Orders</button>
           <button onclick="window.adminResetWallet()" class="btn-outline px-6 py-2 text-xs font-black uppercase tracking-widest text-blue-500 border-blue-500/20 hover:bg-blue-600/10 active:scale-95 transition-transform">Reset Wallet</button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="card p-6 border-l-4 border-l-blue-600 bg-[#131722]/50 border-gray-800">
           <span class="text-xs font-black text-gray-500 uppercase tracking-widest">Total Users</span>
           <p class="text-3xl font-black mt-2">${users.length}</p>
        </div>
        <div class="card p-6 border-l-4 border-l-green-500 bg-[#131722]/50 border-gray-800">
           <span class="text-xs font-black text-gray-500 uppercase tracking-widest">Total Orders</span>
           <p class="text-3xl font-black mt-2">${orders.length}</p>
        </div>
        <div class="card p-6 border-l-4 border-l-yellow-500 bg-[#131722]/50 border-gray-800">
           <span class="text-xs font-black text-gray-500 uppercase tracking-widest">System Balance</span>
           <p class="text-3xl font-black mt-2">$${wallet.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
        </div>
      </div>

      <!-- Tables Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        <!-- Users Table -->
        <div class="space-y-4">
           <h2 class="text-lg font-black tracking-tighter">Registered Users</h2>
           <div class="card p-0 overflow-hidden bg-[#131722]/50 border-gray-800">
             <div class="overflow-x-auto">
               <table class="w-full text-left min-w-[400px]">
                 <thead>
                   <tr class="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                     <th class="px-6 py-4">Name</th>
                     <th class="px-6 py-4">Email / ID</th>
                   </tr>
                 </thead>
                 <tbody class="divide-y divide-gray-800">
                   ${users.map(u => `
                     <tr class="hover:bg-white/[0.02]">
                       <td class="px-6 py-4 font-black text-sm">${u.name} ${u.role === 'admin' ? '<span class="text-[9px] bg-blue-600/20 text-blue-500 px-2 py-0.5 rounded-full ml-2">ADMIN</span>' : ''}</td>
                       <td class="px-6 py-4 text-xs font-bold text-gray-400">${u.email || u.id}</td>
                     </tr>
                   `).join('')}
                 </tbody>
               </table>
             </div>
           </div>
        </div>

        <!-- Orders Table -->
        <div class="space-y-4">
           <h2 class="text-lg font-black tracking-tighter">Global Orders</h2>
           <div class="card p-0 overflow-hidden bg-[#131722]/50 border-gray-800">
             <div class="overflow-x-auto">
               <table class="w-full text-left min-w-[400px]">
                 <thead>
                   <tr class="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                     <th class="px-6 py-4">Symbol</th>
                     <th class="px-6 py-4">Type</th>
                     <th class="px-6 py-4">Size</th>
                     <th class="px-6 py-4">Status</th>
                   </tr>
                 </thead>
                 <tbody class="divide-y divide-gray-800">
                   ${orders.length === 0 ? `<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500 text-xs font-bold">No orders found.</td></tr>` : ''}
                   ${orders.map(o => `
                     <tr class="hover:bg-white/[0.02]">
                       <td class="px-6 py-4 font-black text-sm">${o.symbol}</td>
                       <td class="px-6 py-4 text-xs font-black ${o.type === 'BUY' ? 'text-blue-500' : 'text-red-500'}">${o.type}</td>
                       <td class="px-6 py-4 text-xs font-bold">${o.size}</td>
                       <td class="px-6 py-4 text-[10px] font-black tracking-widest ${o.status === 'ACTIVE' ? 'text-green-500' : 'text-gray-500'}">${o.status}</td>
                     </tr>
                   `).join('')}
                 </tbody>
               </table>
             </div>
           </div>
        </div>

      </div>
    </div>
  `;
};
