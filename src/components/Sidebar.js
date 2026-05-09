'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DepositModal from './DepositModal';

const Icons = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  markets: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  orders: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
  wallet: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  users: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  trades: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  analytics: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  home: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  close: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  deposit: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m5 15 7 7 7-7"/></svg>,
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsSidebarOpen(prev => !prev);
    const handleOpenDeposit = () => setIsDepositOpen(true);
    
    window.addEventListener('toggleSidebar', handleToggle);
    window.addEventListener('openDepositModal', handleOpenDeposit);
    
    return () => {
      window.removeEventListener('toggleSidebar', handleToggle);
      window.removeEventListener('openDepositModal', handleOpenDeposit);
    };
  }, []);

  const isAdmin = user?.email?.includes('admin'); 
  
  const menuItems = [
    { id: 'dashboard', icon: Icons.dashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'markets', icon: Icons.markets, label: 'Markets', path: '/markets' },
    { id: 'orders', icon: Icons.orders, label: 'Orders', path: '/orders' },
    { id: 'wallet', icon: Icons.wallet, label: 'Wallet', path: '/wallet' },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', icon: Icons.users, label: 'Admin', path: '/admin' });
  }

  const handleLogout = () => {
    signOut();
  };

  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className="p-6 mb-4 flex items-center justify-between gap-3">
        <div onClick={() => router.push('/')} className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/20 shrink-0 group-hover:scale-110 transition-transform">FX</div>
          <span className={`text-xl font-black tracking-tighter ${isMobile ? 'block' : 'hidden xl:block'} text-white`}>Forex<span className="text-blue-500">Pro</span></span>
        </div>
        {isMobile && (
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors">
            {Icons.close}
          </button>
        )}
      </div>
      
      <nav className="flex-1 px-3 xl:px-4 space-y-1">
        {menuItems.map(item => {
          const isActive = pathname === item.path;
          return (
            <div 
              key={item.id}
              onClick={() => {
                router.push(item.path);
                if (isMobile) setIsSidebarOpen(false);
              }}
              className={`flex items-center justify-center xl:justify-start gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group cursor-pointer
              ${isActive ? 'bg-blue-600/10 text-blue-500 shadow-sm' : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'}
              `}
            >
              <span className="opacity-80 group-hover:opacity-100">{item.icon}</span>
              <span className={`font-semibold text-sm ${isMobile ? 'block' : 'hidden xl:block'}`}>{item.label}</span>
            </div>
          );
        })}

        {!isAdmin && (
          <div className="pt-2">
            <div 
              onClick={() => {
                setIsDepositOpen(true);
                if (isMobile) setIsSidebarOpen(false);
              }}
              className="flex items-center justify-center xl:justify-start gap-4 px-4 py-4 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all cursor-pointer group"
            >
              <span className="group-hover:scale-110 transition-transform">{Icons.deposit}</span>
              <span className={`font-black text-xs uppercase tracking-widest ${isMobile ? 'block' : 'hidden xl:block'}`}>Add Funds</span>
            </div>
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-white/5">
           <div onClick={() => router.push('/')} className="flex items-center justify-center xl:justify-start gap-4 px-4 py-3.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group cursor-pointer">
              <span className="group-hover:scale-110 transition-transform">{Icons.home}</span>
              <span className={`font-semibold text-sm ${isMobile ? 'block' : 'hidden xl:block'}`}>Exit to Website</span>
           </div>
        </div>
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t border-white/5 pb-8 px-4">
        <div className="flex items-center justify-center xl:justify-start gap-4 px-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-blue-600/20 uppercase overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.email ? user.email[0] : (isAdmin ? 'A' : 'T')
            )}
          </div>
          <div className={`${isMobile ? 'block' : 'hidden xl:block'} min-w-0`}>
            <p className="text-sm font-black text-white truncate">{profile?.full_name || user?.user_metadata?.full_name || (isAdmin ? 'Platform Admin' : 'Trader')}</p>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] truncate">{isAdmin ? 'Admin Control' : 'Active Account'}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center xl:justify-start gap-4 px-4 py-3.5 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-500/5 group"
        >
          <span className="group-hover:scale-110 transition-transform">{Icons.logout}</span>
          <span className={`font-semibold text-sm ${isMobile ? 'block' : 'hidden xl:block'}`}>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside id="desktop-sidebar" className="hidden lg:flex w-20 xl:w-64 flex-col bg-[#131722] border-r border-gray-800 h-screen sticky top-0 transition-all duration-300 z-50">
        <SidebarContent isMobile={false} />
      </aside>

      <aside id="mobile-sidebar" className={`lg:hidden fixed top-0 left-0 z-[100] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 w-72 h-screen flex flex-col bg-[#131722] shadow-2xl`}>
        <SidebarContent isMobile={true} />
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </>
  );
}
