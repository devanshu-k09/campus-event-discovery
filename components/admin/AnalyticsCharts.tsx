"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from "framer-motion";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label, prefix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-slate-900 dark:text-white">
          {prefix}{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function AnalyticsCharts({ 
  revenueData, 
  categoryData 
}: { 
  revenueData: any[], 
  categoryData: any[] 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[2rem]" />
        <div className="h-[400px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Revenue Trend */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-[#111827] p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <Link href="/admin/analytics" className="flex items-center justify-between mb-8 group/header">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover/header:text-indigo-600 transition-colors">Revenue Growth</h3>
            <p className="text-sm font-medium text-slate-500">Monthly earnings overview</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-600/10 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400">
            Real-time
          </div>
        </Link>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6366f1" strokeOpacity={0.05} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip prefix="₹" />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorRev)" 
                animationBegin={500}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category Distribution */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-[#111827] p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col"
      >
        <Link href="/admin/analytics" className="mb-8 group/header">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover/header:text-indigo-600 transition-colors">Event Categories</h3>
          <p className="text-sm font-medium text-slate-500">Distribution by type</p>
        </Link>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={800}
                  animationDuration={1500}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-6">
            {categoryData.slice(0, 4).map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bookings Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="lg:col-span-2 bg-white dark:bg-[#111827] p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <Link href="/admin/analytics" className="flex items-center justify-between mb-8 group/header">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover/header:text-indigo-600 transition-colors">Registration Volume</h3>
            <p className="text-sm font-medium text-slate-500">Ticket bookings over time</p>
          </div>
        </Link>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6366f1" strokeOpacity={0.05} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#6366f1', fillOpacity: 0.03 }} />
              <Bar 
                dataKey="bookings" 
                fill="#6366f1" 
                radius={[8, 8, 0, 0]} 
                barSize={45}
                animationBegin={1000}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
