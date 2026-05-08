'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("auth callback start: Processing OAuth redirect params");
      
      try {
        // Supabase client automatically picks up the 'code' or 'access_token' from the URL
        const { data, error } = await supabase.auth.getSession();
        
        console.log("session status:", data?.session ? "Authenticated" : "No Session");

        if (error) {
          console.error("auth callback failure:", error.message);
          router.push('/auth?error=callback_failed');
          return;
        }

        if (data?.session) {
          console.log("auth callback success: Session established for", data.session.user.email);
          
          // Small delay to ensure AuthContext and other providers have processed the session
          setTimeout(() => {
            router.replace('/dashboard');
          }, 500);
        } else {
          // If no session yet, we might still be in the middle of a process or it failed
          console.warn("auth callback failure: No session found after exchange");
          
          // Check if there are error parameters in the URL
          const params = new URLSearchParams(window.location.search);
          if (params.get('error')) {
             console.error("OAuth Error from URL:", params.get('error_description'));
          }
          
          router.push('/auth?error=no_session');
        }
      } catch (err) {
        console.error("auth callback failure: Unexpected error", err);
        router.push('/auth?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center space-y-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-600/10 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] animate-pulse">Establishing Secure Link</h2>
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Handshaking with Authorization Server...</p>
      </div>
    </div>
  );
}
