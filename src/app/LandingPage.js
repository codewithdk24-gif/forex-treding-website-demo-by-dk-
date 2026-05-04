'use client';

import React, { useState, useEffect } from 'react';

const Icons = {
  lightning: <svg className="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  shield: <svg className="icon-glow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  chart: <svg className="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  globe: <svg className="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  menu: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: <svg className="text-green-500" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  cpu: <svg className="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqId, setOpenFaqId] = useState(0);
  const [priceData, setPriceData] = useState({ bid: '1.08240', ask: '1.08252', color: 'text-white' });

  useEffect(() => {
    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0 });
    
    document.querySelectorAll('.reveal').forEach(el => {
      // Force immediate check or just observe
      observer.observe(el);
    });


    // Live Hero Data Simulation
    const interval = setInterval(() => {
      const base = 1.08240;
      const rand = (Math.random() * 0.00050);
      const bid = (base + rand).toFixed(5);
      const ask = (base + rand + 0.00012).toFixed(5);
      const colorClass = Math.random() > 0.5 ? 'text-green-500' : 'text-red-500';
      
      setPriceData({ bid, ask, color: colorClass });
    }, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const toggleLandingMenu = (isOpen) => {
    setIsMenuOpen(isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white transition-all duration-300 overflow-x-hidden selection:bg-blue-500/20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f1115]/80 backdrop-blur-md border-b border-white/[0.03] h-16 md:h-20 flex items-center justify-between px-6 lg:px-20">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/10">FX</div>
          <span className="text-xl md:text-2xl font-black tracking-tight">Forex<span className="text-blue-500">Pro</span></span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          <a href="#markets-page" className="text-xs font-bold tracking-widest text-gray-400 hover:text-white transition-all uppercase">Markets</a>
          <a href="#orders-page" className="text-xs font-bold tracking-widest text-gray-400 hover:text-white transition-all uppercase">Execution</a>
          <a href="#pricing-section" className="text-xs font-bold tracking-widest text-gray-400 hover:text-white transition-all uppercase">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="/auth" className="btn-primary py-1.5 px-4 text-xs md:text-xs font-black uppercase tracking-widest rounded-lg h-8 md:h-10 w-auto flex items-center justify-center">Join Now</a>

          <button onClick={() => toggleLandingMenu(true)} className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
            {Icons.menu}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[100] bg-[#0f1115]/95 backdrop-blur-xl transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-500 p-8 flex flex-col justify-between`}>
        <div>
           <div className="flex justify-between items-center mb-12">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/10">FX</div>
              <button onClick={() => toggleLandingMenu(false)} className="p-2 text-gray-500 hover:text-white">
                {Icons.close}
              </button>
           </div>
           <div className="flex flex-col gap-6 text-xl font-black tracking-tighter uppercase">
             <a href="#markets-page" onClick={() => toggleLandingMenu(false)} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between group">
                <span>Markets</span>
                <span className="text-blue-500 text-sm group-hover:translate-x-1 transition-transform">→</span>
             </a>
             <a href="#orders-page" onClick={() => toggleLandingMenu(false)} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between group">
                <span>Execution</span>
                <span className="text-blue-500 text-sm group-hover:translate-x-1 transition-transform">→</span>
             </a>
             <a href="#pricing-section" onClick={() => toggleLandingMenu(false)} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between group">
                <span>Infrastructure</span>
                <span className="text-blue-500 text-sm group-hover:translate-x-1 transition-transform">→</span>
             </a>
           </div>
        </div>
        <div className="space-y-4">
           <a href="/auth" onClick={() => toggleLandingMenu(false)} className="btn-primary w-full py-4 text-center text-xs font-black uppercase tracking-widest rounded-2xl inline-block">Join Now</a>
           <p className="text-xs text-gray-500 text-center uppercase tracking-widest italic">Institutional Grade Terminal Node v2.4</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section relative flex items-center justify-center pt-32 pb-20 px-6 overflow-visible min-h-[70vh]">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10 opacity-30"></div>

        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 md:gap-20 relative z-20" style={{ outline: '1px solid rgba(255,255,255,0.05)' }}>

          <div className="flex-1 text-center lg:text-left space-y-8 md:space-y-12">
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 md:gap-6 opacity-60">
               <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-black uppercase tracking-widest text-white">0.01% Slippage</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-black uppercase tracking-widest text-white">0.4ms Execution</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-black uppercase tracking-widest text-white">99.99% Uptime</span>
               </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl md:text-8xl font-black tracking-tighter leading-[0.95] text-white uppercase">
                Trade with <br /> <span className="text-blue-500">Institutional</span> <br className="hidden lg:block" /> Edge.
              </h1>
              <p className="text-sm md:text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                High-fidelity trading infrastructure for global institutional players.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a href="/auth" className="btn-primary w-full sm:w-auto px-8 py-3.5 text-xs font-black uppercase tracking-widest rounded-xl">Join Now</a>
              <a href="/dashboard" className="w-full sm:w-auto px-8 py-3.5 text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest rounded-xl border border-white/5 hover:bg-white/5 transition-all">Explore Demo</a>
            </div>

            {/* Mobile Mini Terminal */}
            <div className="lg:hidden w-full max-w-sm mx-auto mt-12 pt-4 reveal" style={{transitionDelay: '0.3s'}}>
               <div className="glass-card p-6 rounded-[2rem] border border-white/5 shadow-2xl shadow-blue-600/5 relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-xs font-black text-white uppercase tracking-widest">EUR / USD</p>
                     </div>
                     <p className="text-xs font-black text-green-500 uppercase tracking-widest">+1.42%</p>
                  </div>
                  <div className="flex justify-between items-end mb-4">
                     <p className="text-3xl font-black text-white tracking-tighter">{priceData.bid}</p>
                     <div className="h-8 w-24 relative">
                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                           <path d="M0,30 Q25,25 50,35 T100,10" stroke="#3b82f6" strokeWidth="2" fill="none" className="animate-pulse"></path>
                        </svg>
                     </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center opacity-40">
                     <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Spread: 0.2 Pips</p>
                     <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Latency: 0.4ms</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Desktop Terminal Preview */}
          <div className="flex-1 w-full max-w-2xl relative hidden lg:block perspective-2000">
             <div className="glass-card rounded-[2.5rem] p-10 border border-white/10 shadow-2xl shadow-blue-600/5 rotate-3d hover:rotate-0 transition-all duration-700">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">FX</div>
                      <span className="text-xs font-black uppercase tracking-widest text-white">Institutional Node v2.4</span>
                   </div>
                   <div className="px-3 py-1 bg-green-500/10 rounded-full flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-xs font-black text-green-500 uppercase tracking-widest">Live Execution</span>
                   </div>
                </div>
                
                <div className="space-y-8">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">EUR / USD</p>
                         <p className={`text-5xl font-black tracking-tighter transition-colors duration-300 ${priceData.color}`}>{priceData.bid}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-black text-green-500 uppercase tracking-widest">+1.42%</p>
                         <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Spread: 0.2 Pips</p>
                      </div>
                   </div>
                   
                   <div className="h-32 w-full bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center justify-center relative overflow-hidden">
                      <svg className="w-full h-full px-4" viewBox="0 0 400 100" preserveAspectRatio="none">
                         <path d="M0,80 Q50,70 100,85 T200,60 T300,75 T400,50" stroke="#3b82f6" strokeWidth="3" fill="none" className="animate-pulse"></path>
                      </svg>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Institutional Market Feed */}
      <section className="lg:hidden border-t border-white/5 py-12 px-6">
         <div className="space-y-6">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] text-center">Institutional Feed</p>
            <div className="flex justify-between items-center px-4">
                <div className="space-y-1">
                   <p className="text-xs font-black text-white uppercase tracking-widest">EUR / USD</p>
                   <p className="text-xs font-black text-green-500 animate-pulse">{priceData.bid}</p>
                </div>
                <div className="space-y-1 text-center">
                   <p className="text-xs font-black text-white uppercase tracking-widest">GBP / USD</p>
                   <p className="text-xs font-black text-blue-500 animate-pulse">1.26410</p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-xs font-black text-white uppercase tracking-widest">USD / JPY</p>
                   <p className="text-xs font-black text-red-500 animate-pulse">150.42</p>
                </div>
             </div>
         </div>
      </section>

      {/* Stats Section */}
      <section id="markets-page" className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10 overflow-visible min-h-fit" style={{ outline: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="glass-card rounded-[2rem] p-1 shadow-2xl shadow-blue-600/5">
           <div className="flex flex-col md:flex-row justify-between items-center bg-[#0f1115]/40 rounded-[1.9rem] divide-y md:divide-y-0 md:divide-x divide-white/[0.03]">
              {[
                { label: 'Active Traders', value: '50K+', sub: 'Verified Est.' },
                { label: 'Monthly Volume', value: '$2.4B+', sub: 'Institutional Est.' },
                { label: 'System Uptime', value: '99.99%', sub: 'Global Node' },
                { label: 'Latency Speed', value: '0.4ms', sub: 'Est. Execution' }
              ].map((stat, i) => (
                <div key={i} className="w-full md:px-10 py-8 md:py-10 text-center space-y-1.5 hover:bg-white/[0.01] transition-colors group">
                  <p className="text-xs font-bold text-blue-500/80 uppercase tracking-[0.2em] group-hover:translate-y-[-2px] transition-transform">{stat.label}</p>
                  <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.sub}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="orders-page" className="max-w-7xl mx-auto px-6 py-20 relative z-10 overflow-visible min-h-fit" style={{ outline: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-2xl md:text-5xl font-black tracking-tight text-white uppercase">Trusted <span className="text-blue-500">Infrastructure.</span></h2>
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">Institutional Grade Reliability</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           {[
             { title: 'Regulated', desc: 'Demo node compliance.', icon: Icons.shield },
             { title: 'Security', desc: 'AES-256 encryption.', icon: Icons.lightning },
             { title: 'Monitoring', desc: '24/7 health checks.', icon: Icons.cpu },
             { title: 'Liquidity', desc: 'Multi-bank pools.', icon: Icons.globe }
           ].map((item, i) => (
             <div key={i} className="glass-card p-5 rounded-2xl border border-white/[0.03] flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 bg-blue-600/5 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                   {item.icon}
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest">{item.title}</h3>
                <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-container py-32 px-6 max-w-3xl mx-auto space-y-12 relative z-10 overflow-visible min-h-fit" style={{ outline: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter">Inquiries.</h2>
        </div>
        <div className="space-y-4">
          {[
            { q: 'Is this platform secure?', a: 'Institutional-grade multi-signature storage and end-to-end AES-256 encryption for all assets.' },
            { q: 'How fast is execution?', a: 'Average execution speed is sub-1.2ms through our optimized L4 liquidity nodes.' },
            { q: 'Is it beginner friendly?', a: 'Precision-engineered interface designed for evolving professional traders.' }
          ].map((faq, i) => (
            <div key={i} className={`faq-card glass-card rounded-2xl overflow-hidden border ${openFaqId === i ? 'border-blue-500/30' : 'border-white/[0.03]'} transition-all duration-300`}>
              <button onClick={() => setOpenFaqId(openFaqId === i ? -1 : i)} className="w-full min-h-[48px] p-6 text-left flex justify-between items-center hover:bg-white/[0.01] transition-colors focus:outline-none">
                <span className="text-xs font-black text-white uppercase tracking-widest transition-colors">{faq.q}</span>
                <span className={`transition-transform duration-300 text-blue-500 text-xs ${openFaqId === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openFaqId === i && (
                <div className="px-6 pb-6 text-xs text-gray-400 leading-relaxed font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.03] px-6 py-12 bg-[#0b0d11]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-black text-xs">FX</div>
                <span className="text-lg font-black tracking-tight text-white uppercase">Forex<span className="text-blue-500">Pro</span></span>
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider leading-relaxed">Institutional trading terminal infrastructure.</p>
            </div>
            <p className="text-xs text-gray-800 font-bold uppercase tracking-widest italic">Trading involves risk. Simulated environment.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
