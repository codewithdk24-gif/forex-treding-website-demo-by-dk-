'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTradeStore } from '../store/useTradeStore';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function AuthPage() {
  // 1. ALL HOOKS AT TOP
  const router = useRouter();
  const { user, loading, signIn, signUp } = useAuth();
  const showNotification = useTradeStore(state => state.showNotification);
  
  const [authMode, setAuthMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 2. TRACING LOGS
  useEffect(() => {
    console.log("STEP: AuthPage State", { user: !!user, loading });
  }, [user, loading]);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminLogin(window.location.hash === '#admin-login');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 3. AUTH LOGIC
  const handleAuth = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.login_id.value.trim();
    const password = form.login_key.value.trim();

    console.log("STEP: Auth Attempt", { email, mode: authMode });

    if (!email || !password) {
      showNotification({ type: 'ERROR', message: 'Credentials missing!' });
      return;
    }

    if (authMode === 'signup' && !fullName.trim()) {
      showNotification({ type: 'ERROR', message: 'Full Name is required!' });
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        console.log("STEP: Signup Triggered");
        const { data, error } = await signUp(email, password, {
          data: { full_name: fullName.trim() }
        });
        
        console.log("STEP: Signup Response", { data, error });

        if (error) throw error;

        if (data?.user) {
          // Manual Auto-Login if session is missing
          if (!data.session) {
            console.log("STEP: Signup Session NULL, triggering Manual Login");
            const loginRes = await signIn(email, password);
            console.log("STEP: Auto-Login Response", loginRes);
            
            if (loginRes.error) {
              if (loginRes.error.message.includes("Email not confirmed")) {
                 throw new Error("Account created! Please confirm your email in Supabase dashboard.");
              }
              throw loginRes.error;
            }
          }
          showNotification({ type: 'SUCCESS', message: 'Account verified!' });
        }
      } else {
        console.log("STEP: Login Triggered");
        const { data, error } = await signIn(email, password);
        
        console.log("STEP: Login Response", { data, error });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password.");
          }
          throw error;
        }

        showNotification({ type: 'SUCCESS', message: 'Access Granted!' });
      }
    } catch (err) {
      console.error('STEP: Final Auth ERROR', err);
      showNotification({ type: 'ERROR', message: err.message || 'Auth failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const providerName = 'google';
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      console.log("OAuth Start:", { 
        provider: providerName, 
        redirectTo: redirectUrl 
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: providerName,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error("OAuth Provider Error:", error);
        throw error;
      }
      
      console.log("OAuth Redirect Initiated:", data);
    } catch (err) {
      console.error('auth callback failure (initiation):', err);
      showNotification({ type: 'ERROR', message: err.message || 'Google login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = authMode === 'login' || isAdminLogin;

  // 4. CONDITIONAL RENDER AT THE END (AFTER ALL HOOKS)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="animate-pulse text-blue-500 font-black tracking-widest uppercase">Initializing...</div>
      </div>
    );
  }

  // Guard: never render auth UI when user is already logged in
  // AuthContext redirect effect handles the navigation
  if (user) return null;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0f1115] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-5%] w-full max-w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-full max-w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 opacity-30"></div>

      {/* Left Branding */}
      <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-between relative z-10 lg:border-r border-white/5 bg-[#131722]/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl">FX</div>
          <span className="text-3xl font-black text-white">Forex<span className="text-blue-500">Pro</span></span>
        </div>

        <div className="space-y-8 mt-12 lg:mt-0">
          <h1 className="text-4xl lg:text-7xl font-black leading-tight text-white">
            {isLogin ? <>Welcome <span className="text-blue-600">Back.</span></> : <>Join the <span className="text-blue-600">Elite.</span></>}
          </h1>
          <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
            Access institutional grade liquidity and precision execution in real-time.
          </p>
        </div>

        <div className="hidden lg:block text-xs text-gray-400 font-bold uppercase tracking-widest">
          © 2024 ForexPro Institutional Terminal
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-20 relative z-10">
        <div className="w-full max-w-sm space-y-8">
          {!isAdminLogin && (
            <div className="flex bg-[#131722] p-1.5 rounded-2xl border border-white/5">
               <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 text-xs font-black uppercase rounded-xl ${isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>LOGIN</button>
               <button onClick={() => setAuthMode('signup')} className={`flex-1 py-3 text-xs font-black uppercase rounded-xl ${!isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>SIGNUP</button>
            </div>
          )}

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-2xl lg:text-4xl font-black text-white">{isLogin ? 'Login to Terminal' : 'Create Account'}</h2>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em]">{isLogin ? 'Access your dashboard' : 'Institutional registration'}</p>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            {!isLogin && (
              <div className="space-y-2 group">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest group-focus-within:text-blue-500 transition-colors">Full Identification</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Legal Name" 
                  required 
                  className="input-field bg-[#131722] py-4 w-full focus:border-blue-600/50 transition-all" 
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Authorized Email</label>
              <input name="login_id" type="email" placeholder="Enter Email" required className="input-field bg-[#131722] py-4 w-full" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Keyphrase</label>
              <input name="login_key" type="password" placeholder="Enter Password" required className="input-field bg-[#131722] py-4 w-full" />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-5 text-sm btn-glow">
              {isLoading ? 'PROCESSING...' : (isLogin ? 'ENTER TERMINAL' : 'CREATE ACCOUNT')}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-[#0f1115] px-2 text-gray-500 font-bold tracking-widest">Or continue with</span></div>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleLogin} 
              disabled={isLoading}
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span>Google Terminal</span>
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 font-medium">
            {isLogin ? <>Administrator? <a href="#admin-login" className="text-blue-500 font-bold hover:underline">Admin Command</a></> : <>Already have an account? <button onClick={() => setAuthMode('login')} className="text-blue-500 font-bold bg-transparent border-none p-0">Log In</button></>}
          </p>
        </div>
      </div>
    </div>
  );
}
