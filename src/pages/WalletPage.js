'use client';

import React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import { WalletPage as WalletContent } from '../vanillaPages/WalletPage';

export default function WalletPage() {
  return (
    <div className="flex h-screen bg-[#0d1117] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <WalletContent />
        </main>
      </div>
    </div>
  );
}
