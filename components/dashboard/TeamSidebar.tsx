'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, Calendar, Users, BarChart3, 
    Settings, Bell, PlusCircle, Shield, Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
    { label: 'My Events', icon: LayoutDashboard, href: '/team-dashboard' },
    { label: 'Shared Events', icon: Share2, href: '/team-dashboard/shared' },
    { label: 'Team Members', icon: Users, href: '/team-dashboard/members' },
    { label: 'Analytics', icon: BarChart3, href: '/team-dashboard/analytics' },
    { label: 'Notifications', icon: Bell, href: '/team-dashboard/notifications' },
];

export function TeamSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-[calc(100vh-80px)] sticky top-20 hidden lg:flex flex-col gap-6 p-4">
            <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-2">Team Management</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group",
                                isActive 
                                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                            )}>
                                <item.icon className={cn(
                                    "w-5 h-5",
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-primary transition-colors"
                                )} />
                                <span className="font-bold text-sm">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto flex flex-col gap-4">
                <div className="bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-[2rem] p-6 border border-primary/10 space-y-4">
                    <div className="p-3 bg-primary/20 rounded-2xl w-fit">
                        <PlusCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-black text-slate-900 dark:text-white text-sm">New Event</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Start collaborating with your team today.</p>
                    </div>
                    <Link href="/create-event">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-xs h-10 shadow-lg shadow-primary/20">
                            Create Now
                        </Button>
                    </Link>
                </div>

                <div className="px-4 py-2 flex items-center gap-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer group">
                    <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
                    <span className="font-bold text-sm">Team Settings</span>
                </div>
            </div>
        </aside>
    );
}
