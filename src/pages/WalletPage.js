// Simulated Global State for Demo
if (!window.walletState) {
  window.walletState = {
    balance: 124592.00,
    transactions: []
  };
}

export const WalletPage = () => {
  // Update UI Helper
  const refreshWalletUI = () => {
    const balanceEl = document.getElementById('main-balance');
    const headerBalanceEl = document.getElementById('header-balance');
    const historyEl = document.getElementById('transaction-history');
    
    if (balanceEl) balanceEl.innerText = '$' + window.walletState.balance.toLocaleString(undefined, { minimumFractionDigits: 2 });
    if (headerBalanceEl) headerBalanceEl.innerText = '$' + window.walletState.balance.toLocaleString(undefined, { minimumFractionDigits: 2 });
    
    if (historyEl) {
      if (window.walletState.transactions.length === 0) {
        historyEl.innerHTML = `
          <div class="p-6 text-center space-y-4">
             <div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto opacity-20 text-3xl">📝</div>
             <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest">No recent transactions</p>
          </div>
        `;
      } else {
        historyEl.innerHTML = window.walletState.transactions.map(tx => `
          <div class="px-6 py-4 space-y-2 hover:bg-white/5 cursor-pointer transition-all border-b border-gray-800 last:border-none">
            <div class="flex justify-between items-start">
              <span class="text-[9px] font-black ${tx.type === 'DEPOSIT' ? 'text-blue-500' : 'text-red-500'} uppercase tracking-widest">${tx.type}</span>
              <span class="text-[8px] font-black px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">COMPLETED</span>
            </div>
            <div class="flex justify-between items-center">
              <p class="font-black text-white text-sm">USD Wallet</p>
              <p class="font-black text-sm ${tx.type === 'DEPOSIT' ? 'text-green-500' : 'text-white'}">${tx.amount}</p>
            </div>
            <p class="text-[9px] font-bold text-gray-600">${tx.date}</p>
          </div>
        `).reverse().join('');
      }
    }
  };

  // Simulated Withdrawal Logic
  window.handleWithdrawal = (event) => {
    event.preventDefault();
    const amount = parseFloat(event.target.amount.value);
    const btn = event.target.querySelector('button');

    if (!amount || amount <= 0) return;

    btn.innerText = 'PROCESSING...';
    btn.disabled = true;

    setTimeout(() => {
      window.walletState.balance -= amount;
      window.walletState.transactions.push({
        type: 'WITHDRAWAL',
        amount: '-$' + amount.toLocaleString(),
        date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      });

      // Show Success Toast
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white font-black px-8 py-4 rounded-2xl shadow-2xl z-[500] fade-in';
      toast.innerText = 'WITHDRAWAL SUCCESSFUL';
      document.body.appendChild(toast);

      window.toggleWithdrawModal(false);
      refreshWalletUI();

      setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
      }, 2000);

      btn.innerText = 'WITHDRAW NOW';
      btn.disabled = false;
      event.target.reset();
    }, 1500);
  };

  // Simulated Deposit Logic
  window.handleDeposit = () => {
    const amount = 100000;
    window.walletState.balance += amount;
    window.walletState.transactions.push({
      type: 'DEPOSIT',
      amount: '+$' + amount.toLocaleString(),
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    });

    // Show Success Toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-black px-8 py-4 rounded-2xl shadow-2xl z-[500] fade-in';
    toast.innerText = '$100,000.00 DEPOSITED';
    document.body.appendChild(toast);

    refreshWalletUI();

    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  window.toggleWithdrawModal = (isOpen) => {
    const modal = document.getElementById('withdraw-modal');
    modal?.classList.toggle('active', isOpen);
  };

  // Initial UI sync
  setTimeout(refreshWalletUI, 0);

  return `
    <div class="section-container space-y-8 fade-in">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-white">Institutional Wallet</h1>
          <p class="text-gray-500 text-xs md:text-sm font-medium mt-1">Manage your institutional liquidity and asset distribution</p>
        </div>
        <div class="flex gap-3 w-full sm:w-auto">
          <button onclick="window.handleDeposit()" class="btn-primary flex-1 sm:flex-none px-8">DEPOSIT</button>
          <button onclick="window.toggleWithdrawModal(true)" class="btn-outline flex-1 sm:flex-none px-8 bg-[#131722]">WITHDRAW</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="card bg-gradient-to-br from-blue-600 to-blue-800 border-none relative overflow-hidden p-8 md:p-12 shadow-2xl">
            <div class="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div class="relative z-10 space-y-6">
              <span class="text-[10px] md:text-xs font-black text-white/60 uppercase tracking-[0.3em]">Account Value</span>
              <h2 id="main-balance" class="text-4xl md:text-6xl font-black text-white tracking-tighter">$${window.walletState.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
              <div class="flex items-center gap-6 pt-2">
                <div class="space-y-1"><p class="text-[9px] font-black text-white/40 uppercase">Equity</p><p class="text-lg font-black text-white">$128,802.50</p></div>
                <div class="h-8 w-px bg-white/10"></div>
                <div class="space-y-1"><p class="text-[9px] font-black text-white/40 uppercase">Open P/L</p><p class="text-lg font-black text-white">+$4,210.50</p></div>
              </div>
            </div>
          </div>

          <div class="card p-0 overflow-hidden bg-[#131722]/50">
             <div class="p-6 border-b border-gray-800 flex items-center justify-between">
                <h3 class="text-xs font-black text-white uppercase tracking-widest">Asset Allocation</h3>
             </div>
             <div class="overflow-x-auto">
                <table class="w-full text-left min-w-[500px]">
                  <thead>
                    <tr class="bg-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                      <th class="px-8 py-4">Currency</th>
                      <th class="px-8 py-4 text-right">Available</th>
                      <th class="px-8 py-4 text-right">USD Value</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-800">
                    <tr class="table-row">
                      <td class="px-8 py-5 flex items-center gap-3"><div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center font-black text-[10px]">US</div><span class="font-black text-white">US Dollar</span></td>
                      <td class="px-8 py-5 text-right font-bold text-white">87,214.40</td>
                      <td class="px-8 py-5 text-right font-black text-white">$87,214.40</td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        <div class="card p-0 bg-[#131722]/50 flex flex-col min-h-[400px]">
           <div class="p-6 border-b border-gray-800"><h3 class="text-xs font-black text-white uppercase tracking-widest">Recent Activity</h3></div>
           <div id="transaction-history" class="flex-1 overflow-y-auto">
              <!-- History will be injected here -->
           </div>
        </div>
      </div>

      <!-- Withdrawal Modal -->
      <div id="withdraw-modal" class="modal-overlay">
         <div class="modal-content space-y-8">
            <div class="flex justify-between items-start">
               <div>
                  <h3 class="text-2xl font-black text-white tracking-tighter">Withdraw Funds</h3>
                  <p class="text-gray-500 text-xs font-medium mt-1">Funds will be sent to your verified node.</p>
               </div>
               <button onclick="window.toggleWithdrawModal(false)" class="text-gray-500 hover:text-white transition-colors">✕</button>
            </div>

            <form onsubmit="window.handleWithdrawal(event)" class="space-y-6">
               <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount (USD)</label>
                  <div class="relative group">
                     <input type="number" name="amount" placeholder="0.00" required class="input-field pl-12 text-xl font-black bg-[#0f1115] border-gray-800 focus:border-blue-500">
                     <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  </div>
               </div>
               <button type="submit" class="btn-primary w-full py-5 btn-glow font-black tracking-widest">WITHDRAW NOW</button>
            </form>
         </div>
      </div>
    </div>
  `;
};
