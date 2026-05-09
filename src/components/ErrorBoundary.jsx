'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CRITICAL UI ERROR:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-[#0d0f14] p-8">
          <div className="max-w-md w-full bg-[#131722] border border-white/5 p-12 rounded-[2.5rem] text-center space-y-6 animate-fade-in">
             <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="text-red-500" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             </div>
             <h2 className="text-2xl font-black text-white uppercase tracking-tight">System Anomaly</h2>
             <p className="text-sm text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
               The terminal encountered an unexpected state. All funds remain secure.
             </p>
             <button 
               onClick={() => window.location.reload()}
               className="w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
             >
               Reboot Terminal
             </button>
             {process.env.NODE_ENV === 'development' && (
               <div className="mt-6 p-4 bg-black/40 rounded-xl text-left overflow-auto max-h-40">
                  <pre className="text-[10px] text-red-400 font-mono">{this.state.error?.toString()}</pre>
               </div>
             )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
