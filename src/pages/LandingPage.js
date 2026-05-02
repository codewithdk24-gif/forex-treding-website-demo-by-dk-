export const LandingPage = () => {
  const Icons = {
    lightning: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    shield: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    chart: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
    globe: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    check: `<svg class="text-green-500" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    cpu: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>`
  };
  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Live Hero Data Simulation
    const bidEl = document.getElementById('hero-bid-value');
    const askEl = document.getElementById('hero-ask-value');
    const priceEl = document.getElementById('hero-main-price');
    
    if (bidEl && askEl && priceEl) {
      setInterval(() => {
        const base = 1.08240;
        const rand = (Math.random() * 0.00050);
        const bid = (base + rand).toFixed(5);
        const ask = (base + rand + 0.00012).toFixed(5);
        bidEl.innerText = bid;
        askEl.innerText = ask;
        priceEl.innerText = bid;
        
        // Randomly pulse colors
        const colorClass = Math.random() > 0.5 ? 'text-green-500' : 'text-red-500';
        priceEl.className = `text-3xl font-black tracking-tighter transition-colors duration-300 ${colorClass}`;
      }, 1000);
    }
  }, 100);


  window.toggleLandingMenu = (isOpen) => {
    const menu = document.getElementById('landing-mobile-menu');
    if (isOpen) {
      menu?.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden';
    } else {
      menu?.classList.add('translate-x-full');
      document.body.style.overflow = 'auto';
    }
  };

  window.toggleFAQ = (id) => {
    const faq = document.getElementById(`faq-${id}`);
    const card = document.getElementById(`faq-card-${id}`);
    const icon = document.getElementById(`faq-icon-${id}`);
    const isShowing = faq.classList.contains('show');
    
    document.querySelectorAll('.faq-content').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.faq-icon').forEach(el => el.style.transform = 'rotate(0deg)');
    document.querySelectorAll('.faq-card').forEach(el => el.classList.remove('border-blue-500/30'));

    if (!isShowing) {
      faq.classList.add('show');
      icon.style.transform = 'rotate(180deg)';
      card.classList.add('border-blue-500/30');
    }
  };

  return `
    <div class="min-h-screen bg-[#0f1115] text-white transition-all duration-300 overflow-x-hidden selection:bg-blue-500/20">
      <!-- Navbar -->
      <nav class="fixed top-0 w-full z-50 bg-[#0f1115]/80 backdrop-blur-md border-b border-white/[0.03] h-16 md:h-20 flex items-center justify-between px-6 lg:px-20">
        <div class="flex items-center gap-2.5 cursor-pointer" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
          <div class="w-8 h-8 md:w-9 md:h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/10">FX</div>
          <span class="text-xl md:text-2xl font-black tracking-tight">Forex<span class="text-blue-500">Pro</span></span>
        </div>
        
        <div class="hidden lg:flex items-center gap-10">
          <a href="#markets-page" class="text-xs font-bold tracking-widest text-gray-400 hover:text-white transition-all uppercase">Markets</a>
          <a href="#orders-page" class="text-xs font-bold tracking-widest text-gray-400 hover:text-white transition-all uppercase">Execution</a>
          <a href="#pricing-section" class="text-xs font-bold tracking-widest text-gray-400 hover:text-white transition-all uppercase">Pricing</a>
        </div>

        <div class="flex items-center gap-4">
          <a href="#auth" class="btn-primary py-1.5 px-4 text-xs md:text-xs font-black uppercase tracking-widest rounded-lg h-8 md:h-10 w-auto">Join Now</a>

          <button onclick="window.toggleLandingMenu(true)" class="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
            ${Icons.menu}
          </button>
        </div>
      </nav>



      <!-- Mobile Menu (Native Overlay Feel) -->
      <div id="landing-mobile-menu" class="fixed inset-0 z-[100] bg-[#0f1115]/95 backdrop-blur-xl transform translate-x-full transition-transform duration-500 p-8 flex flex-col justify-between">
        <div>
           <div class="flex justify-between items-center mb-12">
              <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/10">FX</div>
              <button onclick="window.toggleLandingMenu(false)" class="p-2 text-gray-500 hover:text-white">
                ${Icons.close}
              </button>
           </div>
           <div class="flex flex-col gap-6 text-xl font-black tracking-tighter uppercase">
             <a href="#markets-page" onclick="window.toggleLandingMenu(false)" class="p-4 bg-white/5 rounded-2xl flex items-center justify-between group">
                <span>Markets</span>
                <span class="text-blue-500 text-sm group-hover:translate-x-1 transition-transform">→</span>
             </a>
             <a href="#orders-page" onclick="window.toggleLandingMenu(false)" class="p-4 bg-white/5 rounded-2xl flex items-center justify-between group">
                <span>Execution</span>
                <span class="text-blue-500 text-sm group-hover:translate-x-1 transition-transform">→</span>
             </a>
             <a href="#pricing-section" onclick="window.toggleLandingMenu(false)" class="p-4 bg-white/5 rounded-2xl flex items-center justify-between group">
                <span>Infrastructure</span>
                <span class="text-blue-500 text-sm group-hover:translate-x-1 transition-transform">→</span>
             </a>
           </div>
        </div>
        <div class="space-y-4">
           <a href="#auth" onclick="window.toggleLandingMenu(false)" class="btn-primary w-full py-4 text-center text-xs font-black uppercase tracking-widest rounded-2xl">Join Now</a>
           <p class="text-xs text-gray-500 text-center uppercase tracking-widest italic">Institutional Grade Terminal Node v2.4</p>
        </div>
      </div>

      <!-- Hero Section -->
      <section class="hero-section relative flex items-center justify-center pt-32 pb-12 px-6 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10 opacity-30"></div>

        <div class="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 md:gap-20 relative z-10 reveal">
          <div class="flex-1 text-center lg:text-left space-y-8 md:space-y-12">
            <!-- Trust Strip (Minimal) -->
            <div class="flex flex-wrap justify-center lg:justify-start items-center gap-3 md:gap-6 opacity-60">
               <div class="flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-blue-500"></span>
                  <span class="text-xs font-black uppercase tracking-widest text-white">0.01% Slippage</span>
               </div>
               <div class="flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-blue-500"></span>
                  <span class="text-xs font-black uppercase tracking-widest text-white">0.4ms Execution</span>
               </div>
               <div class="flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-blue-500"></span>
                  <span class="text-xs font-black uppercase tracking-widest text-white">99.99% Uptime</span>
               </div>
            </div>

            <div class="space-y-6">
              <h1 class="text-3xl md:text-8xl font-black tracking-tighter leading-[0.95] text-white uppercase">
                Trade with <br> <span class="text-blue-500">Institutional</span> <br class="hidden lg:block"> Edge.
              </h1>
              <p class="text-sm md:text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                High-fidelity trading infrastructure for global institutional players.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a href="#auth" class="btn-primary w-full sm:w-auto px-8 py-3.5 text-xs font-black uppercase tracking-widest rounded-xl">Join Now</a>
              <a href="#dashboard" class="w-full sm:w-auto px-8 py-3.5 text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest rounded-xl border border-white/5 hover:bg-white/5 transition-all">Explore Demo</a>
            </div>

            <!-- Mobile Mini Terminal Card (Visual Filler) -->
            <div class="lg:hidden w-full max-w-sm mx-auto mt-12 pt-4 reveal" style="transition-delay: 0.3s">
               <div class="glass-card p-6 rounded-[2rem] border border-white/5 shadow-2xl shadow-blue-600/5 relative overflow-hidden group">
                  <div class="flex justify-between items-center mb-6">
                     <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p class="text-xs font-black text-white uppercase tracking-widest">EUR / USD</p>
                     </div>
                     <p class="text-xs font-black text-green-500 uppercase tracking-widest">+1.42%</p>
                  </div>
                  <div class="flex justify-between items-end mb-4">
                     <p class="text-3xl font-black text-white tracking-tighter">1.08245</p>
                     <div class="h-8 w-24 relative">
                        <svg class="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                           <path d="M0,30 Q25,25 50,35 T100,10" stroke="#3b82f6" stroke-width="2" fill="none" class="animate-pulse"></path>
                        </svg>
                     </div>
                  </div>
                  <div class="pt-4 border-t border-white/5 flex justify-between items-center opacity-40">
                     <p class="text-[7px] font-black text-gray-500 uppercase tracking-widest">Spread: 0.2 Pips</p>
                     <p class="text-[7px] font-black text-gray-500 uppercase tracking-widest">Latency: 0.4ms</p>
                  </div>
               </div>
            </div>
          </div>

          <!-- Desktop Terminal Preview -->
          <div class="flex-1 w-full max-w-2xl relative hidden lg:block perspective-2000">
             <div class="glass-card rounded-[2.5rem] p-10 border border-white/10 shadow-2xl shadow-blue-600/5 rotate-3d hover:rotate-0 transition-all duration-700">
                <div class="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                   <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">FX</div>
                      <span class="text-xs font-black uppercase tracking-widest text-white">Institutional Node v2.4</span>
                   </div>
                   <div class="px-3 py-1 bg-green-500/10 rounded-full flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span class="text-xs font-black text-green-500 uppercase tracking-widest">Live Execution</span>
                   </div>
                </div>
                
                <div class="space-y-8">
                   <div class="flex justify-between items-end">
                      <div>
                         <p class="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">EUR / USD</p>
                         <p class="text-5xl font-black text-white tracking-tighter">1.08245</p>
                      </div>
                      <div class="text-right">
                         <p class="text-xs font-black text-green-500 uppercase tracking-widest">+1.42%</p>
                         <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Spread: 0.2 Pips</p>
                      </div>
                   </div>
                   
                   <div class="h-32 w-full bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center justify-center relative overflow-hidden">
                      <svg class="w-full h-full px-4" viewBox="0 0 400 100" preserveAspectRatio="none">
                         <path d="M0,80 Q50,70 100,85 T200,60 T300,75 T400,50" stroke="#3b82f6" stroke-width="3" fill="none" class="animate-pulse"></path>
                      </svg>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <!-- Institutional Market Feed (Now below fold) -->
      <section class="lg:hidden border-t border-white/5 py-12 px-6">
         <div class="space-y-6">
            <p class="text-xs font-black text-gray-400 uppercase tracking-[0.4em] text-center">Institutional Feed</p>
            <div class="flex justify-between items-center px-4">
                <div class="space-y-1">
                   <p class="text-xs font-black text-white uppercase tracking-widest">EUR / USD</p>
                   <p class="text-xs font-black text-green-500 animate-pulse">1.08245</p>
                </div>
                <div class="space-y-1 text-center">
                   <p class="text-xs font-black text-white uppercase tracking-widest">GBP / USD</p>
                   <p class="text-xs font-black text-blue-500 animate-pulse">1.26410</p>
                </div>
                <div class="space-y-1 text-right">
                   <p class="text-xs font-black text-white uppercase tracking-widest">USD / JPY</p>
                   <p class="text-xs font-black text-red-500 animate-pulse">150.42</p>
                </div>
             </div>
             <div class="flex justify-center items-center gap-6 opacity-20 grayscale pt-4 border-t border-white/[0.03]">
                <span class="text-[7px] font-black uppercase tracking-[0.3em]">JP_MORGAN</span>
                <span class="text-[7px] font-black uppercase tracking-[0.3em]">GS_LIQUIDITY</span>
             </div>
         </div>
      </section>

      <!-- Terminal Feature Section -->
      <section class="max-w-7xl mx-auto px-6 py-20 md:py-32 reveal">
        <div class="flex flex-col gap-12">
           <div class="max-w-2xl space-y-4">
              <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight">Inside the <br> <span class="text-blue-500">Terminal.</span></h2>
              <p class="text-gray-500 text-sm md:text-lg font-medium leading-relaxed">Institutional-grade execution with sub-millisecond precision.</p>
           </div>
           
           <!-- Primary Terminal Feature -->
           <div class="relative group cursor-pointer" onclick="window.location.hash = 'dashboard'">
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-blue-900/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              
              <div class="relative bg-[#0f1115] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
                 <!-- Terminal Header Bar -->
                 <div class="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div class="flex items-center gap-3">
                       <span class="w-2 h-2 rounded-full bg-green-500"></span>
                       <span class="text-xs font-black text-gray-500 uppercase tracking-widest">Institutional Feed</span>
                    </div>
                    <div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                       <span class="text-xs font-black text-white uppercase tracking-widest">EUR / USD</span>
                       <span class="text-xs font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded">Live</span>
                    </div>
                    <div class="text-gray-500 group-hover:text-white transition-colors">
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                    </div>
                 </div>

                 <!-- Terminal Body -->
                 <div class="flex-1 min-h-[300px] md:min-h-[420px] p-4 md:p-8 flex flex-col md:flex-row gap-8">
                    <!-- Chart Area -->
                    <div class="flex-1 bg-white/[0.01] rounded-2xl border border-white/5 p-6 relative overflow-hidden flex flex-col justify-between">
                       <div class="flex justify-between items-start">
                          <div>
                             <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Market Execution</p>
                             <p class="text-4xl font-black text-white tracking-tighter">1.08245</p>
                          </div>
                          <div class="text-right">
                             <p class="text-xs font-black text-green-500">+$420.50</p>
                             <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Unrealized P/L</p>
                          </div>
                       </div>
                       
                       <div class="flex-1 flex items-center justify-center">
                          <svg class="w-full h-full opacity-40" viewBox="0 0 400 120" preserveAspectRatio="none">
                             <path d="M0,100 Q50,90 100,110 T200,70 T300,90 T400,60" stroke="#3b82f6" stroke-width="3" fill="none" class="animate-pulse"></path>
                             <path d="M0,105 Q50,95 100,115 T200,75 T300,95 T400,65" stroke="#3b82f6" stroke-width="1" fill="none" opacity="0.3"></path>
                             <!-- Indicator Line -->
                             <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="4"></line>
                          </svg>
                       </div>
                    </div>

                    <!-- Side Controls (Compact) -->
                    <div class="w-full md:w-64 space-y-4">
                       <div class="p-5 bg-white/[0.02] rounded-2xl border border-white/5 space-y-4">
                          <div class="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-500">
                             <span>Order Entry</span>
                             <span class="text-blue-500">Market</span>
                          </div>
                          <div class="h-10 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 justify-between">
                             <span class="text-xs font-black text-white">0.50</span>
                             <span class="text-xs font-black text-gray-400 uppercase">Lots</span>
                          </div>
                          <div class="grid grid-cols-2 gap-3">
                             <button class="py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Sell</button>
                             <button class="py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs font-black text-green-500 uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">Buy</button>
                          </div>
                       </div>
                       
                       <div class="p-5 bg-blue-600/5 rounded-2xl border border-blue-600/10">
                          <p class="text-xs font-black text-blue-500 uppercase tracking-widest mb-2">Platform Node</p>
                          <p class="text-xs font-black text-white leading-relaxed uppercase tracking-wider">L4 Liquidity Engine Active</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>


      <!-- Institutional Trust Bar -->
      <section id="markets-page" class="max-w-7xl mx-auto px-6 py-12 md:py-16 reveal">

        <div class="glass-card rounded-[2rem] p-1 shadow-2xl shadow-blue-600/5">
           <div class="flex flex-col md:flex-row justify-between items-center bg-[#0f1115]/40 rounded-[1.9rem] divide-y md:divide-y-0 md:divide-x divide-white/[0.03]">
              ${[
                { label: 'Active Traders', value: '50K+', sub: 'Verified Est.' },
                { label: 'Monthly Volume', value: '$2.4B+', sub: 'Institutional Est.' },
                { label: 'System Uptime', value: '99.99%', sub: 'Global Node' },
                { label: 'Latency Speed', value: '0.4ms', sub: 'Est. Execution' }
              ].map(stat => `
                <div class="w-full md:px-10 py-8 md:py-10 text-center space-y-1.5 hover:bg-white/[0.01] transition-colors group">
                  <p class="text-xs font-bold text-blue-500/80 uppercase tracking-[0.2em] group-hover:translate-y-[-2px] transition-transform">${stat.label}</p>
                  <p class="text-4xl font-black text-white tracking-tighter">${stat.value}</p>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">${stat.sub}</p>
                </div>
              `).join('')}
           </div>
           <p class="text-xs text-gray-500 text-center mt-4 font-bold uppercase tracking-widest opacity-40">Simulated demo environment. All metrics are estimated based on historical institutional data node performance.</p>
        </div>
      </section>

      <!-- Trusted Infrastructure -->
      <section id="orders-page" class="max-w-7xl mx-auto px-6 py-12 reveal">
        <div class="text-center mb-10 space-y-3">
          <h2 class="text-2xl md:text-5xl font-black tracking-tight text-white uppercase">Trusted <span class="text-blue-500">Infrastructure.</span></h2>
          <p class="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">Institutional Grade Reliability</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
           ${[
             { title: 'Regulated', desc: 'Demo node compliance.', icon: Icons.shield, badge: 'Demo' },
             { title: 'Security', desc: 'AES-256 encryption.', icon: Icons.lightning, badge: 'AES' },
             { title: 'Monitoring', desc: '24/7 health checks.', icon: Icons.cpu, badge: 'LIVE' },
             { title: 'Liquidity', desc: 'Multi-bank pools.', icon: Icons.globe, badge: 'DEEP' }
           ].map(item => `
             <div class="glass-card p-5 rounded-2xl border border-white/[0.03] flex flex-col items-center text-center space-y-2">
                <div class="w-10 h-10 bg-blue-600/5 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                   ${item.icon}
                </div>
                <h3 class="text-xs font-black text-white uppercase tracking-widest">${item.title}</h3>
                <p class="text-[7px] text-gray-400 font-bold uppercase tracking-widest">${item.desc}</p>
             </div>
           `).join('')}
        </div>
      </section>



      <!-- Features Infrastructure -->
      <section id="pricing-section" class="section-container py-24 space-y-16 px-6 reveal">

        <div class="text-center space-y-4">
          <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">Platform <span class="text-blue-500">Infrastructure.</span></h2>
          <p class="text-gray-500 text-xs font-black uppercase tracking-[0.4em]">Built for high-frequency precision.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
           ${[
             { icon: Icons.lightning, title: 'Ultra-Low Latency', desc: 'Sub-millisecond routing engine for precise entry points.' },
             { icon: Icons.globe, title: 'Deep Liquidity', desc: 'Access multi-bank liquidity pools for tightest spreads.' },
             { icon: Icons.cpu, title: 'Network Engine', desc: 'L4 performance nodes optimized for trade execution.' },
             { icon: Icons.chart, title: 'Analytics Node', desc: 'Real-time market intelligence and risk assessment.' }
           ].map(item => `
             <div class="glass-card p-10 rounded-3xl flex items-start gap-8 hover-lift border border-white/[0.03]">
                <div class="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 soft-shadow">
                  ${item.icon}
                </div>
                <div class="space-y-2">
                   <h3 class="text-sm font-black text-white uppercase tracking-widest">${item.title}</h3>
                   <p class="text-xs text-gray-400 font-medium leading-relaxed">${item.desc}</p>
                </div>
             </div>
           `).join('')}
        </div>
      </section>

      <!-- Capital Fortification -->
      <section class="section-container py-32 px-6 relative overflow-hidden reveal">
        <div class="absolute inset-0 bg-green-500/[0.02] pointer-events-none"></div>
        <div class="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
          <div class="flex-1 space-y-8 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/5 border border-green-500/10 rounded-full">
               <span class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
               <span class="text-xs font-black text-green-500 uppercase tracking-widest">Safety Protocol Active</span>
            </div>
            <h2 class="text-4xl md:text-7xl font-black tracking-tighter text-white leading-none">Capital <br> <span class="text-green-500">Fortification.</span></h2>
            <p class="text-gray-500 text-sm md:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">Multi-layer verification nodes and military-grade encryption to safeguard global assets.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4 max-w-md mx-auto lg:mx-0">
               ${['AES-256 Protocol', 'Multi-Sig Access', 'Cold Asset Nodes', '24/7 Monitoring'].map(item => `
                 <div class="flex items-center gap-3 group">
                   <div class="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                     ${Icons.check}
                   </div>
                   <span class="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-green-500 transition-colors">${item}</span>
                 </div>
               `).join('')}
            </div>
          </div>
          <div class="flex-1 flex justify-center w-full">
             <div class="w-56 h-56 md:w-80 md:h-80 glass-card p-12 rounded-full flex items-center justify-center border-green-500/10 soft-shadow relative">
                <div class="absolute inset-0 bg-green-500/5 blur-3xl opacity-20"></div>
                <div class="text-green-500 pulse-shield relative z-10">
                   ${Icons.shield}
                </div>
             </div>
          </div>
        </div>
      </section>

      <!-- Inquiries -->
      <section class="section-container py-24 px-6 max-w-3xl mx-auto space-y-12 reveal">
        <div class="text-center space-y-4">
          <h2 class="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter">Inquiries.</h2>
          <p class="text-xs font-black text-gray-500 uppercase tracking-[0.4em]">Clarifying the infrastructure.</p>
        </div>
        <div class="space-y-4">
          ${[
            { q: 'Is this platform secure?', a: 'Institutional-grade multi-signature storage and end-to-end AES-256 encryption for all assets.' },
            { q: 'How fast is execution?', a: 'Average execution speed is sub-1.2ms through our optimized L4 liquidity nodes.' },
            { q: 'Is it beginner friendly?', a: 'Precision-engineered interface designed for evolving professional traders.' }
          ].map((faq, i) => `
            <div id="faq-card-${i}" class="faq-card glass-card rounded-2xl overflow-hidden border border-white/[0.03] transition-all duration-300">
              <button onclick="window.toggleFAQ(${i})" class="w-full min-h-[48px] p-6 text-left flex justify-between items-center hover:bg-white/[0.01] transition-colors focus:outline-none">
                <span class="text-xs font-black text-white uppercase tracking-widest transition-colors">${faq.q}</span>
                <span id="faq-icon-${i}" class="faq-icon transition-transform duration-300 text-blue-500 text-xs">▼</span>
              </button>
              <div id="faq-${i}" class="faq-content ${i === 0 ? 'show' : ''} px-6 pb-6 text-xs text-gray-400 leading-relaxed font-medium">
                ${faq.a}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Final Elite CTA -->
      <section id="cta" class="wave-bg py-16 md:py-32 px-6 text-center reveal">
        <div class="max-w-4xl mx-auto space-y-6 relative z-10">
          <p class="text-xs font-black text-blue-500 uppercase tracking-[0.5em] animate-pulse">Institutional Hub Active</p>
          <h2 class="text-3xl md:text-7xl font-black tracking-tighter text-white leading-none uppercase">Join the <span class="text-blue-500">Elite.</span></h2>
          <p class="text-xs md:text-lg text-gray-400 font-bold uppercase tracking-widest max-w-sm mx-auto">High-speed execution 24/7 globally.</p>
          <div class="pt-4">
             <a href="#auth" class="btn-primary w-full md:w-auto shine-effect px-12 py-5 text-xs font-black uppercase tracking-widest rounded-2xl">Launch Live Account</a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-white/[0.03] px-6 py-12 bg-[#0b0d11]">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div class="col-span-2 md:col-span-1 space-y-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-black text-xs">FX</div>
                <span class="text-lg font-black tracking-tight text-white uppercase">Forex<span class="text-blue-500">Pro</span></span>
              </div>
              <p class="text-xs text-gray-500 font-bold uppercase tracking-wider leading-relaxed">Institutional trading terminal infrastructure.</p>
            </div>
            
            <div class="space-y-4">
              <h4 class="text-xs font-black text-white uppercase tracking-widest">Markets</h4>
              <ul class="space-y-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                <li><a href="#markets" class="hover:text-white transition-all">EUR/USD Pair</a></li>
                <li><a href="#markets" class="hover:text-white transition-all">Commodities</a></li>
              </ul>
            </div>

            <div class="space-y-4">
              <h4 class="text-xs font-black text-white uppercase tracking-widest">Legal</h4>
              <ul class="space-y-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                <li><a href="javascript:void(0)" onclick="window.openPrivacy()" class="hover:text-white transition-all">Privacy</a></li>
                <li><a href="javascript:void(0)" onclick="window.openTerms()" class="hover:text-white transition-all">Terms</a></li>
              </ul>
            </div>

            <div class="space-y-4">
              <h4 class="text-xs font-black text-white uppercase tracking-widest">Hub Status</h4>
              <div class="flex gap-2.5 items-center">
                 <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                 <span class="text-xs font-black text-green-500 uppercase tracking-widest">Operational</span>
              </div>
              <p class="text-xs text-gray-800 font-bold uppercase tracking-widest">Simulated platform.</p>
            </div>
          </div>
          <div class="mt-10 pt-8 border-t border-white/[0.02] flex flex-col md:flex-row justify-between gap-4">
            <p class="text-xs text-gray-800 font-bold uppercase tracking-widest">&copy; 2024 ForexPro Institutional.</p>
            <p class="text-xs text-gray-800 font-bold uppercase tracking-widest italic">Trading involves risk.</p>
          </div>
        </div>
      </footer>
    </div>
  `;
};

window.openPrivacy = () => {
  window.showModal('Privacy Policy', `
    <div class="space-y-6 text-gray-400 text-xs font-medium leading-relaxed">
      <p class="text-white font-bold">Your privacy is our priority.</p>
      <p>This Privacy Policy describes how ForexPro collects, uses, and protects your personal information in our demo environment.</p>
      <div class="space-y-2">
         <h4 class="text-blue-500 font-black uppercase tracking-widest text-xs">Data Collection</h4>
         <p>We collect simulated trade data and basic profile information to enhance your terminal experience.</p>
      </div>
      <div class="space-y-2">
         <h4 class="text-blue-500 font-black uppercase tracking-widest text-xs">Security</h4>
         <p>All data is encrypted using institutional-grade AES-256 protocols within our simulated nodes.</p>
      </div>
      <p class="italic text-xs">Note: This is a demo platform. No real financial data is required or stored.</p>
    </div>
  `);
};


window.openTerms = () => {
  window.showModal('Terms of Service', `
    <div class="space-y-6 text-gray-400 text-xs font-medium leading-relaxed">
      <p class="text-white font-bold">Standard Institutional Terms</p>
      <div class="space-y-2">
         <h4 class="text-blue-500 font-black uppercase tracking-widest text-xs">1. Usage Agreement</h4>
         <p>By accessing the ForexPro terminal, you agree to use the platform for educational and demonstration purposes only.</p>
      </div>
      <div class="space-y-2">
         <h4 class="text-blue-500 font-black uppercase tracking-widest text-xs">2. Simulated Trading</h4>
         <p>All trades, balances, and market movements are simulated. No actual financial liability or gain is incurred.</p>
      </div>
      <div class="space-y-2">
         <h4 class="text-blue-500 font-black uppercase tracking-widest text-xs">3. Account Access</h4>
         <p>Demo accounts are temporary and may be reset periodically for node maintenance.</p>
      </div>
    </div>
  `);
};

window.openRisk = () => {
  window.showModal('Risk Disclaimer', `
    <div class="space-y-6 text-gray-400 text-xs font-medium leading-relaxed">
      <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
         <h4 class="text-red-500 font-black uppercase tracking-widest text-xs mb-2">High Risk Warning</h4>
         <p class="text-red-500/80">Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors.</p>
      </div>
      <p>The high degree of leverage can work against you as well as for you. Before deciding to trade foreign exchange, you should carefully consider your investment objectives, level of experience, and risk appetite.</p>
      <p class="text-white font-bold uppercase tracking-widest text-xs">Simulation Notice</p>
      <p>ForexPro is a demo platform. The virtual trading environment aims to replicate institutional execution but does not involve real capital.</p>
    </div>
  `);
};


