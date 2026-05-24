import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getTeamEvents } from '@/app/actions/collaboration';
import { getTeamActivity } from '@/app/actions/activity';
import { TeamSidebar } from '@/components/dashboard/TeamSidebar';
import { TeamEventCard } from '@/components/dashboard/TeamEventCard';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { 
    Users, Calendar, BarChart3, Plus, 
    Sparkles, ArrowRight, ShieldCheck, 
    BellRing, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default async function TeamDashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const { events = [] } = await getTeamEvents();
    const { activities = [] } = await getTeamActivity();

    const stats = [
        { label: 'Active Events', value: events.length, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Team Members', value: new Set(events.flatMap(e => [e.organizerId, ...e.collaborators.map((c: any) => c.userId)])).size, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Total Registrations', value: events.reduce((acc, e) => acc + (e._count?.registrations || 0), 0), icon: BarChart3, color: 'text-primary', bg: 'bg-primary/10' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase italic">
                                Team <span className="text-primary not-italic">Hub</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-lg">
                            Manage collaborative events and track team progress in real-time.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="rounded-2xl border-slate-200 dark:border-slate-800 h-14 px-6 font-black uppercase tracking-widest gap-2 bg-white dark:bg-slate-900 shadow-sm">
                            <BellRing className="w-5 h-5 text-primary" />
                            <span className="hidden sm:inline">Alerts</span>
                            <Badge className="bg-primary text-white ml-1">3</Badge>
                        </Button>
                        <Link href="/create-event">
                            <Button className="rounded-2xl bg-primary hover:bg-primary/90 text-white h-14 px-8 font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95">
                                <Plus className="w-6 h-6" />
                                <span>Create Event</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Sidebar */}
                    <TeamSidebar />

                    {/* Main Content */}
                    <div className="flex-1 space-y-12">
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none space-y-4 group">
                                    <div className={cn("p-4 rounded-3xl w-fit transition-transform group-hover:scale-110 duration-300", stat.bg)}>
                                        <stat.icon className={cn("w-7 h-7", stat.color)} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">{stat.label}</p>
                                        <p className="text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Layout Split */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                            
                            {/* Events List (7 Cols) */}
                            <div className="xl:col-span-8 space-y-8">
                                <div className="flex items-center justify-between px-4">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-4">
                                        <Calendar className="w-8 h-8 text-primary" />
                                        Team Events
                                    </h2>
                                    <Link href="/team-dashboard/shared" className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 group">
                                        View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="space-y-6">
                                    {events.length === 0 ? (
                                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-16 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-6">
                                            <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full shadow-2xl">
                                                <Sparkles className="w-12 h-12 text-slate-300" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Collaborative Events</h3>
                                                <p className="text-slate-500 font-bold max-w-xs mx-auto">Create an event or get invited to start collaborating.</p>
                                            </div>
                                            <Link href="/create-event">
                                                <Button className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                                    Start Your First Project
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        events.map((event: any) => (
                                            <TeamEventCard key={event.id} event={event} currentUserId={session.user.id} />
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Recent Activity (5 Cols) */}
                            <div className="xl:col-span-4 space-y-8">
                                <div className="flex items-center gap-4 px-4">
                                    <History className="w-8 h-8 text-primary" />
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Recent Activity</h2>
                                </div>

                                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[3rem] p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/10 dark:shadow-none min-h-[600px]">
                                    <ActivityTimeline activities={activities} />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
