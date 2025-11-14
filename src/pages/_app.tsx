// src/pages/_app.tsx
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/AppLayout";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Only run after component is mounted (client-side only)
    setIsChecked(true);
  }, []);

  useEffect(() => {
    if (!isChecked) return; // Wait until mounted

    // Check authentication status
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn');
      
      // Public routes that don't require authentication
      const publicRoutes = ['/login'];
      const isPublicRoute = publicRoutes.includes(router.pathname);

      if (!loggedIn && !isPublicRoute) {
        // Not logged in and trying to access protected route
        router.push('/login');
      } else if (loggedIn === 'true' && router.pathname === '/login') {
        // Already logged in and trying to access login page
        // Redirect to HOME first (not konsumsi)
        router.push('/');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router, isChecked]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 dark:from-slate-900 dark:via-violet-950 dark:to-fuchsia-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Memuat...</p>
        </div>
      </div>
    );
  }

  // Render login page without AppLayout
  if (router.pathname === '/login') {
    return (
      <>
        <Component {...pageProps} />
        <Toaster />
      </>
    );
  }

  // Render protected pages with AppLayout
  return (
    <>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
      <Toaster />
    </>
  );
}

