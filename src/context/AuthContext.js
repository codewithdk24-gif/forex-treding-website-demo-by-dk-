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
  const lastRefreshTime = useRef(0);
  const lastUserId = useRef(null);

  // Centralized Data Fetcher with Mutex/Guard
  const refreshUserData = useCallback(async (userId, force = false) => {
    if (!userId) return;
    
    // Throttle refreshes to prevent lock storms (debounce 2s unless forced)
    const now = Date.now();
    if (!force && isRefreshing.current && (now - lastRefreshTime.current < 2000)) {
      return;
    }

    try {
      isRefreshing.current = true;
      console.log(`[INFRA] Refreshing user data for: ${userId}`);
      
      const [profileData, walletData] = await Promise.all([
        db.getProfile(userId),
        db.getActiveWallet(userId, 'demo')
      ]);

      setProfile(profileData);
      setWallet(walletData);
      lastUserId.current = userId;
      lastRefreshTime.current = Date.now();
    } catch (err) {
      console.error('[INFRA] Data Refresh Error:', err.message);
    } finally {
      isRefreshing.current = false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        console.log("[INFRA] Initializing Auth Singleton...");
        
        // Single call to get session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user && mounted) {
          setUser(session.user);
          await refreshUserData(session.user.id, true);
        }
      } catch (err) {
        console.error('[INFRA] Auth Init Error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
          setIsReady(true);
        }
      }
    }

    init();

    // Singleton listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      console.log(`[INFRA] Auth State Event: ${event}`);

      const sessionUser = session?.user ?? null;
      
      if (sessionUser?.id !== lastUserId.current || event === 'SIGNED_IN') {
        setUser(sessionUser);
        if (sessionUser) {
          await refreshUserData(sessionUser.id, true);
        } else {
          setProfile(null);
          setWallet(null);
          lastUserId.current = null;
        }
      }

      setLoading(false);
      setIsReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshUserData]);

  // Route Guard Logic
  useEffect(() => {
    if (!isReady) return;

    const publicRoutes = ["/", "/auth", "/auth/callback"];
    const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith('/auth/callback'));
    
    if (!user && !isPublic) {
      console.log("[INFRA] Unauthorized access to private route, redirecting...");
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
    console.log("[INFRA] Initiating Sign Out Flow...");
    try {
      setLoading(true);
      // We attempt to sign out from Supabase, but we don't let a network failure block local logout
      await supabase.auth.signOut().catch(err => {
        console.warn("[INFRA] Supabase SignOut Warning (continuing local logout):", err.message);
      });
      
      console.log("[INFRA] Clearing local auth session...");
      setUser(null);
      setProfile(null);
      setWallet(null);
      lastUserId.current = null;
      
      // Use push instead of replace to ensure history is cleared and redirect is absolute
      await router.push('/auth');
      console.log("[INFRA] Sign Out Complete - Redirected to Auth");
    } catch (err) {
      console.error('[INFRA] Critical SignOut Error:', err.message);
      // Emergency state clearing
      setUser(null);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      wallet, 
      isReady, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      refreshUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
