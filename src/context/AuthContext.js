'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';

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
  const pendingRequest = useRef(null);

  // Centralized Data Fetcher with Strict Mutex and Deduplication
  const refreshUserData = useCallback(async (userId, force = false) => {
    if (!userId) return;
    
    // Deduplication: If a request is already in flight, return that promise
    if (pendingRequest.current) {
      console.log(`[INFRA] refreshUserData: Attaching to existing request for ${userId}`);
      return pendingRequest.current;
    }

    // Debounce: Prevent rapid sequential calls unless forced
    const now = Date.now();
    if (!force && (now - lastRefreshTime.current < 5000)) {
      console.log(`[INFRA] refreshUserData throttled: Too soon for ${userId}`);
      return;
    }

    const fetchTask = (async () => {
      let retryCount = 0;
      const maxRetries = 1;

      while (retryCount <= maxRetries) {
        try {
          isRefreshing.current = true;
          console.log(`[INFRA] Syncing profile for: ${userId} (Attempt ${retryCount + 1})`);
          const startTime = Date.now();
          
          const profileData = await db.getProfile(userId);
          
          console.log(`[INFRA] Profile Sync Complete in ${Date.now() - startTime}ms`);

          // Institutional Fallback: If DB profile isn't ready yet, use Auth Metadata
          const augmentedProfile = profileData || {
            id: userId,
            full_name: (user?.user_metadata?.full_name) || (supabase.auth.getUser()?.data?.user?.user_metadata?.full_name) || 'Trader',
            email: user?.email || (supabase.auth.getUser()?.data?.user?.email)
          };

          setProfile(augmentedProfile);
          
          if (!profileData) {
            console.warn(`[INFRA] No profile record found for ${userId}, using metadata fallback.`);
          }
          
          // Sync Wallet in Zustand Store
          const { syncWallet } = useStore.getState();
          await syncWallet(userId).catch(err => {
            console.error("[INFRA] Wallet Sync Failed:", err.message);
          });

          lastUserId.current = userId;
          lastRefreshTime.current = Date.now();
          return profileData;
        } catch (err) {
          console.error(`[INFRA] Profile Sync Error (Attempt ${retryCount + 1}):`, err.message);
          
          // Timeout Retry Logic
          if (err.message.includes('Timeout') && retryCount < maxRetries) {
            retryCount++;
            console.log(`[INFRA] Retrying profile sync (${retryCount}/${maxRetries})...`);
            await new Promise(r => setTimeout(r, 1500)); // Exponential backoff-ish delay
            continue;
          }
          break;
        }
      }
      return null;
    })();

    pendingRequest.current = fetchTask;

    try {
      return await fetchTask;
    } finally {
      pendingRequest.current = null;
      isRefreshing.current = false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        console.log("[INFRA] Initializing Auth Singleton...");
        const startTime = Date.now();
        
        // Single call to get session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (error.message?.includes('Refresh Token Not Found') || error.status === 400) {
            console.warn("[INFRA] Stale session detected, clearing local storage...");
            await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
          } else {
            throw error;
          }
        }
        
        console.log(`[INFRA] session check complete in ${Date.now() - startTime}ms`);
        
        if (session?.user && mounted) {
          setUser(session.user);
          await refreshUserData(session.user.id, true);
        }
      } catch (err) {
        // Suppress known noisy auth errors to keep terminal clean
        if (!err.message?.includes('Refresh Token Not Found')) {
          console.error('[INFRA] Auth Init Error:', err);
        }
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
      
      // Strict Sync logic:
      // 1. User ID changed (or new user logged in)
      // 2. Explicit sign-in event occurred and we don't have a user state yet
      // 3. Page refresh (INITIAL_SESSION) and we haven't synced profile yet
      const isNewUser = sessionUser?.id && (sessionUser.id !== lastUserId.current);
      const isSignIn = (event === 'SIGNED_IN' && !user);
      const isInitialSync = (event === 'INITIAL_SESSION' && !profile && sessionUser);

      if (isNewUser || isSignIn || isInitialSync) {
        console.log(`[INFRA] Auth state trigger refresh [Event: ${event}] for: ${sessionUser?.id}`);
        setUser(sessionUser);
        if (sessionUser) {
          // We don't need await here as refreshUserData handles its own mutex
          refreshUserData(sessionUser.id, event === 'SIGNED_IN');
        }
      } else if (!sessionUser && lastUserId.current) {
        // Handle Logout
        console.log("[INFRA] Auth state trigger logout cleanup");
        setUser(null);
        setProfile(null);
        setWallet(null);
        lastUserId.current = null;
        useStore.getState().setConnectionStatus('OFFLINE');
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
