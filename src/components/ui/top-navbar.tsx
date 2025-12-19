"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Menu, LogOut, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavbarProps {
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function TopNavbar({ isCollapsed = false, onToggleSidebar }: TopNavbarProps) {
  const router = useRouter();
  const [username, setUsername] = useState<string>("User");
  const [pendingCount, setPendingCount] = useState<number>(0);

  // Fungsi untuk mengambil jumlah pesanan berstatus 'Pending'
  const checkPendingOrders = useCallback(async () => {
    const savedUsername = localStorage.getItem('username');
    if (!savedUsername) return;

    try {
      // Mengambil data dari API
      const res = await fetch(`/api/orders?username=${encodeURIComponent(savedUsername)}&role=approver`);
      if (res.ok) {
        const data = await res.json();
        const pending = data.filter((o: any) => o.status === 'Pending').length;
        setPendingCount(pending);
      }
    } catch (error) {
      console.error("Gagal memuat jumlah notifikasi:", error);
    }
  }, []);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) setUsername(savedUsername);

    // Jalankan pengecekan jika di halaman approver
    if (router.pathname.startsWith('/approver')) {
      checkPendingOrders();
    }

    // MENDENGARKAN SINYAL REFRESH DARI HALAMAN DASHBOARD
    const handleRefresh = () => {
      checkPendingOrders();
    };

    window.addEventListener('refresh-pending-count', handleRefresh);
    return () => window.removeEventListener('refresh-pending-count', handleRefresh);
  }, [router.pathname, checkPendingOrders]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav 
      className="fixed top-0 right-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300" 
      style={{ left: isCollapsed ? '64px' : '256px' }}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-3">
          {/* ikon lonceng */}
          {router.pathname.startsWith('/approver') && (
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-800 rounded-full transition-all"
            >
              <motion.div
                animate={pendingCount > 0 ? { rotate: [0, -15, 15, -15, 15, 0] } : {}}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Bell className="h-5 w-5" />
              </motion.div>

              {pendingCount > 0 && (
                <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border border-white dark:border-slate-900"></span>
                </span>
              )}
            </Button>
          )}

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{username}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">Online</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer border-2 border-violet-200 dark:border-violet-700 hover:border-violet-400 dark:hover:border-violet-500 transition-colors">
                <AvatarImage src="/placeholder-user.jpg" alt={username} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-sm font-semibold">
                  {getInitials(username)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold">{username}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">DEMPLON User</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}