import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (isLoggedIn !== 'true') {
            // Redirect to login if not authenticated
            router.push('/login');
        }
    }, [router]);

    // Check authentication status
    const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem('isLoggedIn') : null;

    if (isLoggedIn !== 'true') {
        // Show loading while redirecting
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 dark:from-slate-900 dark:via-violet-950 dark:to-fuchsia-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Memuat...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
