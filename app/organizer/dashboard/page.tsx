'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
    Rocket, LayoutDashboard, Calendar, BarChart3, Users, UserCog, Settings,
    Plus, Ticket, Zap, DollarSign, TrendingUp, Code, Palette, PartyPopper, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOrganizerDashboardStats } from '@/app/actions/event';

export default function OrganizerDashboard() {
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

    return (
        <div className="min-h-screen flex bg-[#f6f6f8] dark:bg-[#101122] font-display text-slate-900 dark:text-slate-100">

            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101122] flex flex-col fixed h-full transition-colors duration-300 z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">EventHub</span>
                </div>

                <nav className="flex-1 px-4 mt-4 space-y-1">
                    <Link href="/organizer/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg transition-all">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all group">
                        <Calendar className="w-5 h-5 group-hover:text-primary" />
                        <span className="font-medium">My Events</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all group">
                        <BarChart3 className="w-5 h-5 group-hover:text-primary" />
                        <span className="font-medium">Analytics</span>
                    </Link>
                </nav>

                <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <div className="relative w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 overflow-hidden bg-slate-200">
                            {session?.user?.image && (
                                <Image
                                    src={session.user.image}
                                    alt="User Profile"
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold truncate">{session?.user?.name || 'Organizer'}</p>
                            <p className="text-xs text-slate-500 truncate italic">Host Account</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <header className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Good morning, {session?.user?.name?.split(' ')[0] || 'Host'}! 👋</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your campus events today.</p>
                    </div>
                    <Link href="/create-event">
                        <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all text-base">
                            <Plus className="w-5 h-5" />
                            Create New Event
                        </Button>
                    </Link>
                </header>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Tickets Sold */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Tickets Sold</p>
                                <h3 className="text-3xl font-bold mt-1">{stats?.totalTicketsSold || 0}</h3>
                            </div>
                            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                <Ticket className="w-6 h-6" />
                            </div>
                        </div>
                        {/* Mini Sparkline CSS Representation */}
                        <div className="h-10 w-full mt-2 flex items-end gap-1">
                            <div className="bg-primary/40 h-1/2 w-full rounded-t-sm"></div>
                            <div className="bg-primary/40 h-2/3 w-full rounded-t-sm"></div>
                            <div className="bg-primary/40 h-3/4 w-full rounded-t-sm"></div>
                            <div className="bg-primary/40 h-1/2 w-full rounded-t-sm"></div>
                            <div className="bg-primary/40 h-4/5 w-full rounded-t-sm"></div>
                            <div className="bg-primary/40 h-1/3 w-full rounded-t-sm"></div>
                            <div className="bg-primary h-full w-full rounded-t-sm"></div>
                        </div>
                    </div>

                    {/* Active Events */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Events</p>
                                <h3 className="text-3xl font-bold mt-1">{stats?.activeEventsCount || 0}</h3>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg">
                                <Zap className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Live on platform
                        </p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Revenue</p>
                                <h3 className="text-3xl font-bold mt-1">${stats?.totalRevenue?.toLocaleString() || 0}</h3>
                            </div>
                            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-2 rounded-lg">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">Processing for next payout...</p>
                    </div>
                </div>

                {/* Recent Events Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Recent Events</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Event Name</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Tickets Sold</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {stats?.recentEvents?.map((event: any) => {
                                    const percentFilled = event.capacity > 0 ? Math.min(100, Math.round((event.ticketsSold / event.capacity) * 100)) : 0;
                                    return (
                                        <tr key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{event.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                    event.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                                    event.status === 'draft' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
                                                    'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                                }`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-full max-w-[150px]">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="font-medium text-slate-900 dark:text-slate-200">{event.ticketsSold} / {event.capacity}</span>
                                                        <span className="text-slate-400">{percentFilled}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${percentFilled}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                {new Date(event.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/organizer/events/${event.id}`}>
                                                    <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold transition-colors text-slate-700 dark:text-slate-300">
                                                        Manage
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {stats?.recentEvents?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No events found. Start by creating your first event!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
