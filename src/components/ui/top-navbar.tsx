"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Menu, LogOut } from "lucide-react";
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

  useEffect(() => {
    // Load username from localStorage
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    
    // Redirect to login
    router.push('/login');
  };

  // Get initials from username
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav 
      className="fixed top-0 right-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300" 
      style={{ left: isCollapsed ? '64px' : '256px' }}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left Side - Hamburger Menu */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Right Side - User Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {username}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Online
            </span>
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
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                    DEMPLON User
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 cursor-pointer"
              >
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

