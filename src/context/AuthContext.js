'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Initial Session Check
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('[AuthContext] Init Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthContext] State Change:', event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // 3. Navigation Guard (Simplified)
  useEffect(() => {
    if (loading) return;

    const publicRoutes = ['/auth', '/'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Redirect to login if not authenticated and trying to access private route
    if (!user && !isPublicRoute) {
      console.log('[AuthContext] Guard: Redirecting to /auth');
      router.push('/auth');
    }
    
    // Redirect to dashboard if authenticated and trying to access login page
    if (user && pathname === '/auth') {
      console.log('[AuthContext] Guard: Redirecting to /dashboard');
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  // Robust Auth Methods
  const signUp = async (email, password, options = {}) => {
    console.log('[AuthContext] signUp triggered for:', email);
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: options.options || options // Support nested or flat options
      });
      console.log('[AuthContext] signUp response:', response);
      return response;
    } catch (err) {
      console.error('[AuthContext] signUp Exception:', err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    console.log('[AuthContext] signIn triggered for:', email);
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      console.log('[AuthContext] signIn response:', response);
      return response;
    } catch (err) {
      console.error('[AuthContext] signIn Exception:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      router.push('/auth');
    } catch (err) {
      console.error('[AuthContext] signOut Error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

