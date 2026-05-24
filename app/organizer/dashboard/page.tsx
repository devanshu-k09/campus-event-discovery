'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Rocket, LayoutDashboard, Calendar, BarChart3, Users, UserCog, Settings,
    Plus, Ticket, Zap, DollarSign, TrendingUp, Code, Palette, PartyPopper
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrganizerDashboard() {
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
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg transition-all">
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
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all group">
                        <Users className="w-5 h-5 group-hover:text-primary" />
                        <span className="font-medium">Attendees</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all group">
                        <UserCog className="w-5 h-5 group-hover:text-primary" />
                        <span className="font-medium">Team</span>
                    </Link>
                </nav>

                <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <div className="relative w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 overflow-hidden">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_NLHNi_qvEsBEp8SsQMc5N53qzYH5iRRvllfyhEgpyhx3oiX8wVli2cXVBOQMjePFj9MWW3yd2B_gxMso0U9tIgRJ3RuMnWeqDODjllf8AKpothGff_MwDKTFJmwBPf3HfRFoBic0gJCVG8ym7sQgfwdwJiAo_RyU-hMZNbwdwWc34hnAW-ejYQiUB7OfKluoS1dDd61J_9Cd0EzqR0GymDdlDEPGPP0TF3Th1D1vMw11Z51L1QsmWFLFCfQ67bqn-f4g23c5_Gs0"
                                alt="User Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold truncate">Alex Rivera</p>
                            <p className="text-xs text-slate-500 truncate italic">Design Club Lead</p>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <header className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Good morning, Design Club! 👋</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your campus events today.</p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all text-base">
                        <Plus className="w-5 h-5" />
                        Create New Event
                    </Button>
                </header>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Tickets Sold */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Tickets Sold</p>
                                <h3 className="text-3xl font-bold mt-1">1,240</h3>
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
                                <h3 className="text-3xl font-bold mt-1">4</h3>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg">
                                <Zap className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            +2 from last month
                        </p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Revenue</p>
                                <h3 className="text-3xl font-bold mt-1">$3,450</h3>
                            </div>
                            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-2 rounded-lg">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">Processing for next payout...</p>
                    </div>
                </div>

                {/* Sales Chart Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold">Sales Performance</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Daily ticket sales across all active events</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Weekly</button>
                            <button className="px-4 py-1.5 text-sm font-medium bg-primary text-white rounded-full shadow-lg shadow-primary/20">Monthly</button>
                        </div>
                    </div>
                    <div className="relative h-[300px] w-full bg-slate-50/50 dark:bg-slate-800/20 rounded-lg p-4 flex flex-col justify-between">
                        {/* Abstract CSS Area Chart */}
                        <div className="absolute inset-x-8 inset-y-12 flex items-end gap-1 px-4">
                            <div className="flex-1 bg-primary/10 rounded-t-lg border-t-2 border-primary/40 h-[20%]"></div>
                            <div className="flex-1 bg-primary/15 rounded-t-lg border-t-2 border-primary/50 h-[35%]"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-lg border-t-2 border-primary/60 h-[30%]"></div>
                            <div className="flex-1 bg-primary/25 rounded-t-lg border-t-2 border-primary/70 h-[45%]"></div>
                            <div className="flex-1 bg-primary/30 rounded-t-lg border-t-2 border-primary/80 h-[60%]"></div>
                            <div className="flex-1 bg-primary/40 rounded-t-lg border-t-2 border-primary h-[85%]"></div>
                            <div className="flex-1 bg-primary/35 rounded-t-lg border-t-2 border-primary/90 h-[75%]"></div>
                            <div className="flex-1 bg-primary/25 rounded-t-lg border-t-2 border-primary/70 h-[55%]"></div>
                            <div className="flex-1 bg-primary/40 rounded-t-lg border-t-2 border-primary h-[90%]"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-lg border-t-2 border-primary/60 h-[40%]"></div>
                        </div>
                        {/* Chart Labels */}
                        <div className="flex justify-between text-xs text-slate-400 font-medium px-4 mt-auto z-10">
                            <span>Oct 01</span>
                            <span>Oct 08</span>
                            <span>Oct 15</span>
                            <span>Oct 22</span>
                            <span>Oct 31</span>
                        </div>
                    </div>
                </div>

                {/* Recent Events Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Recent Events</h2>
                        <button className="text-primary text-sm font-semibold hover:underline">View All Events</button>
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
                                {/* Row 1 */}
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <Code className="w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-slate-900 dark:text-white">Spring Hackathon 2024</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wide">Live</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[150px]">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium text-slate-900 dark:text-slate-200">245 / 300</span>
                                                <span className="text-slate-400">82%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full rounded-full" style={{ width: '82%' }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        May 12, 2024
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold transition-colors text-slate-700 dark:text-slate-300">
                                            Manage
                                        </button>
                                    </td>
                                </tr>

                                {/* Row 2 */}
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <Palette className="w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-slate-900 dark:text-white">UX Portfolio Workshop</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-wide">Draft</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[150px]">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium text-slate-900 dark:text-slate-200">0 / 50</span>
                                                <span className="text-slate-400">0%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full rounded-full" style={{ width: '0%' }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        Jun 05, 2024
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold transition-colors text-primary">
                                            Edit
                                        </button>
                                    </td>
                                </tr>

                                {/* Row 3 */}
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                                                <PartyPopper className="w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-slate-900 dark:text-white">Design Week Gala</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wide">Past</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[150px]">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium text-slate-900 dark:text-slate-200">500 / 500</span>
                                                <span className="text-slate-400">100%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        Apr 15, 2024
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold transition-colors text-slate-700 dark:text-slate-300">
                                            Archive
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
