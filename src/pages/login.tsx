"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, User, LogIn, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Konfeti Component (sama seperti di konsumsi)
const ConfettiPiece: React.FC = () => {
    const colors = ['#8b5cf6', '#a78bfa', '#d946ef', '#f472b6', '#fb7185', '#ec4899', '#f59e0b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomXStart = Math.random() * 100;
    const randomXEnd = randomXStart + (-20 + Math.random() * 40);
    const randomDelay = Math.random() * 2;
    const randomDuration = 2 + Math.random() * 3;
    const randomRotationStart = Math.random() * 360;
    const randomRotationEnd = randomRotationStart + (-360 + Math.random() * 720);

    return (
        <motion.div
            className="absolute top-0 w-2 h-4"
            style={{ left: `${randomXStart}vw`, background: randomColor, borderRadius: '4px' }}
            initial={{ y: '-10vh', rotate: randomRotationStart, opacity: 1 }}
            animate={{
                y: '110vh',
                x: [`${randomXStart}vw`, `${randomXEnd}vw`],
                rotate: randomRotationEnd,
            }}
            transition={{
                duration: randomDuration,
                delay: randomDelay,
                ease: "linear",
            }}
        />
    );
};

const ConfettiCanvas = () => (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden'
    }}>
        {Array.from({ length: 100 }).map((_, i) => <ConfettiPiece key={i} />)}
    </div>
);

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showConfetti, setShowConfetti] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validasi input
        if (!username || !password) {
            setError("Username dan password harus diisi");
            return;
        }

        setIsLoading(true);

        try {
            // Call API login
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success && data.user) {
                // Simpan status login ke localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('name', data.user.name);
                localStorage.setItem('role', data.user.role);
                
                // Tampilkan konfeti
                setShowConfetti(true);
                
                // Redirect ke halaman HOME setelah 2 detik
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setError(data.error || 'Username atau password salah');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Terjadi kesalahan. Silakan coba lagi.');
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Login - DEMPLON</title>
                <meta name="description" content="Login ke DEMPLON - Portal Aplikasi Perusahaan" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {showConfetti && <ConfettiCanvas />}

            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 dark:from-slate-900 dark:via-violet-950 dark:to-fuchsia-950 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                            <div className="flex justify-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-xl"
                                >
                                    <Lock className="w-10 h-10 text-white" />
                                </motion.div>
                            </div>

                            <div className="space-y-2 text-center">
                                <CardTitle className="text-3xl font-bold">
                                    <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                                        Welcome Back
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Masuk ke <span className="font-semibold text-violet-600 dark:text-violet-400">KONSUMSI</span> untuk melanjutkan
                                </CardDescription>
                            </div>

                               
                          

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                                    >
                                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                    </motion.div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Username
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Masukkan username Anda"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="pl-10 h-12 border-2 focus:border-violet-500 dark:focus:border-violet-500 transition-colors"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Masukkan password Anda"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 pr-10 h-12 border-2 focus:border-violet-500 dark:focus:border-violet-500 transition-colors"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                        />
                                        <span className="text-slate-600 dark:text-slate-400">Ingatkan saya</span>
                                    </label>
                                    <button
                                        type="button"
                                        className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                                    >
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className={cn(
                                        "w-full h-12 text-base font-semibold transition-all duration-300",
                                        "bg-gradient-to-r from-violet-600 to-fuchsia-600",
                                        "hover:from-violet-700 hover:to-fuchsia-700",
                                        "text-white shadow-lg hover:shadow-xl",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        "transform hover:scale-[1.02] active:scale-[0.98]"
                                    )}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <LogIn className="h-5 w-5" />
                                            </motion.div>
                                            <span>Sedang masuk...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <LogIn className="h-5 w-5" />
                                            <span>Masuk</span>
                                        </div>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    <button className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-semibold transition-colors">
                                    </button>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 space-y-2"
                    >
                        <p>© 2025 DEMPLON. All rights reserved.</p>
                        {/* Debug Button - Remove in production */}
                        <button
                            onClick={() => {
                                localStorage.clear();
                                console.log('✅ localStorage cleared');
                                window.location.reload();
                            }}
                            className="text-xs text-red-500 hover:text-red-600 underline"
                        >
                            Clear Session & Reload (Debug)
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}
