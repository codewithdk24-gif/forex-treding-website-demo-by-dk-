'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap,
  Shield, 
  BarChart3, 
  Globe, 
  Menu, 
  X, 
  CheckCircle2, 
  Cpu, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  ArrowRight,
  Lock,
  Activity,
  Gem,
  Phone,
  Mail
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqId, setOpenFaqId] = useState(0);
  const [openFeatureId, setOpenFeatureId] = useState(null);
  const [priceData, setPriceData] = useState({ bid: '1.08240', ask: '1.08252', color: 'text-white' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const interval = setInterval(() => {
      const base = 1.08240;
      const rand = Math.random() * 0.00050;
      const bid = (base + rand).toFixed(5);
      const ask = (base + rand + 0.00012).toFixed(5);
      const color = Math.random() > 0.5 ? 'text-emerald-500 animate-flash-green-soft' : 'text-rose-500 animate-flash-red-soft';
      setPriceData({ bid, ask, color });
    }, 1500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const toggleMenu = (open) => {
    setIsMenuOpen(open);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = open ? 'hidden' : 'auto';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white transition-all duration-300 overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-500 font-sans">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#0d1117]/70 backdrop-blur-3xl h-14 md:h-16 lg:h-20 flex items-center justify-between px-4 md:px-6 lg:px-20">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"></div>
        <button
          onClick={() => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 md:gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-600 rounded-[10px] md:rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform ring-1 ring-white/10 text-sm md:text-base">FX</div>
          <span className="text-lg md:text-xl lg:text-2xl font-black tracking-tight uppercase">Forex<span className="text-blue-500">Pro</span></span>
        </button>

        <div className="hidden lg:flex items-center gap-10">
          {['Markets', 'Execution', 'Security', 'Compliance'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black tracking-[0.2em] text-gray-500 hover:text-white transition-all uppercase">{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/auth" className="hidden sm:flex px-6 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all">
            Login
          </Link>
          <Link href="/auth" className="px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl bg-blue-600 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all ring-1 ring-white/10 whitespace-nowrap">
            Open Account
          </Link>
          <button onClick={() => toggleMenu(true)} className="lg:hidden p-1.5 md:p-2 text-gray-400 hover:text-white transition-colors">
            <Menu size={22} className="md:w-6 md:h-6" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <div className={`fixed inset-0 z-[100] bg-[#0d1117]/98 backdrop-blur-3xl transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-500 p-8 flex flex-col justify-between overflow-hidden`}>
        {/* Cinematic Orb inside Menu */}
        <div className="absolute top-[10%] right-[-20%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-10 sm:mb-16">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20 ring-1 ring-white/10">FX</div>
            <button onClick={() => toggleMenu(false)} className="p-2.5 rounded-xl bg-white/[0.05] text-gray-500 hover:text-white"><X size={24} /></button>
          </div>
          <div className="flex flex-col gap-5">
            {['Markets', 'Execution', 'Pricing', 'Infrastructure'].map((label) => (
              <a key={label} href={`#${label.toLowerCase()}`} onClick={() => toggleMenu(false)} className="p-4 sm:p-6 bg-white/[0.03] border border-white/[0.05] rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-between group active:scale-95 transition-all">
                <span className="text-xl font-black uppercase tracking-tighter">{label}</span>
                <ChevronRight className="text-blue-500 group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <Link href="/auth" onClick={() => toggleMenu(false)} className="w-full py-5 bg-blue-600 text-center text-xs font-black uppercase tracking-[0.2em] rounded-[1.5rem] inline-block shadow-2xl shadow-blue-600/20 ring-1 ring-white/10">
            Start Trading Now
          </Link>
          <p className="text-[10px] text-gray-600 text-center font-medium tracking-[0.3em] italic opacity-40">ForexPro Terminal v2.4.8</p>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center pt-20 lg:pt-[120px] pb-12 lg:pb-20 px-4 md:px-6 overflow-hidden">
        {/* Dynamic Background Elements - Cinematic Atmosphere */}
        <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay z-0 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] z-0 pointer-events-none"></div>
        <div className="absolute -top-[5%] md:top-[10%] left-[5%] md:left-[20%] w-[250px] md:w-[800px] h-[250px] md:h-[800px] bg-blue-600/10 blur-[60px] md:blur-[160px] rounded-full -z-10 animate-glow-pulse-intense animate-drift pointer-events-none"></div>
        <div className="absolute bottom-[5%] md:bottom-[10%] right-[5%] md:right-[20%] w-[200px] md:w-[600px] h-[200px] md:h-[600px] bg-blue-400/5 blur-[50px] md:blur-[140px] rounded-full -z-10 animate-glow-pulse-intense animate-drift pointer-events-none" style={{ animationDelay: '2s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1117]/50 to-[#0d1117] pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-24 relative z-10 reveal">

          {/* Left Content */}
          <div className="flex-[0_0_auto] lg:w-[48%] xl:w-[46%] text-center lg:text-left space-y-6 md:space-y-8">

            {/* Institutional Trust Badge — Static, no hover scale */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full" style={{ animationDelay: '0.05s' }}>
              <div className="relative flex items-center justify-center w-3.5 h-3.5">
                <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-[ping_2.5s_ease-in-out_infinite]"></div>
                <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
              </div>
              <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Tier-1 Institutional Liquidity</span>
            </div>

            <div className="space-y-4 md:space-y-5">
              <h1 className="text-[clamp(1.75rem,7vw,5.5rem)] font-black tracking-[-0.03em] leading-[0.92] uppercase flex flex-col gap-0.5 md:gap-1 break-words">
                <span className="animate-fade-in-up text-white/85" style={{ animationDelay: '0.1s', animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>Trade With</span>
                <span className="animate-fade-in-up text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-400" style={{ animationDelay: '0.2s', animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>Institutional</span>
                <span className="animate-fade-in-up text-white/85" style={{ animationDelay: '0.3s', animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>Edge.</span>
              </h1>
              <p className="text-sm md:text-[15px] text-gray-400 max-w-md mx-auto lg:mx-0 leading-relaxed font-normal tracking-normal opacity-75 animate-fade-in-up" style={{ animationDelay: '0.4s', animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
                Precision-engineered trading infrastructure for institutional players and professional traders.
              </p>
            </div>

            <div className="flex flex-row items-center justify-center lg:justify-start gap-3 w-full px-2 sm:px-0">
              <Link href="/auth" className="flex-1 sm:flex-none sm:w-auto px-5 sm:px-8 md:px-9 py-3 sm:py-3.5 md:py-4 bg-blue-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:shadow-[0_0_50px_rgba(59,130,246,0.45)] hover:bg-blue-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ring-1 ring-white/15 flex items-center justify-center gap-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                Begin Execution
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
              <Link href="/dashboard" className="flex-1 sm:flex-none sm:w-auto px-5 sm:px-8 md:px-9 py-3 sm:py-3.5 md:py-4 bg-white/[0.03] border border-white/[0.07] text-[9px] sm:text-[10px] font-semibold text-gray-400 hover:text-white uppercase tracking-[0.18em] rounded-xl hover:bg-white/[0.06] hover:-translate-y-0.5 hover:border-white/[0.12] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group">
                View Terminal
                <Activity size={13} className="text-gray-600 group-hover:text-blue-400 transition-colors duration-200" />
              </Link>
            </div>

            {/* Desktop Infrastructure Row */}
            <div className="hidden lg:flex items-center gap-8 pt-2 opacity-20">
               {['Tier-1 Liquidity', 'ECN Network', 'Global Nodes', 'STP Engine'].map((node, idx) => (
                 <span key={node} className="text-[9px] font-medium uppercase tracking-[0.35em] text-gray-500" style={{ animationDelay: `${0.5 + idx * 0.1}s` }}>{node}</span>
               ))}
            </div>
          </div>

          {/* Right — Visual Asset Card */}
          <div className="flex-[0_0_auto] lg:w-[48%] xl:w-[50%] w-full flex justify-center lg:justify-end reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="w-full max-w-[400px] sm:max-w-[440px] md:max-w-[480px] lg:max-w-[520px] glassmorphism-premium glass-edge-light p-4 sm:p-6 md:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] group hover-cinematic-lift perspective-2000 preserve-3d relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:shadow-[0_20px_80px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.05]">
              {/* Internal Glass Reflections & Glows */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-transparent z-0 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-blue-500/10 blur-[50px] md:blur-[80px] rounded-full z-0 pointer-events-none group-hover:bg-blue-500/20 transition-all duration-1000"></div>
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 z-10 pointer-events-none"></div>

              {/* Card header */}
              <div className="flex justify-between items-center mb-6 md:mb-10 relative z-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 md:w-14 h-10 md:h-14 rounded-[12px] md:rounded-2xl bg-[#0f1219] border border-white/[0.08] flex items-center justify-center text-blue-500 shadow-[inset_0_1px_5px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.4)] group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all duration-500">
                    <Globe size={18} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base md:text-xl tracking-tight drop-shadow-md">EUR / USD</h3>
                    <p className="text-[7px] md:text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-0.5 md:mt-1">Euro / US Dollar</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-[#0f1219] border border-white/[0.05] rounded-full shadow-inner">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-500"></div>
                      </div>
                      <span className="text-[7px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Live Node</span>
                   </div>
                </div>
              </div>

              {/* Price Content */}
              <div className="mb-6 md:mb-10 relative z-10">
                <div className="flex items-end gap-2 md:gap-3 mb-1.5 md:mb-2">
                   <p className={`text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors duration-300 ${mounted ? priceData.color : 'text-white'}`} key={priceData.bid}>
                    {mounted ? priceData.bid : '1.08240'}
                   </p>
                   <div className="pb-1.5 md:pb-3 flex items-center gap-1.5 md:gap-2">
                      <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-emerald-500/10 flex items-center justify-center animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                        <TrendingUp size={12} className="text-emerald-500 md:w-4 md:h-4" />
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 pt-2 md:pt-3">
                  <div className="flex flex-col gap-0.5 md:gap-1">
                     <span className="text-[7px] md:text-[9px] font-black text-gray-600 uppercase tracking-widest">Ask</span>
                     <p className="text-[10px] sm:text-xs md:text-sm font-black text-gray-300 tabular-nums">{mounted ? priceData.ask : '1.08252'}</p>
                  </div>
                  <div className="w-px h-4 md:h-6 bg-white/[0.08]"></div>
                  <div className="flex flex-col gap-0.5 md:gap-1">
                     <span className="text-[7px] md:text-[9px] font-black text-gray-600 uppercase tracking-widest">Vol</span>
                     <p className="text-[10px] sm:text-xs md:text-sm font-black text-gray-300 tabular-nums">$42.8B</p>
                  </div>
                  <div className="w-px h-4 md:h-6 bg-white/[0.08]"></div>
                  <div className="flex flex-col gap-0.5 md:gap-1">
                     <span className="text-[7px] md:text-[9px] font-black text-emerald-500 uppercase tracking-widest">Perf</span>
                     <p className="text-[10px] sm:text-xs md:text-sm font-black text-emerald-500 tabular-nums drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">+1.42%</p>
                  </div>
                </div>
              </div>

              {/* Visual SVG Chart - Cinematic Motion */}
              <div className="h-20 sm:h-24 md:h-32 w-full bg-[#0d1117]/80 backdrop-blur-md border border-white/[0.05] rounded-2xl md:rounded-3xl relative overflow-hidden mb-6 md:mb-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group/chart">
                {/* Chart Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:2rem_2rem] [background-position:center_center] opacity-30"></div>
                
                {/* Scrolling Highlight */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.1)_50%,transparent_100%)] -translate-x-full group-hover/chart:animate-[shimmer_2s_infinite] pointer-events-none"></div>
                
                <svg className="w-full h-full px-2 relative z-10" viewBox="0 0 400 100" preserveAspectRatio="none">
                  {/* Glowing Line */}
                  <path d="M0,85 Q30,80 60,70 T120,50 T180,60 T240,40 T300,50 T360,30 L400,20" stroke="#3b82f6" strokeWidth="2.5" fill="none" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-draw-line" style={{ animationDuration: '3s', animationTimingFunction: 'ease-out', strokeDasharray: '1000', strokeDashoffset: '1000', animationFillMode: 'forwards' }}/>
                  {/* Subtle Secondary Line */}
                  <path d="M0,85 Q30,80 60,70 T120,50 T180,60 T240,40 T300,50 T360,30 L400,20" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" style={{ transform: 'translateY(4px)' }}/>
                  {/* Area Fill */}
                  <path d="M0,85 Q30,80 60,70 T120,50 T180,60 T240,40 T300,50 T360,30 L400,20 L400,100 L0,100 Z" fill="url(#blueGradHero)" opacity="0.15" className="animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'both' }}/>
                  <defs>
                    <linearGradient id="blueGradHero" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6"/>
                      <stop offset="100%" stopColor="transparent"/>
                    </linearGradient>
                  </defs>
                </svg>

                {/* Moving Pulse Dot on Line */}
                <div className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] top-[18px] right-[10px] z-20 animate-pulse opacity-0" style={{ animation: 'fadeIn 0.5s forwards 3s, pulse 2s infinite 3s' }}>
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-50"></div>
                </div>

                {/* Floating Price Tooltip */}
                <div className="absolute top-4 md:top-6 right-4 md:right-16 px-2 md:px-3 py-1 md:py-1.5 bg-[#0f1219]/90 backdrop-blur-md border border-white/[0.1] rounded-lg text-[8px] md:text-[9px] font-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.5)] animate-float z-20 uppercase tracking-widest text-blue-400 whitespace-nowrap">
                   STP Node Active
                </div>
              </div>

              {/* Spread & Meta Info */}
              <div className="grid grid-cols-3 gap-2 md:gap-4 relative z-10">
                {[
                  { label: 'Raw Spread', val: '0.1 Pips' },
                  { label: 'Latency', val: '0.38 ms' },
                  { label: 'Execution', val: 'DMA' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-2 md:p-4 bg-[#0f1219]/60 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/[0.03] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all cursor-default">
                    <p className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1 md:mb-1.5">{item.label}</p>
                    <p className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Glow Bridge ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="glow-bridge h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-50"></div>
      </div>

      {/* ── Key Metrics ── */}
      <section id="markets" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 lg:py-28 reveal">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Active Capital', value: '$4.2B+', sub: 'Institutional Pools', icon: <Gem size={20} className="text-blue-500" /> },
            { label: 'Execution Speed', value: '0.38ms', sub: 'Average Latency', icon: <Zap size={20} className="text-emerald-500" /> },
            { label: 'Uptime Reliability', value: '99.99%', sub: 'Global Node Network', icon: <Activity size={20} className="text-amber-500" /> },
            { label: 'Secured Assets', value: '100%', sub: 'Tier-1 Bank Custody', icon: <Lock size={20} className="text-gray-400" /> },
          ].map((stat, i) => (
            <div key={i} className="p-5 sm:p-6 md:p-8 glassmorphism-premium glass-edge-light rounded-[2rem] sm:rounded-[2.5rem] space-y-3 md:space-y-4 hover-cinematic-lift hover-inner-glow">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center cinematic-glow">
                {stat.icon}
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5 md:mb-2">{stat.label}</p>
                <p className="text-3xl md:text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 md:mt-1 opacity-70">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Glow Bridge ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="glow-bridge h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-50"></div>
      </div>

      {/* ── Features ── */}
      <section id="execution" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 lg:py-28 reveal">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-14 space-y-2 md:space-y-3">
          <p className="text-[9px] font-semibold text-blue-500/70 uppercase tracking-[0.45em]">Zero Compromise Infrastructure</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[0.95]">Built For<br/><span className="text-blue-400">The Professional.</span></h2>
        </div>

        {/* 2×3 Floating Feature Node Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {[
            { title: 'Deep Liquidity',    desc: 'Direct access to Tier-1 banks and ECN networks. Minimal slippage and superior fill rates at all volumes.',         icon: <Activity size={20} />,  color: 'blue'   },
            { title: 'Advanced Charting', desc: 'Full TradingView integration. 100+ indicators, drawing tools, and multi-timeframe analysis in one workspace.',      icon: <BarChart3 size={20} />, color: 'indigo' },
            { title: 'Secure Vault',      desc: 'Multi-signature cold storage, institutional AES-256 encryption, and fully segregated client accounts.',             icon: <Shield size={20} />,   color: 'emerald'},
            { title: 'Realtime Ticker',   desc: 'Sub-millisecond price feeds via our low-latency websocket network. 50+ global nodes. Zero data delay.',             icon: <Zap size={20} />,      color: 'amber'  },
            { title: 'Global Markets',    desc: 'Trade Forex, Crypto, Stocks, Indices, and Commodities from one unified institutional terminal.',                    icon: <Globe size={20} />,    color: 'blue'   },
            { title: 'Precision Logs',    desc: 'Granular execution reports, P&L analytics, and slippage tracking. Every trade documented with precision.',          icon: <Cpu size={20} />,      color: 'violet' },
          ].map((f, i) => {
            const isOpen = openFeatureId === i;
            const colorMap = {
              blue:   { ring: 'ring-blue-500/30',   iconActive: 'bg-blue-600',   iconIdle: 'bg-blue-500/10 text-blue-400   border-blue-500/20',  glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',  labelActive: 'text-blue-300'   },
              indigo: { ring: 'ring-indigo-500/30',  iconActive: 'bg-indigo-600', iconIdle: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]',  labelActive: 'text-indigo-300' },
              emerald:{ ring: 'ring-emerald-500/25', iconActive: 'bg-emerald-600',iconIdle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',glow:'shadow-[0_0_20px_rgba(16,185,129,0.12)]',  labelActive: 'text-emerald-300'},
              amber:  { ring: 'ring-amber-500/25',   iconActive: 'bg-amber-600',  iconIdle: 'bg-amber-500/10 text-amber-400   border-amber-500/20',  glow: 'shadow-[0_0_20px_rgba(245,158,11,0.12)]',  labelActive: 'text-amber-300'  },
              violet: { ring: 'ring-violet-500/25',  iconActive: 'bg-violet-600', iconIdle: 'bg-violet-500/10 text-violet-400 border-violet-500/20', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.12)]',  labelActive: 'text-violet-300' },
            };
            const c = colorMap[f.color] || colorMap.blue;
            return (
              <button
                key={i}
                onClick={() => setOpenFeatureId(isOpen ? null : i)}
                className={`relative text-left p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-[1.5rem] border overflow-hidden transition-all duration-350 w-full group
                  ${isOpen
                    ? `ring-1 ${c.ring} border-transparent bg-white/[0.04] ${c.glow}`
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10]'
                  }`}
                style={{ transition: 'all 0.32s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                {/* Atmospheric glow layer when active */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'} bg-gradient-to-br from-white/[0.02] to-transparent`}></div>

                {/* Node content — always visible */}
                <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
                  {/* Icon + Index row */}
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-[0.875rem] border flex items-center justify-center shrink-0 transition-all duration-300
                      ${isOpen ? `${c.iconActive} text-white border-transparent shadow-lg` : c.iconIdle}`}>
                      {f.icon}
                    </div>
                    {/* Subtle node index */}
                    <span className={`text-[9px] font-mono tracking-widest transition-colors duration-200 mt-0.5
                      ${isOpen ? 'text-white/20' : 'text-white/8'}`}>
                      0{i + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-[12px] sm:text-[13px] md:text-sm font-bold tracking-tight leading-snug transition-colors duration-200
                    ${isOpen ? c.labelActive : 'text-white/85'}`}>
                    {f.title}
                  </h3>

                  {/* Expanding description — inside the node */}
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: isOpen ? '140px' : '0px',
                      opacity: isOpen ? 1 : 0,
                      transition: 'max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease',
                    }}
                  >
                    <div className="border-t border-white/[0.05] pt-2.5">
                      <p className="text-[10px] sm:text-[11px] md:text-xs text-gray-400/80 leading-relaxed font-normal">{f.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom expand hint dot */}
                <div className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${isOpen ? `${c.iconActive} shadow-[0_0_6px_currentColor] scale-125` : 'bg-white/10'}`}></div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Glow Bridge ── */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="glow-bridge h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-50"></div>
      </div>

      {/* ── Inquiries / FAQ ── */}
      <section id="security" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-24 lg:py-32 reveal">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Questions.</h2>
          <div className="w-12 h-[2px] bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <div className="space-y-4">
          {[
            { q: 'Is my capital protected?', a: 'All funds are held in segregated institutional Tier-1 bank accounts and are fully protected by our multi-layered security protocols.' },
            { q: 'How do I start live trading?', a: 'After account verification and deposit, your live trading sub-account will be activated instantly via our global liquidity bridge.' },
            { q: 'What is the minimum execution size?', a: 'Our flexible lot sizing starts from 0.01 lots for precision risk management in institutional markets.' },
          ].map((faq, i) => (
            <div key={i} className={`glassmorphism-premium glass-edge-light rounded-[2rem] overflow-hidden ${openFaqId === i ? 'bg-blue-500/[0.02] border-blue-500/40 cinematic-glow' : ''} transition-all duration-700`}>
              <button
                onClick={() => setOpenFaqId(openFaqId === i ? -1 : i)}
                className="w-full p-5 sm:p-7 md:p-8 text-left flex justify-between items-center gap-4 focus:outline-none"
              >
                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-500 ${openFaqId === i ? 'rotate-180 bg-blue-600 text-white border-transparent' : 'text-blue-500'}`}>
                  <TrendingDown size={14} />
                </div>
              </button>
              <div className={`faq-content-cinematic ${openFaqId === i ? 'open' : ''}`}>
                <div className="px-5 sm:px-7 md:px-8 pb-5 sm:pb-7 md:pb-8">
                   <p className="text-xs text-gray-400 leading-relaxed tracking-wide border-t border-white/5 pt-4 md:pt-6">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24 md:pb-32 reveal">
        <div className="relative p-7 sm:p-10 md:p-16 lg:p-24 rounded-[2.5rem] md:rounded-[4rem] bg-rotating-gradient overflow-hidden text-center group shadow-[0_0_60px_rgba(59,130,246,0.12)] ring-1 ring-white/[0.08]">
          <div className="absolute inset-0 bg-[#0d1117]/50 backdrop-blur-3xl"></div>
          <div className="absolute -top-24 -right-24 w-80 h-80 md:w-96 md:h-96 bg-blue-500/15 rounded-full blur-[120px] animate-glow-pulse-intense"></div>
          
          <div className="relative z-10 space-y-5 md:space-y-6 mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95]">Institutional Access.<br/><span className="text-blue-400">No Limits.</span></h2>
            <p className="text-gray-400 text-sm md:text-base font-normal tracking-wide opacity-80 max-w-md mx-auto">Professional-grade liquidity infrastructure, available in under two minutes.</p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
             <Link href="/auth" className="w-full sm:w-auto px-7 md:px-12 py-4 md:py-5 bg-blue-600 text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] rounded-xl md:rounded-2xl hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 ring-1 ring-blue-400/30">
               Open Live Account
               <CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" />
             </Link>
             <Link href="/dashboard" className="w-full sm:w-auto px-7 md:px-12 py-4 md:py-5 bg-transparent border border-white/20 text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] rounded-xl md:rounded-2xl hover:bg-white/[0.06] hover:border-white/30 active:scale-95 transition-all duration-300 text-center">
               Try Demo Terminal
             </Link>
          </div>
        </div>
      </section>

      {/* ── Institutional Footer ── */}
      <footer className="bg-[#090c10] border-t border-white/[0.05] px-6 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12 md:gap-20 relative z-10">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/20">FX</div>
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase">Forex<span className="text-blue-500">Pro</span></span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-600 font-black uppercase tracking-widest leading-loose max-w-md opacity-60">Providing professional-grade liquidity and low-latency execution infrastructure for global financial markets since 2018.</p>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2 md:pt-4 opacity-40 grayscale pointer-events-none">
              <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-white">AWS</span>
              <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-white">Cloudflare</span>
              <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-white">Equinix</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:col-span-2 gap-8 lg:gap-20">
            <div className="space-y-6 md:space-y-8">
              <h4 className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.4em]">Infrastructure</h4>
              <ul className="space-y-4 text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest">
                 <li className="hover:text-blue-500 cursor-pointer transition-colors">Tier-1 Nodes</li>
                 <li className="hover:text-blue-500 cursor-pointer transition-colors">API Docs</li>
                 <li className="hover:text-blue-500 cursor-pointer transition-colors">Uptime Monitor</li>
              </ul>
            </div>

            <div className="space-y-6 md:space-y-8">
              <h4 className="text-[9px] md:text-[10px] font-semibold text-gray-400 uppercase tracking-[0.4em]">Legal & Compliance</h4>
              <ul className="space-y-4 text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest">
                 <li className="hover:text-blue-500 cursor-pointer transition-colors">Privacy Policy</li>
                 <li className="hover:text-blue-500 cursor-pointer transition-colors">Risk Disclosure</li>
                 <li className="hover:text-blue-500 cursor-pointer transition-colors">Compliance</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 md:mt-24 pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-center md:text-left">
           <p className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-[0.5em]">© 2024 Vantage Global Group Ltd. All Rights Reserved.</p>
           <div className="flex gap-4">
              {['X', 'In', 'Dc'].map(platform => (
                <div key={platform} className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-[10px] font-black text-gray-500 hover:text-white hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer">
                  {platform}
                </div>
              ))}
           </div>
        </div>
        {/* ── Developer Signature Block ── */}
        <div className="max-w-7xl mx-auto mt-10 md:mt-14 pb-2">
          <div className="flex justify-center">
            <div className="group inline-flex flex-col sm:flex-row items-center sm:items-stretch gap-0 bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-xl hover:border-white/[0.10] hover:bg-white/[0.035] transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.05)] max-w-full">
              
              {/* Left — Developer identity */}
              <div className="flex items-center gap-3 px-5 py-4 sm:pr-6 sm:border-r sm:border-white/[0.05]">
                {/* Avatar monogram */}
                <div className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-blue-400 tracking-tight">DK</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] font-semibold text-gray-600 uppercase tracking-[0.35em]">Developed By</span>
                  <span className="text-[13px] font-bold text-white/90 tracking-tight leading-none">Dinesh Kurre</span>
                </div>
              </div>

              {/* Divider on mobile */}
              <div className="sm:hidden w-full h-px bg-white/[0.05]"></div>

              {/* Right — Contact details */}
              <div className="flex flex-row sm:flex-col justify-center gap-3 sm:gap-0 px-5 py-3.5 sm:py-0 sm:px-5 sm:divide-y sm:divide-white/[0.04]">
                <a
                  href="tel:+917389090956"
                  className="flex items-center gap-2 sm:py-2.5 group/link"
                >
                  <Phone size={11} className="text-blue-500/60 shrink-0 group-hover/link:text-blue-400 transition-colors" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 tracking-wide group-hover/link:text-gray-300 transition-colors whitespace-nowrap">+91 73890 90956</span>
                </a>
                <a
                  href="mailto:codewithdk24@gmail.com"
                  className="flex items-center gap-2 sm:py-2.5 group/link"
                >
                  <Mail size={11} className="text-blue-500/60 shrink-0 group-hover/link:text-blue-400 transition-colors" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 tracking-wide group-hover/link:text-gray-300 transition-colors whitespace-nowrap">codewithdk24@gmail.com</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
