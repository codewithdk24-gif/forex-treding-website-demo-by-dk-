'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TradingViewChart } from '../components/TradingViewChart';
import { initializeAdminData } from '../utils/mockAdminData'; // keep mock admin data import
import { useStore } from '../store/useStore';
import { useAuth } from '@/context/AuthContext';

export default function ClientSetup() {
  const router = useRouter();
  const { user } = useAuth();
  const initializeRealtime = useStore(state => state.initializeRealtime);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    let cleanup;
    if (user?.id) {
       cleanup = initializeRealtime(user.id);
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, [user?.id, initializeRealtime]);

  useEffect(() => {
    // Global navigation bridge
    window.navigateApp = (path) => {
      router.push(path);
    };

    // --- PWA Service Worker Registration ---
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }

    // --- PWA Install Prompt Logic ---
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Global toggle functions
    window.toggleSidebar = () => {
      window.dispatchEvent(new CustomEvent('toggleSidebar'));
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
        container.className = 'toast-container fixed bottom-8 right-8 z-[9999] flex flex-col gap-3';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast ${type} bg-[#131722]/90 backdrop-blur-md border border-white/10 px-5 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center gap-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 translate-y-4 translate-x-4 scale-95`;
      
      const icon = (type === 'success' || type === 'sell') ? '✅' : type === 'error' ? '❌' : 'ℹ️';
      
      toast.innerHTML = `
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-lg">${icon}</div>
        <p class="text-sm font-bold text-white tracking-tight">${message}</p>
      `;
      
      container.appendChild(toast);
      
      // Animate in
      requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-4', 'translate-x-4', 'scale-95');
      });
      
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-x-12', 'scale-90');
        toast.addEventListener('transitionend', () => {
          toast.remove();
        }, { once: true });
      }, 3500);
    };

    window.showModal = (title, content) => {
      let overlay = document.querySelector('.modal-overlay-global');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'modal-overlay modal-overlay-global active';
        document.body.appendChild(overlay);
      }

      overlay.innerHTML = `
        <div class="modal-content relative">
          <button class="modal-close-btn absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 active:scale-95">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <h3 class="text-2xl font-black text-white mb-6 tracking-tight uppercase">${title}</h3>
          <div class="text-gray-400 text-sm leading-relaxed space-y-4 font-medium">
            ${content}
          </div>
          <div class="mt-10 flex justify-end">
            <button class="modal-close-btn btn-primary py-3 px-8 text-xs font-black rounded-xl">DISMISS</button>
          </div>
        </div>
      `;

      const closeBtns = overlay.querySelectorAll('.modal-close-btn');
      const closeModal = () => {
        overlay.querySelector('.modal-content').style.transform = 'scale(0.9)';
        overlay.querySelector('.modal-content').style.opacity = '0';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
        }, 400);
      };

      closeBtns.forEach(btn => btn.onclick = closeModal);
      overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
      
      // Animation trigger
      requestAnimationFrame(() => {
        const contentEl = overlay.querySelector('.modal-content');
        contentEl.style.opacity = '1';
        contentEl.style.transform = 'scale(1)';
      });
    };

    window.showOrderDetails = (id) => {
      const trades = useStore.getState().trades;
      const order = trades.find(o => o.id === id);
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

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [router]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  if (!showInstallBtn) return null;

  return (
    <button 
      onClick={handleInstallClick}
      className="fixed bottom-6 right-6 z-[9999] btn-primary px-6 py-3 text-xs font-black uppercase tracking-widest shadow-[0_10px_40px_rgba(37,99,235,0.4)] animate-[fadeInUp_0.5s_ease-out] flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
      Install App
    </button>
  );
}
