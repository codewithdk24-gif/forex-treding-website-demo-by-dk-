'use client';

import Sidebar from '../../components/Sidebar';
import TradeNotification from '../../components/TradeNotification';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#0f1115] overflow-hidden relative">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content FULL WIDTH */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto no-scrollbar">
          {children}
        </main>
      </div>

      {/* GLOBAL LAYER: Trade Notifications */}
      <TradeNotification />

    </div>
  );
}
