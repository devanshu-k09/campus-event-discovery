"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Search, Bell, Menu, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-6 flex-1">
        <button className="lg:hidden p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        
        <div className="relative max-w-md w-full hidden md:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Search for anything..."
            suppressHydrationWarning
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const q = (e.target as HTMLInputElement).value;
                if (q) router.push(`/admin/users?q=${encodeURIComponent(q)}`);
              }
            }}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />

        <button 
          suppressHydrationWarning
          className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group"
        >
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white dark:border-[#111827]"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl cursor-pointer transition-all group">
                <Avatar className="h-9 w-9 border-2 border-slate-100 dark:border-slate-800 group-hover:border-indigo-200 dark:group-hover:border-indigo-900 transition-all">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="bg-indigo-600 text-white font-bold">
                    {session?.user?.name?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{session?.user?.name || "Admin"}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{session?.user?.role || "Administrator"}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-slate-200 dark:border-slate-800 p-2 shadow-xl">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">My Account</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => router.push('/profile')}
                className="rounded-xl gap-2 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400"
              >
                <User className="w-4 h-4" />
                <span className="font-semibold">My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push('/admin/settings')}
                className="rounded-xl gap-2 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400"
              >
                <Settings className="w-4 h-4" />
                <span className="font-semibold">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="rounded-xl gap-2 cursor-pointer text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
        )}
      </div>
    </header>
  );
}
