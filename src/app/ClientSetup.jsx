'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store/useStore';
import { useAuth } from '@/context/AuthContext';
import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  AlertCircle,
  X
} from 'lucide-react';

// --- Professional Toast Component with Lifecycle Management ---
const Toast = ({ notification, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = notification.type === 'ERROR' ? 5000 : 3000;
    const exitBuffer = 400; // ms before actual removal to show animation

    const timer = setTimeout(() => {
      setIsExiting(true);
    }, duration - exitBuffer);

    return () => clearTimeout(timer);
  }, [notification.type]);

  const getIcon = () => {
    switch (notification.type) {
      case 'SUCCESS':
      case 'success':
      case 'sell':
        return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'ERROR':
      case 'error':
        return <XCircle className="text-rose-500" size={20} />;
      case 'INFO':
      case 'info':
        return <Info className="text-blue-500" size={20} />;
      default:
        return <AlertCircle className="text-amber-500" size={20} />;
    }
  };

  return (
    <div 
      className={`toast ${notification.type.toLowerCase()} ${isExiting ? 'fade-out' : ''} group`}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-inner">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div 
          className="text-[13px] font-bold text-white tracking-tight leading-snug"
          dangerouslySetInnerHTML={{ __html: notification.message }}
        />
      </div>
      <button 
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onDismiss(notification.id), 300);
        }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default function ClientSetup() {
  const router = useRouter();
  const { user } = useAuth();
  const initializeRealtime = useStore(state => state.initializeRealtime);
  const setPwaPrompt = useStore(state => state.setPwaPrompt);

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

    // --- PWA Install Prompt Logic (Headless Sync) ---
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log("[PWA] Installation prompt detected and stashed in store.");
      setPwaPrompt(e);
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
        if (container.classList.contains('chart-fullscreen')) {
           window.showToast('Fullscreen Mode Enabled', 'info');
        }
      }
    };

    // Global Feedback System (Bridge to Zustand)
    window.showToast = (message, type = 'success') => {
      // Direct call to store ensures consistent behavior across React and Vanilla JS
      useStore.getState().showNotification({ 
        message, 
        type: type.toUpperCase() 
      });
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
  }, [router, setPwaPrompt]);

  const notifications = useStore(state => state.notifications);
  const dismissNotification = useStore(state => state.dismissNotification);

  return (
    <>
      <div className="toast-container">
        {notifications.map((note) => (
          <Toast 
            key={note.id} 
            notification={note} 
            onDismiss={dismissNotification} 
          />
        ))}
      </div>
    </>
  );
}
