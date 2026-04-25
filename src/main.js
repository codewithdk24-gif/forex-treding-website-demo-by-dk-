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
  
  // Sync Order Panel visibility on desktop
  const orderPanel = document.getElementById('desktop-order-panel');
  if (orderPanel) {
    const showOrderPanel = page.includes('dashboard');
    orderPanel.style.display = showOrderPanel ? 'block' : 'none';
  }

  if (page === 'dashboard') {
    setTimeout(() => {
      TradingViewChart('tv-chart-container', 'FX:EURUSD', 'dark');
    }, 100);
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
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  
  toast.innerHTML = `
    <span>${icon}</span>
    <p>${message}</p>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%) scale(0.9)';
    setTimeout(() => toast.remove(), 400);
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

