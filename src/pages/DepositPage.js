'use client';

import React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import DepositContent from '../vanillaPages/DepositPage';

export default function DepositPage() {
  return (
    <div className="flex h-screen bg-[#0d1117] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <DepositContent />
        </main>
      </div>
    </div>
  );
}
