'use client';
import React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import { MarketsPage as MarketsContent } from '../vanillaPages/MarketsPage';

export default function MarketsPage() {
  return (
    <div className="flex h-screen bg-[#0f1115] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <MarketsContent />
        </main>
      </div>
    </div>
  );
}
