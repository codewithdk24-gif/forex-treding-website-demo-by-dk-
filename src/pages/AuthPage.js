export const AuthPage = () => {
  const isAdminLogin = window.location.hash === '#admin-login';
  
  if (window.authMode === undefined) window.authMode = 'login';

  window.toggleAuthMode = (mode) => {
    window.authMode = mode;
    const app = document.getElementById('app');
    if (app) app.innerHTML = AuthPage();
  };

  window.handleAuth = async (event) => {
    event.preventDefault();
    const mode = window.authMode;
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    const login_id = form.login_id.value.trim();
    const login_key = form.login_key.value.trim();
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (!login_id || !login_key) {
      window.showToast('Please fill in all fields', 'error');
      return;
    }

    if (!isLogin && !form.name.value.trim()) {
      window.showToast('Please enter your full name', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="loading-spinner"></div>';

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isAdminLogin) {
      if (login_id === 'admin' && login_key === '123456') {
        localStorage.setItem('currentUser', JSON.stringify({ name: 'Admin', role: 'admin' }));
        window.showToast('Root Access Verified', 'success');
        window.location.hash = 'admin';
      } else {
        window.showToast('Invalid Admin Credentials', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      return;
    }

    if (mode === 'signup') {
      const name = form.name.value.trim();
      if (users.find(u => u.email === login_id)) {
        window.showToast('User already exists', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
      }
      const newUser = { name, email: login_id, password: login_key, role: 'user', balance: 10000 };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ name, role: 'user' }));
      window.showToast('Account Created', 'success');
      window.location.hash = 'dashboard';
    } else {
      // Demo Account Bypass
      if (login_id === 'demo@forexpro.com' && login_key === 'demo123') {
         localStorage.setItem('currentUser', JSON.stringify({ name: 'Demo Trader', role: 'user' }));
         window.showToast('Accessing Demo Terminal', 'success');
         window.location.hash = 'dashboard';
         return;
      }

      const user = users.find(u => u.email === login_id && u.password === login_key);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({ name: user.name, role: user.role }));
        window.showToast('Welcome back', 'success');
        window.location.hash = 'dashboard';
      } else {
        window.showToast('Invalid Credentials', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }


  };

  const isLogin = window.authMode === 'login' || isAdminLogin;

  return `
    <div class="min-h-screen w-full flex flex-col lg:flex-row bg-[#0f1115] relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute top-[-10%] left-[-5%] w-full max-w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 opacity-30"></div>
      <div class="absolute bottom-[-10%] right-[-5%] w-full max-w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 opacity-30"></div>

      <!-- Left Branding / Top Mobile Branding -->
      <div class="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-between relative z-10 lg:border-r border-white/5 bg-[#131722]/40 lg:bg-[#131722]/40 backdrop-blur-sm">
        <div class="flex items-center gap-3 justify-center lg:justify-start">
          <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-600/20">FX</div>
          <span class="text-3xl font-black tracking-tighter text-white">Forex<span class="text-blue-500">Pro</span></span>
        </div>

        <div class="space-y-4 lg:space-y-8 mt-12 lg:mt-0 text-center lg:text-left">
          <h1 class="text-4xl lg:text-7xl font-black leading-tight tracking-tighter text-white">
            ${isAdminLogin ? 'Root <br class="hidden lg:block"> <span class="text-blue-600">Control.</span>' : (isLogin ? 'Welcome <br class="hidden lg:block"> <span class="text-blue-600">Back.</span>' : 'Join the <br class="hidden lg:block"> <span class="text-blue-600">Elite.</span>')}
          </h1>
          <p class="text-gray-400 text-sm lg:text-lg max-w-sm mx-auto lg:mx-0 leading-relaxed font-medium">
            ${isAdminLogin ? 'Administrative console for liquidity and system parameters.' : 'Access institutional grade liquidity and precision execution in real-time.'}
          </p>
        </div>

        <div class="hidden lg:block text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-12">
          © 2024 ForexPro Institutional Terminal
        </div>
      </div>

      <!-- Auth Form Container -->
      <div class="flex-1 flex flex-col justify-center items-center p-6 lg:p-20 relative z-10">
        <div class="w-full max-w-sm space-y-8">
          <!-- Mode Toggle (Only for User Auth) -->
          ${!isAdminLogin ? `
            <div class="flex bg-[#131722] p-1.5 rounded-2xl border border-white/5 shadow-inner">
               <button onclick="window.toggleAuthMode('login')" class="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}">LOGIN</button>
               <button onclick="window.toggleAuthMode('signup')" class="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}">SIGNUP</button>
            </div>
          ` : ''}

          <div class="text-center lg:text-left space-y-2">
            <h2 class="text-2xl lg:text-4xl font-black tracking-tighter text-white">
               ${isAdminLogin ? 'Admin Command' : (isLogin ? 'Login to Terminal' : 'Create Account')}
            </h2>
            <p class="text-gray-500 text-[10px] lg:text-sm font-medium uppercase tracking-[0.2em]">
               ${isAdminLogin ? 'Secure root authentication' : (isLogin ? 'Access your dashboard' : 'Institutional registration')}
            </p>
          </div>

          <form class="space-y-5" onsubmit="window.handleAuth(event)">
            ${!isLogin ? `
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-600 uppercase tracking-widest pl-1">Full Name</label>
                <input name="name" type="text" placeholder="John Doe" required class="input-field bg-[#131722] py-4">
              </div>
            ` : ''}

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-600 uppercase tracking-widest pl-1">
                 ${isAdminLogin ? 'Operator ID' : 'Authorized Email'}
              </label>
              <input name="login_id" type="${isAdminLogin ? 'text' : 'email'}" value="" placeholder="${isAdminLogin ? 'Enter ID' : 'Enter Email'}" required autocomplete="new-password" class="input-field bg-[#131722] py-4">
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-600 uppercase tracking-widest pl-1">Keyphrase</label>
              <input name="login_key" type="password" value="" placeholder="Enter Password" required autocomplete="new-password" class="input-field bg-[#131722] py-4">
            </div>




            <button type="submit" class="btn-primary w-full py-5 text-sm btn-glow active:scale-95 transition-all">
              ${isAdminLogin ? 'VERIFY ROOT ACCESS' : (isLogin ? 'ENTER TERMINAL' : 'CREATE ACCOUNT')}
            </button>

            ${isLogin && !isAdminLogin ? `
               <div class="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl space-y-2 mt-8">
                  <p class="text-[9px] font-black text-blue-500 uppercase tracking-widest">Demo Access Credentials</p>
                  <div class="flex flex-col gap-1">
                     <p class="text-[10px] text-gray-500 font-bold">Email: <span class="text-white">demo@forexpro.com</span></p>
                     <p class="text-[10px] text-gray-500 font-bold">Password: <span class="text-white">demo123</span></p>
                  </div>
               </div>
            ` : ''}
          </form>


          <p class="text-center text-xs text-gray-500 font-medium">
            ${isAdminLogin ? 
              '<a href="#auth" class="text-blue-500 font-bold hover:underline uppercase tracking-widest">Back to User Terminal</a>' : 
              (isLogin ? 'Administrator? <a href="#admin-login" class="text-blue-500 font-bold hover:underline uppercase tracking-widest">Admin Command</a>' : 'Already have an account? <a href="javascript:void(0)" onclick="window.toggleAuthMode(\'login\')" class="text-blue-500 font-bold hover:underline uppercase tracking-widest">Log In</a>')}
          </p>
        </div>
      </div>
    </div>
  `;
};
