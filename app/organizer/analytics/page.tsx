'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, Calendar, BarChart3, Settings, CalendarCheck, Loader2 } from 'lucide-react';
import { getOrganizerDashboardStats } from '@/app/actions/event';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function OrganizerAnalytics() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await getOrganizerDashboardStats();
            if (res.success) {
                setStats(res.data);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6f6f8] dark:bg-[#101122]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const chartData = stats?.recentEvents?.map((event: any) => ({
        name: event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title,
        tickets: event.ticketsSold,
        capacity: event.capacity
    })) || [];

    return (
        <div className="min-h-screen flex bg-[#f6f6f8] dark:bg-[#101122] font-display text-slate-900 dark:text-slate-100">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101122] flex flex-col fixed h-full transition-colors duration-300 z-20">
                <Link href="/" className="p-6 flex items-center gap-2 group cursor-pointer">
                    <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                        <CalendarCheck className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Campus<span className="text-primary">Pulse</span>
                    </span>
                </Link>

                <nav className="flex-1 px-4 mt-4 space-y-1">
                    <Link href="/organizer/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all group">
                        <LayoutDashboard className="w-5 h-5 group-hover:text-primary" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="/hosted-events" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all group">
                        <Calendar className="w-5 h-5 group-hover:text-primary" />
                        <span className="font-medium">My Events</span>
                    </Link>
                    <Link href="/organizer/analytics" className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg transition-all">
                        <BarChart3 className="w-5 h-5" />
                        <span className="font-medium">Analytics</span>
                    </Link>
                </nav>

                <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                    <Link href="/profile" className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                        <div className="relative w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 overflow-hidden bg-slate-200">
                            {session?.user?.image && (
                                <Image src={session.user.image} alt="User Profile" fill className="object-cover" />
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{session?.user?.name || 'Organizer'}</p>
                            <p className="text-xs text-slate-500 truncate italic">Host Account</p>
                        </div>
                        <Settings className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Performance Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed insights into your event performance and ticket sales.</p>
                </header>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-6">Tickets Sold per Event</h2>
                    {chartData.length > 0 ? (
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis dataKey="name" tick={{fill: '#888888'}} />
                                    <YAxis tick={{fill: '#888888'}} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="tickets" fill="#6366f1" radius={[4, 4, 0, 0]} name="Tickets Sold" />
                                    <Bar dataKey="capacity" fill="#94a3b8" opacity={0.3} radius={[4, 4, 0, 0]} name="Total Capacity" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[400px] flex items-center justify-center text-slate-500">
                            No events data available yet.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
