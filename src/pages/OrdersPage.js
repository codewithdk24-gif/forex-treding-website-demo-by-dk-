export const OrdersPage = () => {
  if (window.activeOrderTab === undefined) window.activeOrderTab = 'ACTIVE';

  const allOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
  const currentOrders = allOrders.filter(o => o.status === window.activeOrderTab);

  window.exportOrderData = () => {
    const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    if (orders.length === 0) return window.showToast('No data to export', 'error');
    
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
    window.showToast('Data exported successfully', 'success');
  };



  // PnL Simulation logic (visual only)
  if (!window.appIntervals) window.appIntervals = [];
  if (window.__ordersInterval) clearInterval(window.__ordersInterval);
  
  if (window.activeOrderTab === 'ACTIVE' && currentOrders.length > 0) {
    const pnlInterval = setInterval(() => {
      let ordersUpdated = false;
      const allStoredOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
      
      allStoredOrders.forEach(o => {
         if (o.status === 'ACTIVE') {
            if (Math.random() > 0.90) { // 10% chance per tick to fill
               o.status = 'FILLED';
               ordersUpdated = true;
               if (window.showToast) window.showToast(`Ticket ${o.id} Filled`, 'success');
            }
         }
      });
      
      if (ordersUpdated) {
         localStorage.setItem('demo_orders', JSON.stringify(allStoredOrders));
         const view = document.getElementById('router-view');
         if (view && window.location.hash.includes('orders')) view.innerHTML = OrdersPage();
         return; // Skip PnL update this tick
      }

      document.querySelectorAll('.order-pnl').forEach(el => {
         const currentPl = parseFloat(el.dataset.pl || 0);
         const change = (Math.random() * 20 - 10); // Random swing
         const newPl = currentPl + change;
         el.dataset.pl = newPl;
         
         const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(newPl));
         const prefix = newPl >= 0 ? '+' : '-';
         el.innerText = `${prefix}$${formatted}`;
         
         el.className = `order-pnl text-right font-black ${newPl >= 0 ? 'text-green-500' : 'text-red-500'} transition-colors duration-300`;
      });

      document.querySelectorAll('.order-pnl-mobile').forEach(el => {
         const currentPl = parseFloat(el.dataset.pl || 0);
         const change = (Math.random() * 20 - 10);
         const newPl = currentPl + change;
         el.dataset.pl = newPl;
         
         const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(newPl));
         const prefix = newPl >= 0 ? '+' : '-';
         el.innerText = `${prefix}$${formatted}`;
         
         el.className = `order-pnl-mobile text-lg font-black ${newPl >= 0 ? 'text-green-500' : 'text-red-500'} transition-colors duration-300`;
      });
    }, 2000);
    window.__ordersInterval = pnlInterval;
    window.appIntervals.push(pnlInterval);
  }

  window.renderOrders = () => {
    console.log("RENDER CALLED");
    const tbody = document.getElementById('desktop-orders-tbody');
    const mobileList = document.getElementById('mobile-orders-list');
    
    if (!tbody || !mobileList) {
      console.log("RENDER ABORTED: DOM targets not found");
      return;
    }

    const all = JSON.parse(localStorage.getItem('demo_orders') || '[]')
      .filter(order => order && order.symbol && order.type && order.status);
    const current = all.filter(o => o.status === window.activeOrderTab);
    
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

    const desktopHTML = current.length > 0 ? current.map((order, index) => {
      if (!order || !order.symbol || !order.type) return '';
      return `
      <tr onclick="window.showOrderDetails('${order.id}')" class="table-row group hover:bg-white/[0.04] cursor-pointer transition-colors animate-[fadeInUp_0.3s_ease-out] ${index === 0 && window.activeOrderTab === 'ACTIVE' ? 'animate-pulse-glow' : ''}">
        <td class="px-8 py-5">
          <span class="text-xs font-mono text-gray-500">${order.time}</span>
        </td>
        <td class="px-8 py-5">
          <div class="flex items-center gap-2">
            <span class="font-black text-white text-sm">${order.symbol}</span>
          </div>
        </td>
        <td class="px-8 py-5">
          <span class="badge ${order.type === 'BUY' ? 'text-blue-500 bg-blue-500/10' : 'text-red-500 bg-red-500/10'}">${order.type}</span>
        </td>
        <td class="px-8 py-5 text-right font-bold text-gray-400">${order.size}</td>
        <td class="px-8 py-5 text-right font-mono text-xs opacity-60">${order.entry}</td>
        <td class="px-8 py-5 text-right">
          <span data-pl="${order.pl || 0}" class="order-pnl font-black ${parseFloat(order.pl || 0) >= 0 ? 'text-green-500' : 'text-red-500'} transition-colors duration-300">
            ${formatCurrency(order.pl || 0)}
          </span>
        </td>
        <td class="px-8 py-5 text-right">
          <span class="badge ${getStatusBadge(order.status)}">${order.status}</span>
        </td>
      </tr>
    `;
    }).join('') : `
      <tr><td colspan="7" class="px-8 py-16 text-center space-y-4">
        <div class="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-500 text-2xl">📋</div>
        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">No orders found</p>
        <button onclick="window.location.hash='dashboard'" class="btn-outline px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600/10 hover:text-blue-500 hover:border-blue-500/50 transition-all">Start Trading</button>
      </td></tr>
    `;

    const mobileHTML = current.length > 0 ? current.map((order, index) => {
      if (!order || !order.symbol || !order.type) return '';
      return `
       <div onclick="window.showOrderDetails('${order.id}')" class="p-4 space-y-4 cursor-pointer hover:bg-white/[0.02] transition-colors animate-[fadeInUp_0.3s_ease-out] ${index === 0 && window.activeOrderTab === 'ACTIVE' ? 'animate-pulse-glow' : ''}">
          <div class="flex justify-between items-start">
             <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center font-black text-xs text-white uppercase">${(order.symbol || '').slice(0,2)}</div>
                <div>
                   <p class="font-black text-white text-sm">${order.symbol}</p>
                   <p class="text-xs text-gray-500 font-bold uppercase tracking-widest">${order.time}</p>
                </div>
             </div>
             <div class="flex flex-col items-end gap-2">
               <span class="badge ${order.type === 'BUY' ? 'text-blue-500 bg-blue-500/10' : 'text-red-500 bg-red-500/10'}">${order.type}</span>
               <span class="text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(order.status)} px-2 py-0.5 rounded">${order.status}</span>
             </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div class="p-3 bg-[#0f1115] rounded-xl border border-gray-800">
                <p class="text-xs text-gray-500 font-black uppercase mb-1">Size</p>
                <p class="text-xs font-black text-white">${order.size} Lots</p>
             </div>
             <div class="p-3 bg-[#0f1115] rounded-xl border border-gray-800">
                <p class="text-xs text-gray-500 font-black uppercase mb-1">Entry</p>
                <p class="text-xs font-black text-white">${order.entry}</p>
             </div>
          </div>
          <div class="flex justify-between items-center pt-2">
             <p class="text-xs font-black text-gray-500 uppercase">P/L (USD)</p>
             <p data-pl="${order.pl || 0}" class="order-pnl-mobile text-lg font-black ${parseFloat(order.pl || 0) >= 0 ? 'text-green-500' : 'text-red-500'} transition-colors duration-300">${formatCurrency(order.pl || 0)}</p>
          </div>
       </div>
    `;
    }).join('') : `
       <div class="p-12 flex flex-col items-center text-center space-y-4">
          <div class="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 text-2xl">📋</div>
          <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">No orders found</p>
          <button onclick="window.location.hash='dashboard'" class="btn-outline px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600/10 hover:text-blue-500 transition-all">Start Trading</button>
       </div>
    `;

    tbody.innerHTML = desktopHTML;
    mobileList.innerHTML = mobileHTML;
  };

  // switchOrderTab needs to re-render after tab change
  window.switchOrderTab = (tab) => {
    window.activeOrderTab = tab;
    // Re-render tabs UI
    document.querySelectorAll('[data-tab-btn]').forEach(btn => {
      const isActive = btn.dataset.tabBtn === tab;
      btn.className = `flex-1 sm:flex-none px-6 py-2 text-xs font-black rounded-lg transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`;
    });
    window.renderOrders();
  };

  // Register reactive listener only once per session
  if (!window.__ordersReactiveListener) {
    window.addEventListener('tradeExecuted', () => {
      console.log("EVENT RECEIVED");
      renderOrders();
    });
    window.__ordersReactiveListener = true;
  }

  // Deferred initial render — DOM is injected async, wait 100ms
  setTimeout(() => {
    renderOrders();
  }, 100);

  return `
    <div class="section-container space-y-6 md:space-y-8 fade-in px-4 md:px-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-white">Institutional Orders</h1>
          <p class="text-gray-500 text-xs md:text-sm font-medium mt-1 uppercase tracking-widest">Execution Log · Trade History</p>
        </div>
        <button onclick="window.exportOrderData()" class="btn-primary w-full md:w-auto px-6 py-3 text-xs font-black uppercase tracking-widest shadow-lg active:scale-95">EXPORT DATA</button>
      </div>

      <div class="card p-0 overflow-hidden bg-[#131722]/50 border-0 md:border md:border-gray-800">
        <div class="p-4 md:p-6 border-b border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div class="flex bg-[#0f1115] rounded-xl p-1 border border-gray-800 w-full sm:w-auto overflow-x-auto no-scrollbar">
              ${['ACTIVE', 'FILLED', 'CANCELLED'].map(tab => `
                <button data-tab-btn="${tab}" onclick="window.switchOrderTab('${tab}')" 
                        class="flex-1 sm:flex-none px-6 py-2 text-xs font-black rounded-lg transition-all ${window.activeOrderTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}">
                  ${tab}
                </button>
              `).join('')}
           </div>
           <div class="relative w-full sm:w-64 group">
              <input type="text" placeholder="Filter Ticket ID..." class="input-field py-2 px-10 text-base md:text-sm bg-[#0f1115] border-gray-800 focus:border-blue-500/50">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">🔍</span>
           </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto max-h-[60vh] overflow-y-auto no-scrollbar relative">
          <table class="w-full text-left min-w-[800px]">
            <thead class="sticky top-0 z-10">
              <tr class="bg-[#131722] text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                <th class="px-8 py-4">Execution Time</th>
                <th class="px-8 py-4">Instrument</th>
                <th class="px-8 py-4">Action</th>
                <th class="px-8 py-4 text-right">Size</th>
                <th class="px-8 py-4 text-right">Entry Price</th>
                <th class="px-8 py-4 text-right">P/L (USD)</th>
                <th class="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody id="desktop-orders-tbody" class="divide-y divide-gray-800">
              <!-- Populated by renderOrders -->
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div id="mobile-orders-list" class="lg:hidden divide-y divide-gray-800">
           <!-- Populated by renderOrders -->
        </div>
      </div>
    </div>
  `;
};
