'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
    CalendarCheck, Bell, Edit3, Share2, LayoutDashboard, Users, Megaphone,
    QrCode, Hourglass, Utensils, MapPin, Info as InfoIcon, CreditCard, ArrowRight,
    CheckCircle2, AlertCircle, Check, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';

export default function EventManagementPage() {
    const params = useParams();
    const eventId = params.id;
    const [activeTab, setActiveTab] = useState('overview');

    // Mock Data for Pending Approvals
    const pendingApprovals = [
        {
            id: 1,
            name: "Jordan Smith",
            major: "Computer Science • Junior",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBi3e2xj_Ivx4Z96l7HIkKtHur9WHZxuaHim1oDfTpv-_tRvvxD5Ojtyj_5N9HvxtqZU3CcOmYKXZLxFErPHFQinCMSZCFhuylQ2B1Dq21A9bR1EJ_VBPM_8UGTJcQhZ2KahlCExYQsa0oz1VFAtOryp9kjVXd-ABusuhJImv1KE5fFpDkVvn2c715BBsBgBuIukrcBwqog-NVJpZFS8FsLkGJZYcl9X359m7wywPpQqWcVdIJsqTC9Pij6l0dkkvBBXPGMQbC1Rthy",
            initials: "JS"
        },
        {
            id: 2,
            name: "Sarah Chen",
            major: "Data Science • Senior",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoCPwxYFlrpWsW8_k1CXmplaVJDtN49iZq_vGtT4VaWc9RBN4tjON-aiXr0PgaMcPQa31UMGgidQelv54XhagSadXmpdyN1rj_5PVqkw9gTpwffccXEPD73MfXF96XxBJGViUK9TAycYx2GF5uRxmy7oKbX4pwZtAcnVSSd7jVIs3K7TL8uw1e7xXKJ1c-sKDWDLJv1gt_N2ed82q0rq5g_ug6TMazKEKkq2A_aCZADOgno44h6P7YFhZa0L5Xft_VmpSDYCgIwG6d",
            initials: "SC"
        },
        {
            id: 3,
            name: "Marcus Wright",
            major: "Mechanical Engineering • Freshman",
            initials: "MW"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101122] font-display text-slate-900 dark:text-slate-100">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#101122]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
                            <CalendarCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">EventManager</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold">Alex Rivera</p>
                                <p className="text-xs text-slate-500">Lead Organizer</p>
                            </div>
                            <div className="relative h-10 w-10 rounded-full border-2 border-primary overflow-hidden">
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD28yYoLI4HTTzgutDcWdor3w-Ec26_N5t7WEzVry2HKWzexmN7OYr2WS78f5iE3jG14Cgh6mV-ToFR8tKYoli4hHIMp7isiRmMjodZFmRXN1DL2SLnzuEeGIk7IqzbZs5p5zG7zr1xMN4tkHlPtoZCpaUuiiC5TiyvpFDQormHhFu-fdVXihktfGBmYUxztKihJUEad4rRHzO88vAb5JZH958s62mp-nEYJLYqB78sDsdsEkXngOkQj44fw-IAfxajI80Hg1g7wlKE"
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
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
                            <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                                Live
                            </span>
                            <span className="text-slate-500 text-sm">Event ID: CH-2024-001</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Campus Hackathon 2024</h2>
                        <p className="text-slate-500 mt-1">Innovation Center • Oct 24-26, 2024</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors text-slate-700 dark:text-slate-300">
                            <Edit3 className="w-4 h-4" /> Edit Details
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2 transition-opacity">
                            <Share2 className="w-4 h-4" /> Share Link
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex gap-8 overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                            { id: 'registrations', label: 'Registrations', icon: Users },
                            { id: 'marketing', label: 'Marketing', icon: Megaphone },
                            { id: 'checkin', label: 'Check-in', icon: QrCode },
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
                        {/* Registration Stats & Capacity */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">Registration Status</h3>
                                <span className="text-sm font-medium text-slate-500">Last updated: 2 mins ago</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 font-medium">Total Registered</p>
                                    <p className="text-3xl font-bold">442 <span className="text-sm font-normal text-slate-400">/ 500</span></p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 font-medium">Checked In</p>
                                    <p className="text-3xl font-bold">0</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 font-medium">Conversion Rate</p>
                                    <p className="text-3xl font-bold text-primary">88.4%</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold">Capacity Reach</span>
                                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">88% (Approaching Limit)</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                                    <div className="bg-yellow-500 h-full rounded-full" style={{ width: '88%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="font-bold text-lg">Pending Approvals</h3>
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">12 Requests</span>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {pendingApprovals.map((student) => (
                                    <div key={student.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            {student.image ? (
                                                <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                                                    <Image src={student.image} alt={student.name} fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                    {student.initials}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white leading-tight">{student.name}</p>
                                                <p className="text-sm text-slate-500">{student.major}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900/30 transition-all">
                                                Deny
                                            </button>
                                            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center">
                                <button className="text-primary text-sm font-bold hover:underline">View All Requests</button>
                            </div>
                        </div>

                        {/* Event Day Quick Tools */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group relative overflow-hidden bg-primary rounded-xl p-6 text-white cursor-pointer hover:shadow-xl hover:shadow-primary/20 transition-all">
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
                                {/* Abstract Background Detail */}
                                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                            </div>

                            <div className="group relative overflow-hidden bg-slate-900 dark:bg-slate-800 rounded-xl p-6 text-white cursor-pointer hover:shadow-xl transition-all border border-slate-800">
                                <div className="flex justify-between items-start mb-12 relative z-10">
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-md">
                                        <CreditCard className="w-8 h-8" />
                                    </div>
                                    <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-xl font-bold mb-1">Badge Printing</h4>
                                    <p className="text-white/40 text-sm">Batch print approved student IDs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Stats */}
                    <aside className="col-span-12 lg:col-span-4 space-y-8">
                        {/* Event Countdown */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 sticky top-24 shadow-sm">
                            <div className="text-center mb-6">
                                <p className="text-slate-500 font-medium mb-1">Days to Event</p>
                                <p className="text-6xl font-black text-primary tracking-tighter">14</p>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-[#f6f6f8] dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <Hourglass className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm font-semibold">Waitlist count</span>
                                    </div>
                                    <span className="font-bold">67</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-[#f6f6f8] dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <Utensils className="w-5 h-5 text-primary" />
                                        <span className="text-sm font-semibold">Meal Preference: Vegan</span>
                                    </div>
                                    <span className="font-bold text-slate-500 text-sm">22%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-[#f6f6f8] dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm font-semibold">Main Stage Status</span>
                                    </div>
                                    <span className="text-green-500 text-xs font-bold uppercase">Ready</span>
                                </div>
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Event Venue
                                </h4>
                                <div className="rounded-xl overflow-hidden mb-4 relative h-32 bg-slate-200">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHEW7QDCUGxEnICRGbXePVpxuCDU7SSZ6OJiqnjDPYIS8dpLXlcRo4PUi53-kSfB-EEemb1kvKakM8Qr5c6BqO7WHxuiSnihIrqQimC-lw1zw06xWJIL_ynJ5AnlBTUPvtTzXFJ-1uLpawe7SsHd3aoC6SL2CCAnNg1eG0Y5ftc6dLD1PoFWj5hBud-XTKAnaQpfaczpadep219-1UBXdEy9EgWDUoz6z96UJ-Hgo762HFxJci7PfpHZo4oAqleJPFSSSDIzE9-o0P"
                                        alt="Map Location"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                        <div className="bg-white px-3 py-1 rounded-full shadow-lg text-xs font-bold flex items-center gap-1 text-slate-900">
                                            <MapPin className="w-3 h-3 text-red-500" /> 120 Innovation Way
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-primary/5 rounded-lg p-3 text-xs text-primary font-medium flex gap-2 items-start">
                                    <InfoIcon className="w-4 h-4 shrink-0" />
                                    Setup begins 5:00 AM Oct 24th. Contact facilities for early badge access.
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Mini List */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="font-bold mb-4">Live Activity</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 ring-4 ring-green-100 dark:ring-green-900/20 shrink-0"></div>
                                    <div>
                                        <p className="text-xs text-slate-500">2 minutes ago</p>
                                        <p className="text-sm"><b>Taylor W.</b> just registered for Hardware Track</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 ring-4 ring-primary/10 shrink-0"></div>
                                    <div>
                                        <p className="text-xs text-slate-500">15 minutes ago</p>
                                        <p className="text-sm"><b>Admin</b> updated Marketing Assets for Instagram</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 ring-4 ring-slate-100 dark:ring-slate-800 shrink-0"></div>
                                    <div>
                                        <p className="text-xs text-slate-500">1 hour ago</p>
                                        <p className="text-sm">New sponsor <b>TechCorp</b> confirmed participation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer Space */}
            <footer className="max-w-[1440px] mx-auto px-6 py-8 text-center text-slate-400 text-sm">
                <p>© 2024 EventManager Dashboard. Academic Use Only.</p>
            </footer>
        </div>
    );
}
