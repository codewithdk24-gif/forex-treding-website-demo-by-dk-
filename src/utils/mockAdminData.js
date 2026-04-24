// Admin Mock Data Initialization
const initializeAdminData = () => {
  if (!localStorage.getItem('admin_users')) {
    localStorage.setItem('admin_users', JSON.stringify([
      { name: "Demo User", email: "user@demo.com", balance: 10000, status: "active", lastLogin: "2m ago" },
      { name: "Alex Rivera", email: "alex@forexpro.io", balance: 45200, status: "active", lastLogin: "10m ago" },
      { name: "Sarah Chen", email: "sarah@liquidity.net", balance: 125000, status: "suspended", lastLogin: "1h ago" },
      { name: "Marco Rossi", email: "marco@trade.it", balance: 8400, status: "active", lastLogin: "5m ago" },
    ]));
  }

  if (!localStorage.getItem('admin_trades')) {
    localStorage.setItem('admin_trades', JSON.stringify([
      { id: 'T-1042', pair: 'EUR/USD', type: 'BUY', size: '10.00', price: '1.08620', pl: 1240.50, status: 'open' },
      { id: 'T-1043', pair: 'XAU/USD', type: 'SELL', size: '2.50', price: '2342.10', pl: -420.00, status: 'open' },
      { id: 'T-1044', pair: 'BTC/USD', type: 'BUY', size: '1.00', price: '64210.50', pl: 5100.25, status: 'open' },
      { id: 'T-1045', pair: 'GBP/JPY', type: 'SELL', size: '5.00', price: '191.450', pl: 850.10, status: 'open' },
    ]));
  }

  if (!localStorage.getItem('admin_transactions')) {
    localStorage.setItem('admin_transactions', JSON.stringify([
      { date: '24 Apr, 16:45', name: 'Demo User', type: 'WITHDRAWAL', amount: '$5,000.00', status: 'pending' },
      { date: '24 Apr, 15:30', name: 'Alex Rivera', type: 'DEPOSIT', amount: '$20,000.00', status: 'completed' },
      { date: '23 Apr, 09:12', name: 'Sarah Chen', type: 'WITHDRAWAL', amount: '$12,400.00', status: 'failed' },
    ]));
  }

  if (!localStorage.getItem('admin_logs')) {
    localStorage.setItem('admin_logs', JSON.stringify([
      { event: 'Root Login Detected', user: 'System Admin', time: '2m ago', type: 'security' },
      { event: 'Withdrawal Approved', user: 'Alex Rivera', time: '15m ago', type: 'transaction' },
      { event: 'Spread Limit Adjusted', user: 'System Admin', time: '1h ago', type: 'config' },
      { event: 'User Suspended', user: 'Sarah Chen', time: '2h ago', type: 'security' },
    ]));
  }
};

initializeAdminData();
