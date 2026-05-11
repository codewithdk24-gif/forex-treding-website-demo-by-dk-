'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Menu, 
  ChevronLeft, 
  Wallet as WalletIcon, 
  Circle, 
  LayoutDashboard,
  BarChart3,
  History,
  Wallet,
  User
} from 'lucide-react';

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, wallet } = useAuth();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return 'Trading Terminal';
    if (pathname.includes('/wallet')) return 'Financial Hub';
    if (pathname.includes('/orders')) return 'Execution Log';
    if (pathname.includes('/markets')) return 'Asset Markets';
    if (pathname.includes('/admin')) return 'Admin Control';
    return 'ForexPro';
  };

  const getPageIcon = () => {
    if (pathname.includes('/dashboard')) return <LayoutDashboard size={18} />;
    if (pathname.includes('/wallet')) return <Wallet size={18} />;
    if (pathname.includes('/orders')) return <History size={18} />;
    if (pathname.includes('/markets')) return <BarChart3 size={18} />;
    return null;
  };

  return (
    <nav className="h-20 border-b border-white/[0.06] flex items-center justify-between px-6 md:px-10 shrink-0 bg-[#0d1117]/80 backdrop-blur-xl z-50 w-full sticky top-0">
      <div className="flex items-center gap-3 md:gap-4">
         {/* Mobile Menu Toggle */}
         <button 
           onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))} 
           className="lg:hidden p-2.5 -ml-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-gray-400 hover:text-white transition-all active:scale-95"
         >
            <Menu size={20} />
         </button>

         {/* Back Button (Desktop mostly, or mobile subpages) */}
         <button 
           onClick={() => router.back()} 
           className="p-2.5 -ml-1 rounded-xl bg-white/[0.03] border border-white/[0.05] text-gray-400 hover:text-white transition-all active:scale-95 hidden sm:flex"
         >
            <ChevronLeft size={20} />
         </button>

         <div className="flex items-center gap-4 ml-1">
            <div className="hidden xs:flex w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-blue-600/10 to-blue-500/5 border border-blue-500/20 items-center justify-center text-blue-500 shrink-0 shadow-inner">
              {getPageIcon() || <div className="font-black text-xs">FX</div>}
            </div>
            <div className="min-w-0 space-y-0.5">
               <div className="flex items-center gap-2">
                  <h3 className="text-heading-3 text-white truncate flex items-center gap-2">
                    {getPageTitle()}
                    {pathname.includes('/dashboard') && (
                      <span className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                         <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Market Open</span>
                      </span>
                    )}
                  </h3>
               </div>
               <p className="text-subtitle hidden sm:block">Institutional Node v2.4</p>
            </div>
         </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8">
         {/* Wallet Summary */}
         <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-[1.25rem] bg-white/[0.02] border border-white/[0.05]">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
              <WalletIcon size={18} />
            </div>
            <div className="text-right">
               <p className="text-value text-white tabular-nums leading-none">
                 {formatCurrency(wallet?.balance)}
               </p>
               <p className="text-label mt-1 leading-none">Available Balance</p>
            </div>
         </div>
         
         {/* User Profile Summary */}
         <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-right hidden xl:block">
               <p className="text-xs font-black text-white group-hover:text-blue-400 transition-colors">
                 {profile?.full_name || user?.user_metadata?.full_name || 'Active Trader'}
               </p>
               <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-0.5">
                 {profile?.role || 'Institutional'}
               </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-[1px] shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20 transition-all active:scale-95">
               <div className="w-full h-full rounded-[11px] bg-[#0d1117] flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-black text-blue-500 uppercase">
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
            </div>
         </div>
      </div>
    </nav>
  );
}
