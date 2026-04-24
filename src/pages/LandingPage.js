const Icons = {
  lightning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  chart: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`
};

export const LandingPage = () => {
  return `
    <div class="min-h-screen bg-[#0f1115] text-white bg-grid transition-colors duration-300 selection:bg-blue-500/30 selection:text-blue-500">
      <!-- Navbar -->
      <nav class="fixed top-0 w-full z-50 glass border-b border-white/5 h-16 md:h-20 flex items-center justify-between px-6 md:px-12 lg:px-20">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20">FX</div>
          <span class="text-xl md:text-2xl font-black tracking-tighter">Forex<span class="text-blue-500">Pro</span></span>
        </div>
        <div class="hidden lg:flex items-center gap-10">
          <a href="/#markets" class="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Markets</a>
          <a href="/#orders" class="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Execution</a>
          <a href="#cta" class="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Pricing</a>
        </div>
        <div class="flex items-center gap-3">
          <a href="#auth" class="btn-primary min-h-0 py-2 md:py-2.5 px-5 md:px-7 text-[10px] md:text-xs font-black">LOGIN</a>
        </div>
      </nav>


      <!-- Hero Section -->
      <section class="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 opacity-40"></div>
        
        <div class="max-w-4xl mx-auto text-center space-y-6 md:space-y-10 relative z-10">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 text-[10px] md:text-xs font-black uppercase tracking-widest fade-in">
            ${Icons.globe} Global Liquidity Pool Access
          </div>
          
          <h1 class="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] text-white fade-in" style="animation-delay: 0.1s">
            Institutional-Grade <br class="hidden sm:block"> Trading Infrastructure
          </h1>
          
          <p class="text-sm md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium px-4 md:px-0 fade-in" style="animation-delay: 0.2s">
            Professional-grade forex terminal with institutional speed, real-time analytics, and deep liquidity access.
          </p>

          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 fade-in" style="animation-delay: 0.3s">
            <a href="#auth" class="w-full sm:w-auto btn-primary px-10 btn-glow">Launch Terminal</a>
            <a href="#dashboard" class="w-full sm:w-auto btn-outline px-10">Watch Live Demo</a>
          </div>
        </div>

        <!-- Premium Product Preview (Restored & Improved) -->
        <div class="mt-16 md:mt-32 max-w-6xl mx-auto px-4 md:px-0 fade-in relative group" style="animation-delay: 0.4s">
           <div class="absolute -inset-4 bg-blue-600/20 blur-[100px] opacity-0 group-hover:opacity-30 transition-opacity"></div>
           
           <!-- Floating UI Overlay Cards -->
           <div class="absolute -top-10 -left-6 md:-left-12 card glass p-4 space-y-3 hidden lg:block z-20 float shadow-2xl">
              <div class="flex items-center gap-3">
                 <div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">${Icons.lightning}</div>
                 <div>
                    <p class="text-[10px] font-black text-white/50 uppercase">Order Execution</p>
                    <p class="text-xs font-black text-white">0.001s Latency</p>
                 </div>
              </div>
           </div>

           <div class="absolute -bottom-10 -right-6 md:-right-12 card glass p-4 space-y-3 hidden lg:block z-20 float-delayed shadow-2xl">
              <div class="flex items-center gap-3">
                 <div class="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500">${Icons.chart}</div>
                 <div>
                    <p class="text-[10px] font-black text-white/50 uppercase">Portfolio Alpha</p>
                    <p class="text-xs font-black text-green-500">+$12,450.00</p>
                 </div>
              </div>
           </div>

           <!-- The "Live" Terminal Preview -->
           <div class="relative rounded-2xl md:rounded-[40px] border border-white/5 bg-[#131722] p-2 md:p-4 shadow-2xl overflow-hidden transition-transform duration-700 hover:scale-[1.01] hover:-rotate-1">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
              <div class="relative bg-[#0f1115] rounded-xl md:rounded-[32px] aspect-[16/10] md:aspect-video overflow-hidden border border-white/5">
                 <!-- Mock Dashboard UI -->
                 <div class="w-full h-full flex flex-col">
                    <div class="h-10 md:h-14 border-b border-white/5 flex items-center px-6 gap-4">
                       <div class="flex gap-1.5"><div class="w-2 h-2 rounded-full bg-red-500/50"></div><div class="w-2 h-2 rounded-full bg-yellow-500/50"></div><div class="w-2 h-2 rounded-full bg-green-500/50"></div></div>
                       <div class="h-4 w-32 bg-white/5 rounded-full"></div>
                    </div>
                    <div class="flex-1 flex">
                       <div class="w-16 md:w-20 border-r border-white/5 p-4 space-y-6">
                          <div class="w-8 h-8 bg-blue-600/20 rounded-lg"></div>
                          <div class="w-8 h-8 bg-white/5 rounded-lg"></div>
                          <div class="w-8 h-8 bg-white/5 rounded-lg"></div>
                       </div>
                       <div class="flex-1 p-6 space-y-6">
                          <div class="h-8 w-1/3 bg-white/5 rounded-lg"></div>
                          <div class="flex-1 bg-white/[0.02] rounded-2xl border border-white/5 relative overflow-hidden">
                             <svg class="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 400">
                                <path d="M0 300 Q100 150 200 250 T400 100 T600 280 T800 120 T1000 200" fill="none" stroke="#3b82f6" stroke-width="4" />
                             </svg>
                             <div class="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent"></div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <!-- Interactive Overlay -->
                 <div class="absolute inset-0 flex items-center justify-center bg-[#0f1115]/40 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity cursor-pointer group/overlay">
                    <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover/overlay:scale-110 transition-transform">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" class="ml-1"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="section-container border-y border-white/5 bg-[#131722]/50">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
           <div class="flex-1 text-center py-6 md:py-0 group">
              <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Active Users</p>
              <h3 class="text-4xl md:text-5xl font-black text-white group-hover:text-blue-500 transition-colors">50K+</h3>
           </div>
           <div class="flex-1 text-center py-6 md:py-0 group">
              <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Total Volume</p>
              <h3 class="text-4xl md:text-5xl font-black text-blue-500">$2.4B</h3>
           </div>
           <div class="flex-1 text-center py-6 md:py-0 group">
              <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Uptime</p>
              <h3 class="text-4xl md:text-5xl font-black text-white group-hover:text-blue-500 transition-colors">99.9%</h3>
           </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="section-container space-y-12 md:space-y-32">
        <!-- Feature 1 -->
        <div id="features" class="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-20 reveal">
          <div class="flex-1 space-y-5 text-center lg:text-left order-2 lg:order-1">
            <div class="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto lg:mx-0">${Icons.lightning}</div>
            <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white">Lightning Fast <br class="hidden md:block"> Execution Engine</h2>
            <p class="text-sm md:text-lg text-gray-400 font-medium">Experience sub-millisecond precision with institutional grade execution. Optimized execution, just results.</p>
            <div class="pt-2">
               <a href="#features" class="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest mx-auto lg:mx-0 hover:gap-4 transition-all">Learn More ${Icons.arrowRight}</a>
            </div>
          </div>

          <div class="flex-1 w-full order-1 lg:order-2">
             <div class="card bg-blue-600/5 border-blue-600/10 p-4 md:p-8 hover-lift">
                <div class="aspect-video bg-[#0f1115] rounded-xl overflow-hidden border border-white/5 relative">
                   <div class="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent"></div>
                   <div class="p-6 space-y-4">
                      <div class="flex justify-between items-center"><div class="h-2 w-20 bg-white/5 rounded"></div><div class="badge bg-green-500/20 text-green-500">LOCKED</div></div>
                      <div class="h-1 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-blue-600 w-3/4"></div></div>
                      <div class="flex justify-between items-center"><div class="h-8 w-24 bg-white/5 rounded"></div><div class="h-8 w-8 rounded-full bg-blue-600/20"></div></div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- Feature 2 -->
        <div id="safety" class="max-w-6xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-10 md:gap-20 reveal">
          <div class="flex-1 space-y-5 text-center lg:text-left">
            <div class="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mx-auto lg:mx-0">${Icons.shield}</div>
            <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white">Institutional <br class="hidden md:block"> Risk Protocol</h2>
            <p class="text-sm md:text-lg text-gray-400 font-medium">Automated margin intelligence and negative balance protection. Your capital is secured by industry leading protocols.</p>
            <div class="pt-2">
               <a href="#safety" class="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-widest mx-auto lg:mx-0 hover:gap-4 transition-all">Explore Safety ${Icons.arrowRight}</a>
            </div>
          </div>

          <div class="flex-1 w-full">
             <div class="card bg-green-500/5 border-green-500/10 p-4 md:p-8 hover-lift">
                <div class="aspect-video bg-[#0f1115] rounded-xl border border-white/5 relative flex items-center justify-center">
                   <div class="text-center space-y-3">
                      <div class="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-3xl">🛡️</div>
                      <p class="text-xs font-black text-white/50 uppercase tracking-widest">Health Score: 98.4%</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section id="cta" class="section-container relative overflow-hidden text-center bg-[#131722]/50 border-t border-white/5">

        <div class="absolute inset-0 bg-blue-600/5 blur-[120px] -z-10"></div>
        <div class="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 class="text-3xl md:text-6xl font-black tracking-tighter text-white">Stop Guessing. <br> <span class="text-blue-500">Trade Like a Pro.</span></h2>
          <p class="text-sm md:text-lg text-gray-400 font-medium px-6 md:px-0">Join 50,000+ elite traders scaling their legacy with the world's most advanced terminal.</p>
          <div class="pt-4 px-6 md:px-0">
             <a href="#auth" class="btn-primary w-full sm:w-auto px-12 btn-glow">Get Started Now</a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-12 md:py-20 px-6 md:px-20 border-t border-white/5 bg-[#0f1115]">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">FX</div>
            <span class="text-xl font-black tracking-tighter text-white">ForexPro</span>
          </div>
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-600">© 2024 ForexPro Institutional. All rights reserved.</p>
          <div class="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
             <a href="javascript:void(0)" onclick="window.openPrivacy()" class="hover:text-blue-500 transition-colors">Privacy</a>
             <a href="javascript:void(0)" onclick="window.openTerms()" class="hover:text-blue-500 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  `;
};

window.openPrivacy = () => {
  window.showModal('Privacy Policy', `
    <div class="space-y-4">
      <p>This institutional trading platform adheres to the highest standards of data protection and privacy.</p>
      <p>Our infrastructure utilizes military-grade encryption to ensure that your trading activities and personal information remain confidential at all times.</p>
      <p class="font-black text-white">KEY PROTOCOLS:</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Zero-knowledge architecture for sensitive data.</li>
        <li>End-to-end encryption for all trade communications.</li>
        <li>Compliance with global financial privacy standards.</li>
      </ul>
    </div>
  `);
};

window.openTerms = () => {
  window.showModal('Terms of Service', `
    <div class="space-y-4">
      <p>By accessing the ForexPro Institutional Terminal, you agree to the following institutional-grade terms:</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Execution speed is subject to global liquidity conditions.</li>
        <li>Risk protocols are automatically enforced by the L4 liquidity engine.</li>
        <li>Users must maintain minimum margin requirements as specified in the risk protocol.</li>
      </ul>
      <p>Failure to comply with risk protocols may result in automated portfolio rebalancing.</p>
    </div>
  `);
};

