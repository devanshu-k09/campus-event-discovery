'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
    CalendarCheck, Bell, Edit3, Share2, LayoutDashboard, Users, Megaphone,
    QrCode, Hourglass, Utensils, MapPin, Info as InfoIcon, CreditCard, ArrowRight,
    Loader2,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { getEventManagementDetails } from '@/app/actions/event';

export default function EventManagementPage() {
    const { data: session } = useSession();
    const params = useParams();
    const eventId = params.id as string;
    const [activeTab, setActiveTab] = useState('overview');
    
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(`${window.location.origin}/events/${eventId}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await getEventManagementDetails(eventId);
            if (res.success) {
                setData(res.data);
            }
            setLoading(false);
        };
        if (eventId) fetchDetails();
    }, [eventId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6f6f8] dark:bg-[#101122]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6f6f8] dark:bg-[#101122]">
                <p>Event not found or unauthorized.</p>
            </div>
        );
    }

    const { event, stats, attendees } = data;

    return (
        <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101122] font-display text-slate-900 dark:text-slate-100">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#101122]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/organizer/dashboard" className="bg-primary p-2 rounded-lg text-white flex items-center justify-center hover:bg-primary/90 transition-colors">
                            <CalendarCheck className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">
                                Campus<span className="text-primary">Pulse</span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold">{session?.user?.name}</p>
                                <p className="text-xs text-slate-500">Host</p>
                            </div>
                            <div className="relative h-10 w-10 rounded-full border-2 border-primary overflow-hidden bg-slate-200">
                                {session?.user?.image && (
                                    <Image src={session.user.image} alt="Profile" fill className="object-cover" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1440px] mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
                                event.status === 'published' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                event.status === 'draft' ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" :
                                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            )}>
                                {event.status}
                            </span>
                            <span className="text-slate-500 text-sm">Event ID: {event.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{event.title}</h2>
                        <p className="text-slate-500 mt-1">{event.location || 'TBA'} • {new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`/edit-event/${event.id}`}>
                            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors text-slate-700 dark:text-slate-300">
                                <Edit3 className="w-4 h-4" /> Edit Details
                            </button>
                        </Link>
                        <button onClick={handleShare} className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2 transition-opacity">
                            <Share2 className="w-4 h-4" /> {isCopied ? "Copied!" : "Share Link"}
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex gap-8 overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                            { id: 'registrations', label: 'Registrations', icon: Users },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "pb-4 font-medium flex items-center gap-2 transition-colors whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "text-primary border-b-2 border-primary font-semibold"
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                <tab.icon className="w-5 h-5" /> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        
                        {activeTab === 'overview' && (
                            <>
                                {/* Registration Stats & Capacity */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-lg">Registration Status</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1 font-medium">Total Registered</p>
                                            <p className="text-3xl font-bold">{stats.totalTicketsSold} <span className="text-sm font-normal text-slate-400">/ {event.capacity}</span></p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1 font-medium">Checked In</p>
                                            <p className="text-3xl font-bold">{stats.checkedInCount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1 font-medium">Cancelled</p>
                                            <p className="text-3xl font-bold text-red-500">{stats.cancelledCount}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold">Capacity Reach</span>
                                            <span className={cn("text-sm font-bold", 
                                                stats.capacityReachPercentage >= 90 ? "text-red-500" :
                                                stats.capacityReachPercentage >= 70 ? "text-yellow-500" : "text-green-500"
                                            )}>
                                                {Math.round(stats.capacityReachPercentage)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${Math.min(100, stats.capacityReachPercentage)}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Day Quick Tools */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div onClick={() => alert("Hardware scanner module requires camera permissions or a connected device. This feature is coming soon!")} className="group relative overflow-hidden bg-primary rounded-xl p-6 text-white cursor-pointer hover:shadow-xl hover:shadow-primary/20 transition-all">
                                        <div className="flex justify-between items-start mb-12 relative z-10">
                                            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-md">
                                                <QrCode className="w-8 h-8" />
                                            </div>
                                            <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="text-xl font-bold mb-1">QR Code Scanner</h4>
                                            <p className="text-white/80 text-sm">Quick entry tool for check-in desk</p>
                                        </div>
                                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'registrations' && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">Attendee Management</h3>
                                        <p className="text-sm text-slate-500">Real-time list of all users who have registered.</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                                <th className="px-6 py-4 font-semibold">Attendee</th>
                                                <th className="px-6 py-4 font-semibold">Registered On</th>
                                                <th className="px-6 py-4 font-semibold">Tickets</th>
                                                <th className="px-6 py-4 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {attendees.map((attendee: any) => (
                                                <tr key={attendee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                                                                {attendee.image ? (
                                                                    <Image src={attendee.image} alt={attendee.name} fill className="object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                                                        {attendee.name.charAt(0)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900 dark:text-white">{attendee.name}</p>
                                                                <p className="text-xs text-slate-500">{attendee.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                        {new Date(attendee.registeredAt).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        {attendee.ticketCount}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                                            attendee.status === 'registered' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                            attendee.status === 'attended' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                                            attendee.status === 'cancelled' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                                            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                                        )}>
                                                            {attendee.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {attendees.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                        No attendees have registered yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Sidebar Stats */}
                    <aside className="col-span-12 lg:col-span-4 space-y-8">
                        {/* Event Details Summary */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 sticky top-24 shadow-sm">
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Event Venue
                                </h4>
                                <div className="rounded-xl overflow-hidden mb-4 relative h-32 bg-slate-200">
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                        <div className="bg-white px-3 py-1 rounded-full shadow-lg text-xs font-bold flex items-center gap-1 text-slate-900">
                                            <MapPin className="w-3 h-3 text-red-500" /> {event.location || 'TBA'}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-primary/5 rounded-lg p-3 text-xs text-primary font-medium flex gap-2 items-start">
                                    <InfoIcon className="w-4 h-4 shrink-0" />
                                    This dashboard is updated in real-time as users register or cancel.
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
