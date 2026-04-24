export const AuthPage = () => {
  const isAdminLogin = window.location.hash === '#admin-login';
  
  // Shared state for toggle (default to login)
  if (window.authMode === undefined) window.authMode = 'login';

  window.toggleAuthMode = (mode) => {
    window.authMode = mode;
    const app = document.getElementById('app');
    if (app) app.innerHTML = AuthPage();
  };

  // Handle Auth Logic
  window.handleAuth = (event) => {
    event.preventDefault();
    const mode = window.authMode;
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (isAdminLogin) {
      if (email === 'admin' && password === '123456') {
        localStorage.setItem('currentUser', JSON.stringify({ name: 'Admin', role: 'admin' }));
        window.location.hash = 'admin';
      } else {
        alert('Invalid Admin Credentials');
      }
      return;
    }

    if (mode === 'signup') {
      const name = form.name.value;
      // Check for duplicate email
      if (users.find(u => u.email === email)) {
        alert('User already exists with this email');
        return;
      }
      // Save new user
      const newUser = { name, email, password, role: 'user', balance: 10000 };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login after signup
      localStorage.setItem('currentUser', JSON.stringify({ name, role: 'user' }));
      window.location.hash = 'dashboard';
    } else {
      // Login logic
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({ name: user.name, role: user.role }));
        window.location.hash = 'dashboard';
      } else {
        alert('Invalid Email or Password');
      }
    }
  };

  const isLogin = window.authMode === 'login' || isAdminLogin;

  return `
    <div class="min-h-screen w-full flex bg-[#0f1115] relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute top-[-10%] left-[-5%] w-full max-w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 opacity-30"></div>
      <div class="absolute bottom-[-10%] right-[-5%] w-full max-w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 opacity-30"></div>

      <!-- Left Branding -->
      <div class="hidden lg:flex flex-1 flex-col justify-between p-16 relative z-10 border-r border-white/5 bg-[#131722]/40 backdrop-blur-sm">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-600/20">FX</div>
          <span class="text-3xl font-black tracking-tighter text-white">Forex<span class="text-blue-500">Pro</span></span>
        </div>

        <div class="space-y-8">
          <h1 class="text-7xl font-black leading-none tracking-tighter text-white">
            ${isAdminLogin ? 'Root <br> <span class="text-blue-600 text-6xl">Control.</span>' : (isLogin ? 'Welcome <br> <span class="text-blue-600 text-6xl">Back.</span>' : 'Join the <br> <span class="text-blue-600 text-6xl">Elite.</span>')}
          </h1>
          <p class="text-gray-400 text-lg max-w-sm leading-relaxed font-medium">
            ${isAdminLogin ? 'Administrative console for liquidity and system parameters.' : 'Access institutional grade liquidity and precision execution in real-time.'}
          </p>
        </div>

        <div class="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
          © 2024 ForexPro Institutional Terminal
        </div>
      </div>

      <!-- Auth Form Container -->
      <div class="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        <div class="w-full max-w-sm space-y-8">
          <!-- Mobile Branding -->
          <div class="lg:hidden flex flex-col items-center mb-6">
            <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mb-4 shadow-2xl shadow-blue-600/30">FX</div>
            <h2 class="text-3xl font-black tracking-tighter text-white">ForexPro</h2>
          </div>
          
          <!-- Mode Toggle (Only for User Auth) -->
          ${!isAdminLogin ? `
            <div class="flex bg-[#131722] p-1.5 rounded-2xl border border-white/5 shadow-inner">
               <button onclick="window.toggleAuthMode('login')" class="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}">LOGIN</button>
               <button onclick="window.toggleAuthMode('signup')" class="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}">SIGNUP</button>
            </div>
          ` : ''}

          <div class="text-center lg:text-left space-y-2">
            <h2 class="text-3xl md:text-4xl font-black tracking-tighter text-white">
               ${isAdminLogin ? 'Admin Command' : (isLogin ? 'Login to Terminal' : 'Create Account')}
            </h2>
            <p class="text-gray-500 text-sm font-medium">
               ${isAdminLogin ? 'Secure root authentication required.' : (isLogin ? 'Access your institutional dashboard.' : 'Start your institutional trading journey.')}
            </p>
          </div>

          <form class="space-y-5" onsubmit="window.handleAuth(event)">
            ${!isLogin ? `
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-600 uppercase tracking-widest pl-1">Full Name</label>
                <div class="relative group">
                  <input name="name" type="text" placeholder="John Doe" required class="input-field pl-12 bg-[#131722]">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 opacity-40 group-focus-within:text-blue-500">👤</span>
                </div>
              </div>
            ` : ''}

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-600 uppercase tracking-widest pl-1">
                 ${isAdminLogin ? 'Operator ID' : 'Authorized Email'}
              </label>
              <div class="relative group">
                <input name="email" type="${isAdminLogin ? 'text' : 'email'}" placeholder="${isAdminLogin ? 'admin' : 'agent@forexpro.io'}" required class="input-field pl-12 bg-[#131722]">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 opacity-40 group-focus-within:text-blue-500">✉️</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-600 uppercase tracking-widest pl-1">Keyphrase</label>
              <div class="relative group">
                <input name="password" type="password" placeholder="••••••••••••" required class="input-field pl-12 bg-[#131722]">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 opacity-40 group-focus-within:text-blue-500">🔒</span>
              </div>
            </div>

            <button type="submit" class="btn-primary w-full py-5 text-sm btn-glow">
              ${isAdminLogin ? 'VERIFY ROOT ACCESS' : (isLogin ? 'ENTER TERMINAL' : 'CREATE ACCOUNT')}
            </button>
          </form>

          <p class="text-center text-xs text-gray-500 font-medium">
            ${isAdminLogin ? 
              '<a href="#auth" class="text-blue-500 font-bold hover:underline">Back to User Terminal</a>' : 
              (isLogin ? 'System Administrator? <a href="#admin-login" class="text-blue-500 font-bold hover:underline">Admin Command</a>' : 'Already have an account? <a href="javascript:void(0)" onclick="window.toggleAuthMode(\'login\')" class="text-blue-500 font-bold hover:underline">Log In</a>')}
          </p>
        </div>
      </div>
    </div>
  `;
};
