'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import { db } from '@/lib/db';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isRefreshing = useRef(false);
  const lastUserId = useRef(null);

  const refreshUserData = useCallback(async (userId) => {
    // Prevent duplicate concurrent refreshes or redundant refreshes for same user
    if (isRefreshing.current) return;
    
    try {
      isRefreshing.current = true;
      
      const [profileData, walletData] = await Promise.all([
        db.getProfile(userId),
        db.getActiveWallet(userId, 'demo')
      ]);

      console.log(`[AuthContext] Refresh Success: Profile=${!!profileData}, Wallet Balance=$${walletData?.balance || 0}`);

      setProfile(profileData);
      setWallet(walletData);
      lastUserId.current = userId;
    } catch (err) {
      console.error('Data Refresh Error:', err.message);
    } finally {
      isRefreshing.current = false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user && mounted) {
          setUser(session.user);
          await refreshUserData(session.user.id);
        }
      } catch (err) {
        console.error('Auth Init Error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
          setIsReady(true);
        }
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      const sessionUser = session?.user ?? null;
      
      // Only refresh if user changed or explicitly signed in
      if (sessionUser?.id !== lastUserId.current || event === 'SIGNED_IN') {
        setUser(sessionUser);
        if (sessionUser) {
          await refreshUserData(sessionUser.id);
        } else {
          setProfile(null);
          setWallet(null);
          lastUserId.current = null;
        }
      }

      setLoading(false);
      setIsReady(true);
    });

    // SAFETY TIMEOUT: Ensure we never stay stuck in loading forever
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Auth initialization safety timeout triggered. Force-clearing loading state.");
        setIsReady(true);
        setLoading(false);
      }
    }, 10000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const publicRoutes = ["/", "/auth", "/auth/callback"];
    const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith('/auth/callback'));
    
    if (!user && !isPublic) {
      router.replace("/auth");
    } else if (user && pathname === "/auth") {
      router.replace("/dashboard");
    }

  }, [user, isReady, pathname, router]);

  const signUp = async (email, password, options = {}) => {
    return await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: {
        ...options,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim()
    });
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      
      // Clear local state
      setUser(null);
      setProfile(null);
      setWallet(null);
      
      router.replace('/auth');
    } catch (err) {
      console.error('SignOut Error:', err.message);
      // Fallback: force state clear even if Supabase fails
      setUser(null);
      router.replace('/auth');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, wallet, isReady, loading, signIn, signUp, signOut, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
