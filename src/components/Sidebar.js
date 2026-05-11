'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { 
  LayoutDashboard, 
  BarChart3, 
  History, 
  Wallet, 
  Users, 
  LogOut, 
  Home, 
  X, 
  Plus,
  ArrowRightLeft,
  Settings,
  ShieldCheck,
  ChevronRight,
  Monitor
} from 'lucide-react';

// --- Sub-component extracted for stability ---
const SidebarContent = ({ 
  isMobile = false, 
  router, 
  pathname, 
  user, 
  profile, 
  signOut, 
  setIsSidebarOpen,
  isAdmin,
  pwaPrompt,
  installPwa 
}) => {
  
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Terminal', path: '/dashboard' },
    { id: 'markets', icon: <BarChart3 size={20} />, label: 'Markets', path: '/markets' },
    { id: 'orders', icon: <History size={20} />, label: 'Orders', path: '/orders' },
    { id: 'wallet', icon: <Wallet size={20} />, label: 'Wallet', path: '/wallet' },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', icon: <ShieldCheck size={20} />, label: 'Admin Panel', path: '/admin' });
  }

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("[SIDEBAR] Logout button clicked");
    if (isMobile) setIsSidebarOpen(false);
    await signOut();
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-r border-white/5 shadow-2xl relative">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none opacity-30"></div>
      
      {/* Brand Header */}
      <div className="p-6 mb-2 flex items-center justify-between gap-3 relative z-10">
        <div onClick={() => router.push('/')} className="flex items-center gap-3.5 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-all duration-300 ring-1 ring-white/10">
            FX
          </div>
          <div className={`${isMobile ? 'block' : 'hidden xl:block'}`}>
            <span className="text-xl font-black tracking-tight text-white block leading-none">Forex<span className="text-blue-500">Pro</span></span>
            <span className="text-subtitle mt-1 block">Institutional</span>
          </div>
        </div>
        {isMobile && (
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 relative z-10 overflow-y-auto no-scrollbar pb-6">
        <p className={`text-label mb-3 px-3 ${isMobile ? 'block' : 'hidden xl:block'} sticky top-0 bg-[#0d1117] py-2 z-20`}>Main Menu</p>
        
        {menuItems.map(item => {
          const isActive = pathname === item.path;
          return (
            <div 
              key={item.id}
              onClick={() => {
                router.push(item.path);
                if (isMobile) setIsSidebarOpen(false);
              }}
              className={`flex items-center justify-center xl:justify-start gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden
              ${isActive 
                ? 'bg-blue-600/10 text-blue-500 ring-1 ring-blue-500/20' 
                : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full my-3"></div>
              )}
              <span className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'group-hover:scale-110 group-hover:text-blue-400'}`}>
                {item.icon}
              </span>
              <span className={`font-bold text-sm tracking-tight ${isMobile ? 'block' : 'hidden xl:block'}`}>{item.label}</span>
              
              {isActive && (
                <ChevronRight size={14} className={`ml-auto ${isMobile ? 'block' : 'hidden xl:block'} opacity-40`} />
              )}
            </div>
          );
        })}

        {!isAdmin && (
          <div className="pt-6">
            <p className={`text-label mb-3 px-3 ${isMobile ? 'block' : 'hidden xl:block'}`}>Capital Management</p>
            <div className={`flex ${isMobile || 'xl:flex' ? 'flex-col gap-2' : 'flex-col items-center gap-2'}`}>
               <div 
                 onClick={() => {
                   router.push('/wallet/deposit');
                   if (isMobile) setIsSidebarOpen(false);
                 }}
                 className="flex items-center justify-center xl:justify-start gap-3 px-4 py-3.5 rounded-[1.25rem] bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group border border-blue-500/20 hover:border-transparent"
               >
                 <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500 shrink-0" />
                 <span className={`font-black text-[10px] uppercase tracking-widest ${isMobile ? 'block' : 'hidden xl:block'}`}>Deposit Funds</span>
               </div>
               <div 
                 onClick={() => {
                   router.push('/wallet/withdraw');
                   if (isMobile) setIsSidebarOpen(false);
                 }}
                 className="flex items-center justify-center xl:justify-start gap-3 px-4 py-3.5 rounded-[1.25rem] bg-white/[0.02] text-gray-400 hover:bg-white/[0.05] hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group border border-white/[0.05]"
               >
                 <ArrowRightLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-500 shrink-0" />
                 <span className={`font-black text-[10px] uppercase tracking-widest ${isMobile ? 'block' : 'hidden xl:block'}`}>Withdraw Funds</span>
               </div>
            </div>
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-white/5 space-y-1">
           {pwaPrompt && (
             <div 
               onClick={() => {
                 installPwa();
                 if (isMobile) setIsSidebarOpen(false);
               }}
               className="flex items-center justify-center xl:justify-start gap-3.5 px-4 py-3.5 rounded-2xl text-blue-500 hover:text-white hover:bg-blue-600/10 border border-blue-500/10 transition-all group cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.05)]"
             >
                <Monitor size={20} className="group-hover:scale-110 transition-transform duration-300" />
                <span className={`font-bold text-sm tracking-tight ${isMobile ? 'block' : 'hidden xl:block'}`}>Install Terminal</span>
             </div>
           )}
           <div onClick={() => router.push('/')} className="flex items-center justify-center xl:justify-start gap-3.5 px-4 py-3.5 rounded-2xl text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all group cursor-pointer">
              <Home size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span className={`font-bold text-sm tracking-tight ${isMobile ? 'block' : 'hidden xl:block'}`}>Back to Landing</span>
           </div>
        </div>
      </nav>

      {/* User Footer Section */}
      <div className="mt-auto space-y-3 pt-4 border-t border-white/5 pb-[max(2rem,env(safe-area-inset-bottom))] px-4 relative z-30 bg-[#0d1117] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-center xl:justify-start gap-4 px-2 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 border border-white/10 flex items-center justify-center text-white font-black shrink-0 shadow-lg uppercase overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs tracking-tighter">
                {(() => {
                  const name = profile?.full_name || user?.user_metadata?.full_name || 'Trader';
                  if (!name || name === 'Trader') return 'TR';
                  const parts = name.trim().split(/\s+/);
                  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
                  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                })()}
              </span>
            )}
          </div>
          <div className={`${isMobile ? 'block' : 'hidden xl:block'} min-w-0`}>
            <p className="text-sm font-black text-white truncate leading-tight">{profile?.full_name || user?.user_metadata?.full_name || (isAdmin ? 'Platform Admin' : 'Trader')}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest truncate">{isAdmin ? 'Admin' : 'Pro Account'}</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center xl:justify-start gap-3.5 px-4 py-3.5 text-gray-500 hover:text-rose-500 transition-all rounded-2xl hover:bg-rose-500/5 group relative z-50"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className={`font-bold text-sm tracking-tight ${isMobile ? 'block' : 'hidden xl:block'}`}>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsSidebarOpen(prev => !prev);
    
    window.addEventListener('toggleSidebar', handleToggle);
    
    return () => {
      window.removeEventListener('toggleSidebar', handleToggle);
    };
  }, []);

  const isAdmin = user?.email?.includes('admin'); 
  
  const pwaPrompt = useStore(state => state.pwaPrompt);
  const installPwa = useStore(state => state.installPwa);

  const commonProps = {
    router,
    pathname,
    user,
    profile,
    signOut,
    setIsSidebarOpen,
    isAdmin,
    pwaPrompt,
    installPwa
  };

  return (
    <>
      <aside id="desktop-sidebar" className="hidden lg:flex w-20 xl:w-72 flex-col h-screen sticky top-0 transition-all duration-300 z-50">
        <SidebarContent {...commonProps} isMobile={false} />
      </aside>

      <aside id="mobile-sidebar" className={`lg:hidden fixed top-0 left-0 z-[100] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) w-[85vw] max-w-[320px] h-[100dvh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]`}>
        <SidebarContent {...commonProps} isMobile={true} />
      </aside>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-md lg:hidden animate-in fade-in duration-500" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
