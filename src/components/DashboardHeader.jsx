'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, wallet } = useAuth();

  // Helper to format currency
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
    return 'ForexPro';
  };

  return (
    <nav className="h-14 md:h-16 border-b border-white/[0.05] flex items-center justify-between px-4 md:px-6 shrink-0 bg-[#0f1115]/80 backdrop-blur-md z-50 w-full">
      <div className="flex items-center gap-4">
         {/* Mobile Menu Toggle */}
         <button 
           onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))} 
           className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
         >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
         </button>

         {/* Back Button (Desktop mostly, or mobile subpages) */}
         <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors hidden sm:block">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
         </button>

         <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white hidden xs:flex">FX</div>
            <div className="min-w-0">
               <div className="flex items-center gap-1.5 md:gap-2">
                  <h3 className="font-black text-[11px] xs:text-sm tracking-tight text-white uppercase truncate">{getPageTitle()}</h3>
                  {pathname.includes('/dashboard') && (
                    <div className="flex items-center gap-1 md:gap-1.5 bg-red-500/10 px-1 md:px-1.5 py-0.5 rounded shrink-0">
                       <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                       <span className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest">Live</span>
                    </div>
                  )}
               </div>
               <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden sm:block">Institutional Terminal v2.4</p>
            </div>
         </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
         <div className="text-right">
            <p className="text-sm md:text-base font-black tracking-tight text-white tabular-nums">
              {formatCurrency(wallet?.balance)}
            </p>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none">Demo Equity</p>
         </div>
         
         <div className="w-px h-8 bg-white/5 hidden md:block"></div>

         {/* User Profile Summary */}
         <div className="flex items-center gap-3">
            <div className="text-right hidden xl:block">
               <p className="text-xs font-black text-white truncate max-w-[120px]">
                 {profile?.full_name || user?.user_metadata?.full_name || 'Active Trader'}
               </p>
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                 {profile?.role || 'Institutional'}
               </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
               {profile?.avatar_url ? (
                 <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-blue-500 font-black text-xs uppercase">{user?.email?.[0] || 'T'}</span>
               )}
            </div>
         </div>
      </div>
    </nav>
  );
}
