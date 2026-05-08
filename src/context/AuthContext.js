'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      const sessionUser = data?.session?.user ?? null;

      setUser(sessionUser);
      setIsReady(true);
      setLoading(false);
    };

    init();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
        setIsReady(true);
        setLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const publicRoutes = ["/", "/auth"];
    const protectedRoutes = ["/dashboard", "/wallet", "/orders", "/markets"];

    // Check if the current path is protected
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    const isPublic = publicRoutes.includes(pathname);

    // 1. If NOT authenticated and trying to access a PROTECTED route -> redirect to /auth
    if (!user && isProtected) {
      router.replace("/auth");
      return;
    }

    // 2. If authenticated and trying to access /auth -> redirect to /dashboard
    if (user && pathname === "/auth") {
      router.replace("/dashboard");
      return;
    }

  }, [user, isReady, pathname, router]);

  const signUp = async (email, password, options = {}) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      console.log("STEP: AuthContext signUp Attempt", { email: cleanEmail });
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        ...options
      });

      console.log("FULL SIGNUP RESPONSE:", { data, error });

      if (error) {
        console.error("SIGNUP ERROR DETAILS:", {
          message: error.message,
          status: error.status,
          name: error.name,
          fullError: error
        });
      }

      // If session null, trigger signIn
      if (data?.user && !data?.session && !error) {
        console.log("STEP: signUp success but session null, attempting auto-signIn...");
        return await signIn(email, password);
      }

      return { data, error };
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      console.log("STEP: AuthContext signIn Attempt", { email: cleanEmail });
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      console.log("FULL LOGIN RESPONSE:", { data, error });

      if (error) {
        console.error("LOGIN ERROR DETAILS:", {
          message: error.message,
          status: error.status,
          fullError: error
        });
      }

      return { data, error };
    } catch (err) {
      console.error("CRITICAL LOGIN ERROR:", err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/auth');
    } catch (err) {
      console.error('STEP: AuthContext signOut Error', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isReady, loading, signIn, signUp, signOut }}>
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
