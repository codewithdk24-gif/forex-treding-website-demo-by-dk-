import './style.css';
import './utils/mockAdminData';
import { Router } from './utils/router';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MarketsPage } from './pages/MarketsPage';
import { OrdersPage } from './pages/OrdersPage';
import { WalletPage } from './pages/WalletPage';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { TradingViewChart } from './components/TradingViewChart';

// Initialize Demo Data
const initDemoData = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.length === 0) {
    users.push({
      name: "Demo User",
      email: "user@demo.com",
      password: "123456",
      role: "user",
      balance: 10000
    });
    localStorage.setItem('users', JSON.stringify(users));
  }
};
initDemoData();

// Role-based Access Control Helper
const getAuthUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Routes now return only the CONTENT. The Router wraps them in Layout if needed.
const routes = {
  landing: () => LandingPage(),
  auth: () => AuthPage(),
  'admin-login': () => AuthPage(),
  dashboard: () => {
    const user = getAuthUser();
    if (user?.role === 'admin') { window.location.hash = 'admin'; return ''; }
    return DashboardPage();
  },
  markets: () => {
    const user = getAuthUser();
    if (user?.role === 'admin') { window.location.hash = 'admin'; return ''; }
    return MarketsPage();
  },
  orders: () => {
    const user = getAuthUser();
    if (user?.role === 'admin') { window.location.hash = 'admin'; return ''; }
    return OrdersPage();
  },
  wallet: () => {
    const user = getAuthUser();
    if (user?.role === 'admin') { window.location.hash = 'admin'; return ''; }
    return WalletPage();
  },
  admin: () => AdminPage(),
  'admin/users': () => AdminPage(),
  'admin/trades': () => AdminPage(),
  'admin/transactions': () => AdminPage(),
  'admin/analytics': () => AdminPage(),
  'admin/settings': () => AdminPage()
};



// Initialize Router
const router = new Router(routes);

// Initial page load handling
window.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash) {
    window.location.hash = 'landing';
  }
});

// Update UI logic on route change
window.addEventListener('pageLoaded', (e) => {
  document.getElementById('mobile-sidebar')?.classList.remove('active');
  document.getElementById('sidebar-overlay')?.classList.remove('active');
  document.getElementById('trade-bottom-sheet')?.classList.remove('active');
  document.getElementById('sheet-overlay')?.classList.remove('active');

  const page = e.detail.page;
  
  // Sidebar Active State Sync
  document.querySelectorAll('aside nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === '#' + page) {
      a.classList.add('bg-blue-600/10', 'text-blue-500', 'shadow-sm');
      a.classList.remove('text-gray-400', 'hover:bg-white/[0.03]', 'hover:text-white');
    } else {
      a.classList.remove('bg-blue-600/10', 'text-blue-500', 'shadow-sm');
      if (!a.classList.contains('text-gray-500')) {
         a.classList.add('text-gray-400', 'hover:bg-white/[0.03]', 'hover:text-white');
      }
    }
  });
  
  if (page === 'dashboard') {
    import('./pages/DashboardPage').then(m => {
       if (m.initDashboard) m.initDashboard();
    });
    setTimeout(() => {
      TradingViewChart('tv-chart-container', 'FX:EURUSD', 'dark');
      
      // Hide skeleton when chart starts loading
      const skeleton = document.getElementById('chart-skeleton');
      if (skeleton) skeleton.classList.add('hidden');
    }, 100);
  }

  if (page === 'orders') {
    // DOM is now in the page — safe to render orders
    if (typeof window.renderOrders === 'function') {
      window.renderOrders();
      console.log('Orders:', JSON.parse(localStorage.getItem('demo_orders')));
    }
  }

  if (page === 'landing') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.querySelectorAll('.fade-in').forEach((el, i) => {
      el.style.animationDelay = `${i * 0.1}s`;
    });
  }
});

window.toggleSidebar = () => {
  const sidebar = document.getElementById('mobile-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar?.classList.toggle('active');
  overlay?.classList.toggle('active');
};

window.toggleBottomSheet = (isOpen) => {
  const sheet = document.getElementById('trade-bottom-sheet');
  const overlay = document.getElementById('sheet-overlay');
  if (isOpen) {
    sheet?.classList.add('active');
    overlay?.classList.add('active');
  } else {
    sheet?.classList.remove('active');
    overlay?.classList.remove('active');
  }
};

window.toggleChartFullscreen = () => {
  const container = document.getElementById('tv-chart-container');
  if (container) {
    container.classList.toggle('chart-fullscreen');
    // Re-initialize chart to fit new size
    const symbol = container.dataset.symbol || 'FX:EURUSD';
    TradingViewChart('tv-chart-container', symbol, 'dark');
    
    if (container.classList.contains('chart-fullscreen')) {
       window.showToast('Fullscreen Mode Enabled', 'info');
    }
  }
};


// Global Feedback System
window.showToast = (message, type = 'success') => {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = (type === 'success' || type === 'sell') ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  
  toast.innerHTML = `
    <span>${icon}</span>
    <p>${message}</p>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    }, { once: true });
  }, 3000);
};

window.showModal = (title, content) => {
  let overlay = document.querySelector('.modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="modal-content relative">
      <button onclick="this.closest('.modal-overlay').classList.remove('active')" class="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
      <h3 class="text-xl font-black text-white mb-4">${title}</h3>
      <div class="text-gray-400 text-sm leading-relaxed space-y-4">
        ${content}
      </div>
      <div class="mt-8 flex justify-end">
        <button onclick="this.closest('.modal-overlay').classList.remove('active')" class="btn-primary py-2 px-6 text-xs font-black">CLOSE</button>
      </div>
    </div>
  `;
  
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  };

  setTimeout(() => overlay.classList.add('active'), 10);
};

window.showOrderDetails = (id) => {
  const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
  const order = orders.find(o => o.id === id);
  if (!order) return;
  
  const msg = `
    <div class="space-y-4 text-left">
      <div class="flex justify-between border-b border-white/5 pb-2">
        <span class="text-gray-500 uppercase text-xs font-bold tracking-widest">Ticket ID</span>
        <span class="font-mono text-sm text-white">${order.id}</span>
      </div>
      <div class="flex justify-between border-b border-white/5 pb-2">
        <span class="text-gray-500 uppercase text-xs font-bold tracking-widest">Time</span>
        <span class="font-mono text-sm text-white">${order.time}</span>
      </div>
      <div class="flex justify-between border-b border-white/5 pb-2">
        <span class="text-gray-500 uppercase text-xs font-bold tracking-widest">Instrument</span>
        <span class="font-black text-sm text-white">${order.symbol}</span>
      </div>
      <div class="flex justify-between border-b border-white/5 pb-2">
        <span class="text-gray-500 uppercase text-xs font-bold tracking-widest">Action</span>
        <span class="font-black text-sm ${order.type === 'BUY' ? 'text-blue-500' : 'text-red-500'}">${order.type}</span>
      </div>
      <div class="flex justify-between border-b border-white/5 pb-2">
        <span class="text-gray-500 uppercase text-xs font-bold tracking-widest">Size</span>
        <span class="font-black text-sm text-white">${order.size} Lots</span>
      </div>
      <div class="flex justify-between border-b border-white/5 pb-2">
        <span class="text-gray-500 uppercase text-xs font-bold tracking-widest">Status</span>
        <span class="font-black text-sm ${order.status === 'ACTIVE' ? 'text-green-500' : order.status === 'FILLED' ? 'text-gray-400' : 'text-red-500'}">${order.status}</span>
      </div>
    </div>
  `;
  window.showModal('Ticket Details', msg);
};

