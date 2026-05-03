'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTradeStore } from '../store/useTradeStore';



export default function AuthPage() {
  const router = useRouter();
  const showNotification = useTradeStore(state => state.showNotification);
  const [authMode, setAuthMode] = useState('login');


  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminLogin(window.location.hash === '#admin-login');
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleAuth = async (event) => {
    event.preventDefault();
    const form = event.target;
    const login_id = form.login_id.value.trim();
    const login_key = form.login_key.value.trim();
    const name = form.name ? form.name.value.trim() : '';
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (!login_id || !login_key) {
      showNotification({ type: 'ERROR', message: 'Please fill in all fields' });
      return;
    }

    if (!isLogin && !name) {
      showNotification({ type: 'ERROR', message: 'Please enter your full name' });
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isAdminLogin) {
      if (login_id === 'admin' && login_key === '123456') {
        localStorage.setItem('currentUser', JSON.stringify({ name: 'Admin', role: 'admin' }));
        showNotification({ type: 'SUCCESS', message: 'Root Access Verified' });
        router.push('/admin');
      } else {
        showNotification({ type: 'ERROR', message: 'Invalid Admin Credentials' });
        setIsLoading(false);
      }
      return;
    }

    if (authMode === 'signup') {
      if (users.find(u => u.email === login_id)) {
        showNotification({ type: 'ERROR', message: 'User already exists' });
        setIsLoading(false);
        return;
      }
      const newUser = { name, email: login_id, password: login_key, role: 'user', balance: 10000 };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ name, role: 'user' }));
      showNotification({ type: 'SUCCESS', message: 'Account Created' });
      router.push('/dashboard');
    } else {
      // Demo Account Bypass
      if (login_id === 'demo@forexpro.com' && login_key === 'demo123') {
         localStorage.setItem('currentUser', JSON.stringify({ name: 'Demo Trader', role: 'user' }));
         showNotification({ type: 'SUCCESS', message: 'Accessing Demo Terminal' });
         router.push('/dashboard');
         return;
      }

      const user = users.find(u => u.email === login_id && u.password === login_key);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({ name: user.name, role: user.role }));
        showNotification({ type: 'SUCCESS', message: 'Welcome back' });
        router.push('/dashboard');
      } else {
        showNotification({ type: 'ERROR', message: 'Invalid Credentials' });
        setIsLoading(false);
      }
    }
  };

  const isLogin = authMode === 'login' || isAdminLogin;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0f1115] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-5%] w-full max-w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-full max-w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 opacity-30"></div>

      {/* Left Branding / Top Mobile Branding */}
      <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-between relative z-10 lg:border-r border-white/5 bg-[#131722]/40 lg:bg-[#131722]/40 backdrop-blur-sm">
        <div className="flex items-center gap-3 justify-center lg:justify-start">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-600/20">FX</div>
          <span className="text-3xl font-black tracking-tighter text-white">Forex<span className="text-blue-500">Pro</span></span>
        </div>

        <div className="space-y-4 lg:space-y-8 mt-12 lg:mt-0 text-center lg:text-left">
          <h1 className="text-4xl lg:text-7xl font-black leading-tight tracking-tighter text-white">
            {isAdminLogin ? (
              <>Root <br className="hidden lg:block" /> <span className="text-blue-600">Control.</span></>
            ) : isLogin ? (
              <>Welcome <br className="hidden lg:block" /> <span className="text-blue-600">Back.</span></>
            ) : (
              <>Join the <br className="hidden lg:block" /> <span className="text-blue-600">Elite.</span></>
            )}
          </h1>
          <p className="text-gray-400 text-sm lg:text-lg max-w-sm mx-auto lg:mx-0 leading-relaxed font-medium">
            {isAdminLogin ? 'Administrative console for liquidity and system parameters.' : 'Access institutional grade liquidity and precision execution in real-time.'}
          </p>
        </div>

        <div className="hidden lg:block text-xs text-gray-400 font-bold uppercase tracking-widest mt-12">
          © 2024 ForexPro Institutional Terminal
        </div>
      </div>

      {/* Auth Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-20 relative z-10">
        <div className="w-full max-w-sm space-y-8">
          {/* Mode Toggle (Only for User Auth) */}
          {!isAdminLogin && (
            <div className="flex bg-[#131722] p-1.5 rounded-2xl border border-white/5 shadow-inner">
               <button 
                 onClick={() => setAuthMode('login')} 
                 className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
               >
                 LOGIN
               </button>
               <button 
                 onClick={() => setAuthMode('signup')} 
                 className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
               >
                 SIGNUP
               </button>
            </div>
          )}

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-white">
               {isAdminLogin ? 'Admin Command' : (isLogin ? 'Login to Terminal' : 'Create Account')}
            </h2>
            <p className="text-gray-500 text-xs lg:text-sm font-medium uppercase tracking-[0.2em]">
               {isAdminLogin ? 'Secure root authentication' : (isLogin ? 'Access your dashboard' : 'Institutional registration')}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                <input name="name" type="text" placeholder="John Doe" required className="input-field bg-[#131722] py-4 text-base md:text-sm" />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                 {isAdminLogin ? 'Operator ID' : 'Authorized Email'}
              </label>
              <input 
                name="login_id" 
                type={isAdminLogin ? 'text' : 'email'} 
                defaultValue={!isAdminLogin && isLogin ? 'demo@forexpro.com' : ''} 
                placeholder={isAdminLogin ? 'Enter ID' : 'Enter Email'} 
                required 
                autoComplete="new-password" 
                className="input-field bg-[#131722] py-4 text-base md:text-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Keyphrase</label>
              <input 
                name="login_key" 
                type="password" 
                defaultValue={!isAdminLogin && isLogin ? 'demo123' : ''} 
                placeholder="Enter Password" 
                required 
                autoComplete="new-password" 
                className="input-field bg-[#131722] py-4 text-base md:text-sm" 
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-5 text-sm btn-glow active:scale-95 transition-all">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
              ) : (
                isAdminLogin ? 'VERIFY ROOT ACCESS' : (isLogin ? 'ENTER TERMINAL' : 'CREATE ACCOUNT')
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 font-medium">
            {isAdminLogin ? (
              <a href="#auth" className="text-blue-500 font-bold hover:underline uppercase tracking-widest">Back to User Terminal</a>
            ) : (
              isLogin ? (
                <>Administrator? <a href="#admin-login" className="text-blue-500 font-bold hover:underline uppercase tracking-widest">Admin Command</a></>
              ) : (
                <>Already have an account? <button onClick={() => setAuthMode('login')} className="text-blue-500 font-bold hover:underline uppercase tracking-widest bg-transparent border-none p-0 cursor-pointer">Log In</button></>
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
