import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    login: (username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check localStorage for existing session
        const loggedIn = localStorage.getItem('isLoggedIn');
        const savedUsername = localStorage.getItem('username');

        if (loggedIn === 'true' && savedUsername) {
            setIsAuthenticated(true);
            setUsername(savedUsername);
        }
        setIsLoading(false);
    }, []);

    const login = (username: string) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        setIsAuthenticated(true);
        setUsername(username);
    };

    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUsername(null);
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
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
