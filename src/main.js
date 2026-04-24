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
const getAuthUser = () => JSON.parse(localStorage.getItem('currentUser') || '{}');

// Routes now return only the CONTENT. The Router wraps them in Layout if needed.
const routes = {
  landing: () => LandingPage(),
  auth: () => AuthPage(),
  'admin-login': () => AuthPage(),
  dashboard: () => {
    const user = getAuthUser();
    if (user.role === 'admin') { window.location.hash = 'admin'; return ''; }
    return DashboardPage();
  },
  markets: () => {
    const user = getAuthUser();
    if (user.role === 'admin') { window.location.hash = 'admin'; return ''; }
    return MarketsPage();
  },
  orders: () => {
    const user = getAuthUser();
    if (user.role === 'admin') { window.location.hash = 'admin'; return ''; }
    return OrdersPage();
  },
  wallet: () => {
    const user = getAuthUser();
    if (user.role === 'admin') { window.location.hash = 'admin'; return ''; }
    return WalletPage();
  },
  admin: () => {
    const user = getAuthUser();
    if (user.role !== 'admin') { window.location.hash = 'dashboard'; return ''; }
    return AdminPage();
  },
  'admin/users': () => {
    const user = getAuthUser();
    if (user.role !== 'admin') { window.location.hash = 'dashboard'; return ''; }
    return AdminPage();
  },
  'admin/trades': () => {
    const user = getAuthUser();
    if (user.role !== 'admin') { window.location.hash = 'dashboard'; return ''; }
    return AdminPage();
  },
  'admin/transactions': () => {
    const user = getAuthUser();
    if (user.role !== 'admin') { window.location.hash = 'dashboard'; return ''; }
    return AdminPage();
  },
  'admin/analytics': () => {
    const user = getAuthUser();
    if (user.role !== 'admin') { window.location.hash = 'dashboard'; return ''; }
    return AdminPage();
  },
  'admin/settings': () => {
    const user = getAuthUser();
    if (user.role !== 'admin') { window.location.hash = 'dashboard'; return ''; }
    return AdminPage();
  }
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

  const page = e.detail.page;
  
  // Sync Order Panel visibility on desktop
  const orderPanel = document.getElementById('desktop-order-panel');
  if (orderPanel) {
    const showOrderPanel = ['dashboard', 'markets'].some(h => page.includes(h));
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

window.toggleTerminal = (isOpen) => {
  const terminal = document.getElementById('mobile-terminal');
  if (isOpen) {
    terminal?.classList.add('active');
    setTimeout(() => {
      TradingViewChart('terminal-chart-container', 'FX:EURUSD', 'dark');
    }, 100);
  } else {
    terminal?.classList.remove('active');
  }
};
