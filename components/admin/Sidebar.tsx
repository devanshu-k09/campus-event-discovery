"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  AlertCircle, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Calendar, label: "Events", href: "/admin/events" },
  { icon: CreditCard, label: "Bookings", href: "/admin/bookings" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: AlertCircle, label: "Reports", href: "/admin/reports" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="relative flex flex-col h-screen bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 transition-colors duration-300 z-40"
    >
      {/* Logo Section */}
      <Link href="/" className="p-6 flex items-center justify-between overflow-hidden whitespace-nowrap hover:opacity-80 transition-opacity">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Campus<span className="text-indigo-600">Pulse</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCollapsed && (
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 mx-auto">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        )}
      </Link>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        suppressHydrationWarning
        className="absolute -right-3 top-20 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-md text-slate-500 hover:text-indigo-600 transition-all z-50"
      >
        {isCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
              )}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
              </div>
              
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-semibold text-sm tracking-wide"
                >
                  {item.label}
                </motion.span>
              )}

              {isActive && !isCollapsed && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                />
              )}

              {isActive && (
                <div className="absolute inset-0 bg-indigo-600/5 dark:bg-indigo-600/5 rounded-xl blur-sm -z-10" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 mt-auto space-y-1.5 border-t border-slate-100 dark:border-slate-800">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="font-semibold text-sm">Settings</span>}
        </Link>
        
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          suppressHydrationWarning
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-semibold text-sm">Logout</span>}
        </button>
      </div>
    </motion.div>
  );
}
