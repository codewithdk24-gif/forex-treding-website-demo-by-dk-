export const LandingPage = () => {
  const Icons = {
    lightning: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    shield: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    chart: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
    globe: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    cpu: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>`,
    wallet: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>`,
    admin: `<svg class="icon-glow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`
  };

  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }, 100);

  return `
    <div class="min-h-screen bg-[#0f1115] text-white transition-all duration-300 overflow-x-hidden selection:bg-blue-500/20">
      <!-- Navbar -->
      <nav class="fixed top-0 w-full z-50 bg-[#0f1115]/80 backdrop-blur-md border-b border-white/[0.03] h-16 md:h-20 flex items-center justify-between px-6 lg:px-20">
        <div class="flex items-center gap-2.5 cursor-pointer">
          <div class="w-8 h-8 md:w-9 md:h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/10">FX</div>
          <span class="text-xl md:text-2xl font-black tracking-tight uppercase">Forex<span class="text-blue-500">Pro</span></span>
        </div>
        
        <div class="hidden lg:flex items-center gap-10">
          <a href="#features" class="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-white transition-all uppercase">Features</a>
          <a href="#preview" class="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-white transition-all uppercase">Terminal</a>
          <a href="#cta" class="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-white transition-all uppercase">Start Now</a>
        </div>

        <div class="flex items-center gap-4">
          <a href="#auth" class="btn-primary py-2 px-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl">Launch App</a>
        </div>
      </nav>

      <!-- 1. HERO SECTION -->
      <section class="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10 opacity-30"></div>

        <div class="max-w-5xl mx-auto text-center space-y-10 reveal">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span class="text-[10px] font-black text-blue-500 uppercase tracking-widest">v2.4 Institutional Node Active</span>
          </div>
          
          <h1 class="text-4xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white uppercase">
            Real-Time <br> <span class="text-blue-500">Trading</span> <br> Platform.
          </h1>
          
          <p class="text-sm md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Experience sub-millisecond execution and deep institutional liquidity in a high-fidelity environment built for elite traders.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <a href="#dashboard" class="btn-primary w-full sm:w-auto px-10 py-5 text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-blue-600/20 active:scale-95 transition-all">Try Demo</a>
            <a href="#features" class="w-full sm:w-auto px-10 py-5 text-xs font-black text-gray-500 hover:text-white uppercase tracking-[0.2em] rounded-2xl border border-white/5 hover:bg-white/5 active:scale-95 transition-all">Learn More</a>
          </div>
        </div>
      </section>

      <!-- 2. FEATURES SECTION -->
      <section id="features" class="max-w-7xl mx-auto px-6 py-24 md:py-40 reveal">
        <div class="text-center mb-20 space-y-4">
          <h2 class="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase">Engineered for <span class="text-blue-500">Precision.</span></h2>
          <p class="text-gray-500 text-xs font-black uppercase tracking-[0.4em]">Sub-millisecond routing engine.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${[
            { icon: Icons.lightning, title: 'Real-Time Data', desc: 'Live market streams from Tier-1 liquidity providers with zero delay.' },
            { icon: Icons.chart, title: 'Demo/Live Toggle', desc: 'Switch instantly between high-fidelity simulation and real execution.' },
            { icon: Icons.wallet, title: 'Wallet System', desc: 'Advanced capital management with multi-currency institutional support.' },
            { icon: Icons.admin, title: 'Admin Dashboard', desc: 'Complete control over your trading environment and node health.' }
          ].map(feature => `
            <div class="card p-10 flex flex-col items-center text-center space-y-6 hover:border-blue-500/30 group transition-all duration-500">
              <div class="w-16 h-16 bg-blue-600/5 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-600/10 transition-all duration-500">
                ${feature.icon}
              </div>
              <div class="space-y-3">
                <h3 class="text-sm font-black text-white uppercase tracking-widest">${feature.title}</h3>
                <p class="text-xs text-gray-500 leading-relaxed font-medium">${feature.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- 3. SCREEN PREVIEW -->
      <section id="preview" class="max-w-7xl mx-auto px-6 py-20 reveal">
        <div class="relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
          
          <div class="relative bg-[#0b0f1a] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]">
            <div class="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div class="flex gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div class="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Institutional Trading Terminal</div>
              <div class="w-12"></div>
            </div>
            
            <div class="p-4 md:p-10">
               <img src="/forex_dashboard_mockup_1777796967547.png" alt="ForexPro Dashboard" class="w-full h-auto rounded-2xl shadow-2xl border border-white/5 hover:scale-[1.01] transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      <!-- 4. FINAL CTA -->
      <section id="cta" class="py-32 md:py-60 px-6 text-center reveal relative">
        <div class="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full opacity-20"></div>
        <div class="max-w-4xl mx-auto space-y-12 relative z-10">
          <div class="space-y-6">
            <h2 class="text-4xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">Ready to <br> <span class="text-blue-500 text-glow">Start Trading?</span></h2>
            <p class="text-xs md:text-xl text-gray-500 font-bold uppercase tracking-[0.3em] max-w-sm mx-auto">Join the future of finance.</p>
          </div>
          
          <div class="pt-8">
             <a href="#auth" class="btn-primary inline-flex items-center gap-4 px-16 py-6 text-xs font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-blue-600/30 active:scale-95 transition-all">
                Start Trading Now
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
             </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-white/[0.03] px-6 py-20 bg-[#0b0d11]">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">FX</div>
            <span class="text-2xl font-black tracking-tight text-white uppercase">Forex<span class="text-blue-500">Pro</span></span>
          </div>
          
          <div class="flex flex-wrap justify-center gap-10 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <a href="#" class="hover:text-white transition-all">Privacy</a>
            <a href="#" class="hover:text-white transition-all">Terms</a>
            <a href="#" class="hover:text-white transition-all">Security</a>
            <a href="#" class="hover:text-white transition-all">Node Status</a>
          </div>

          <p class="text-[10px] font-black text-gray-700 uppercase tracking-widest italic">&copy; 2024 Institutional Node v2.4</p>
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


