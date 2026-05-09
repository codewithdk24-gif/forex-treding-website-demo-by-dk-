'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';

// Use dynamic import for the main dashboard content to prevent hydration issues with the terminal logic
const DashboardContent = dynamic(
  () => import('../vanillaPages/DashboardPage'),
  { ssr: false }
);

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#0d1117] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-hidden relative">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}
