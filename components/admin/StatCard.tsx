"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Ticket, 
  IndianRupee,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const iconMap = {
  users: Users,
  calendar: Calendar,
  ticket: Ticket,
  rupee: IndianRupee,
  analytics: BarChart3
};

interface StatCardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof iconMap;
  trend: string;
  trendUp: boolean;
  color: "indigo" | "emerald" | "amber" | "rose";
  delay?: number;
  href?: string;
}

const colorConfig = {
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-600/10",
    icon: "text-indigo-600 dark:text-indigo-400",
    glow: "group-hover:shadow-indigo-500/20",
    accent: "bg-indigo-600",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-600/10",
    icon: "text-emerald-600 dark:text-emerald-400",
    glow: "group-hover:shadow-emerald-500/20",
    accent: "bg-emerald-600",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-600/10",
    icon: "text-amber-600 dark:text-amber-400",
    glow: "group-hover:shadow-amber-500/20",
    accent: "bg-amber-600",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-600/10",
    icon: "text-rose-600 dark:text-rose-400",
    glow: "group-hover:shadow-rose-500/20",
    accent: "bg-rose-600",
  },
};

export function StatCard({ title, value, iconName, trend, trendUp, color, delay = 0, href }: StatCardProps) {
  const config = colorConfig[color];
  const Icon = iconMap[iconName];

  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative bg-white dark:bg-[#111827] p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300",
        href && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-lg shadow-transparent",
          config.bg,
          config.glow
        )}>
          <Icon className={cn("w-6 h-6", config.icon)} />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
          trendUp 
            ? "bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400" 
            : "bg-rose-50 dark:bg-rose-600/10 text-rose-600 dark:text-rose-400"
        )}>
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
          <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>
      </div>

      {/* Sparkline decoration */}
      <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "65%" }}
          transition={{ duration: 1, delay: delay + 0.5 }}
          className={cn("h-full rounded-full", config.accent)}
        />
      </div>

      {/* Background glow effect on hover */}
      <div className={cn(
        "absolute -z-10 inset-0 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500",
        config.accent
      )} />
    </motion.div>
  );

  if (href) {
    return <Link href={href} className="block">{CardContent}</Link>;
  }

  return CardContent;
}
