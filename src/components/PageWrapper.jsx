'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

export default function PageWrapper({ pageFn, pageName }) {
  const [html, setHtml] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    // Set current route for hash checks in original files
    window.currentRoute = pathname;

    // Intercept AuthPage overriding document.getElementById('app')
    if (pageName === 'auth' || pageName === 'admin-login') {
      window.toggleAuthMode = (mode) => {
        window.authMode = mode;
        setHtml(pageFn());
      };
    }

    setHtml(pageFn());

    // Trigger pageLoaded event like main.js did, give a short delay for DOM to render
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('pageLoaded', { detail: { page: pageName } }));
    }, 50);

  }, [pageFn, pageName, pathname]);

  if (!html) return null;

  return (
    <div className="flex h-screen bg-[#0f1115] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div dangerouslySetInnerHTML={{ __html: html }} className="h-full w-full" />
        </main>
      </div>
    </div>
  );
}
