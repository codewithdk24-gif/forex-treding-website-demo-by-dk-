'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTradeStore } from '@/store/useTradeStore';
import { useAuth } from '@/context/AuthContext';

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, user } = useAuth();
  const showNotification = useTradeStore(state => state.showNotification);
  
  // State
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Handle URL hash for admin login
  useEffect(() => {
    const checkHash = () => setIsAdminLogin(window.location.hash === '#admin-login');
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email || !password) {
      showNotification({ type: 'ERROR', message: 'All credentials are required' });
      return;
    }

    setIsLoading(true);
    try {
      if (isAdminLogin) {
        // Admin Logic (Static for demo)
        if (email === 'admin' && password === '123456') {
          showNotification({ type: 'SUCCESS', message: 'Admin session authorized' });
          router.push('/admin');
        } else {
          showNotification({ type: 'ERROR', message: 'Invalid administrative credentials' });
        }
      } else if (authMode === 'signup') {
        const { error } = await signUp(email, password, { 
          data: { full_name: fullName } 
        });
        
        if (error) throw error;
        showNotification({ type: 'SUCCESS', message: 'Check your email to confirm registration' });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        showNotification({ type: 'SUCCESS', message: 'Terminal connection established' });
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('[AuthPage] Auth Error:', err);
      showNotification({ 
        type: 'ERROR', 
        message: err.status === 429 ? 'Rate limited. Please wait a moment.' : err.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = authMode === 'login' || isAdminLogin;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0f1115] relative overflow-hidden font-sans">
      {/* Visual Accents */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] opacity-40"></div>
      
      {/* Left Panel: Branding & Value Prop */}
      <div className="w-full lg:w-1/2 p-8 lg:p-24 flex flex-col justify-between relative z-10 lg:border-r border-white/5 bg-[#0f1115]/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-blue-600/40">FX</div>
          <span className="text-3xl font-black tracking-tighter text-white">Forex<span className="text-blue-500">Pro</span></span>
        </div>

        <div className="space-y-8 mt-20 lg:mt-0">
          <div className="space-y-2">
            <p className="text-blue-500 font-bold text-xs uppercase tracking-[0.3em]">Institutional Terminal v2.4</p>
            <h1 className="text-5xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white uppercase">
              {isAdminLogin ? 'System' : (isLogin ? 'Access' : 'Elite')} <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                {isAdminLogin ? 'Control' : (isLogin ? 'Terminal' : 'Network')}
              </span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
            Ultra-low latency execution and deep liquidity pools for professional participants.
          </p>
        </div>

        <div className="flex items-center gap-6 text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
          <span>© 2024</span>
          <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
          <span>Encrypted Session</span>
          <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
          <span>Node 04-Global</span>
        </div>
      </div>

      {/* Right Panel: Auth Controller */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-20 relative z-20">
        <div className="w-full max-w-md space-y-10">
          
          {!isAdminLogin && (
            <div className="flex bg-[#1a1d24] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
               <button 
                 type="button"
                 onClick={() => setAuthMode('login')} 
                 className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${isLogin ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
               >
                 Connection
               </button>
               <button 
                 type="button"
                 onClick={() => setAuthMode('signup')} 
                 className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${!isLogin ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
               >
                 Registration
               </button>
            </div>
          )}

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">
               {isAdminLogin ? 'Admin Verification' : (isLogin ? 'Establish Link' : 'Initialize Node')}
            </h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
               Please provide your encrypted credentials
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleAuth}>
            {!isLogin && (
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1 group-focus-within:text-blue-500 transition-colors">Full Identification</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Legal Name" 
                  required 
                  className="w-full bg-[#1a1d24] border border-white/5 rounded-2xl py-5 px-6 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-600/50 focus:bg-[#1f232b] transition-all" 
                />
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1 group-focus-within:text-blue-500 transition-colors">Network ID</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@institutional.com" 
                required 
                className="w-full bg-[#1a1d24] border border-white/5 rounded-2xl py-5 px-6 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-600/50 focus:bg-[#1f232b] transition-all" 
              />
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1 group-focus-within:text-blue-500 transition-colors">Security Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
                className="w-full bg-[#1a1d24] border border-white/5 rounded-2xl py-5 px-6 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-600/50 focus:bg-[#1f232b] transition-all" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isAdminLogin ? 'Authenticate Root' : (isLogin ? 'Connect Terminal' : 'Register Account')}</span>
              )}
            </button>
          </form>

          <div className="text-center">
            {isAdminLogin ? (
              <a href="#auth" className="text-[10px] font-black text-gray-600 hover:text-blue-500 uppercase tracking-widest transition-colors">Return to standard terminal</a>
            ) : (
              isLogin ? (
                <div className="flex flex-col gap-4">
                  <a href="#admin-login" className="text-[10px] font-black text-gray-700 hover:text-white uppercase tracking-widest transition-colors italic">Administrative Command Console</a>
                </div>
              ) : (
                <button type="button" onClick={() => setAuthMode('login')} className="text-[10px] font-black text-gray-600 hover:text-blue-500 uppercase tracking-widest transition-colors">Already have credentials? Sign In</button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
