"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import {
  Home,
  User,
  Users,
  Clock,
  Package,
  BookOpen,
  Link as LinkIcon,
  FileText,
  Circle,
  Layers,
  File,
  MapPin,
  Shield,
  ChevronDown
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  submenu?: MenuItem[];
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

interface AppSidebarProps {
  isCollapsed: boolean;
}

const menuData: MenuSection[] = [
  {
    section: "GENERALS",
    items: [
      { title: "Home", icon: Home, href: "/" },
      { title: "Profile", icon: User, href: "/profile" },
      { title: "Employment", icon: Users, href: "/employment" },
      { title: "Kehadiran, Koreksi, Cuti, dan Dinas", icon: Clock, href: "/attendance" },
    ],
  },
  {
    section: "MAIN MENU",
    items: [
      { title: "Portal Aplikasi", icon: Package, href: "/portal" },
      { title: "Library", icon: BookOpen, href: "/library" },
      { title: "Shortlink", icon: LinkIcon, href: "/shortlink" },
    ],
  },
  {
    section: "APPS & FEATURES",
    items: [
      { title: "E-Prosedur", icon: FileText, href: "/e-prosedur" },
      { title: "Employee Directory", icon: Users, href: "/directory" },
      { title: "SIADIL", icon: File, href: "/siadil" },
      { title: "SYSTIK", icon: Circle, href: "/systik" },
      { title: "Konsumsi", icon: Layers, href: "/konsumsi" },
      { title: "Dokumentu", icon: File, href: "/dokumentu" },
      { title: "MyStatement", icon: FileText, href: "/mystatement" },
      { title: "Work Area", icon: MapPin, href: "/work-area" },
      { title: "Peraturan Perundangan", icon: Shield, href: "/peraturan" },
    ],
  },
];

export function AppSidebar({ isCollapsed }: AppSidebarProps) {
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  
  // State untuk user data dari localStorage
  const [userData, setUserData] = useState({
    name: 'User',
    username: 'user',
    role: 'user'
  });

  // Load user data dari localStorage saat component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('name');
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      
      if (name || username) {
        setUserData({
          name: name || username || 'User',
          username: username || 'user',
          role: role || 'user'
        });
      }
    }
  }, []);
  
  // Generate initials dari nama
  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col shadow-2xl border-r border-slate-200 dark:border-slate-800",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        {isCollapsed ? (
          <div className="w-8 h-8 flex items-center justify-center mx-auto">
            <Image
              src="/demplon-logo.png"
              alt="D"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image
                src="/demplon-logo.png"
                alt="DEMPLON"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">DEMPLON</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">v1.0.0</p>
            </div>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        {isCollapsed ? (
          <div className="flex justify-center">
            <Avatar className="h-10 w-10 border-2 border-violet-200 dark:border-violet-700">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xs">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-violet-200 dark:border-violet-700">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{userData.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userData.username}</p>
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {menuData.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-2">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx}>
                  {item.submenu ? (
                    <div>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => toggleMenu(item.title)}
                              className={cn(
                                "w-full flex items-center justify-center px-3 py-2.5 rounded-lg transition-all text-slate-700 dark:text-slate-200",
                                "hover:bg-slate-100 dark:hover:bg-slate-800",
                                expandedMenus.includes(item.title) && "bg-slate-100 dark:bg-slate-800"
                              )}
                            >
                              <item.icon className="h-5 w-5 flex-shrink-0" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{item.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <button
                          onClick={() => toggleMenu(item.title)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-slate-700 dark:text-slate-200",
                            "hover:bg-slate-100 dark:hover:bg-slate-800",
                            expandedMenus.includes(item.title) && "bg-slate-100 dark:bg-slate-800"
                          )}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="flex-1 text-left text-sm font-medium">
                            {item.title}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              expandedMenus.includes(item.title) && "rotate-180"
                            )}
                          />
                        </button>
                      )}
                      {expandedMenus.includes(item.title) && !isCollapsed && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.submenu.map((subItem, subIdx) => (
                            <Link key={subIdx} href={subItem.href || "#"}>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                <subItem.icon className="h-4 w-4" />
                                <span>{subItem.title}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={item.href || "#"}>
                            <div
                              className={cn(
                                "flex items-center justify-center px-3 py-2.5 rounded-lg transition-all text-slate-700 dark:text-slate-200",
                                "hover:bg-slate-100 dark:hover:bg-slate-800",
                                router.pathname === item.href && "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg"
                              )}
                            >
                              <item.icon className="h-5 w-5 flex-shrink-0" />
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link href={item.href || "#"}>
                        <div
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-slate-700 dark:text-slate-200",
                            "hover:bg-slate-100 dark:hover:bg-slate-800",
                            router.pathname === item.href && "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg"
                          )}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
    </TooltipProvider>
  );
}
