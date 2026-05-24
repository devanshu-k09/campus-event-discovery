import { getUserDashboardData, getUserProfile } from "@/app/actions/user";
import { getMyInvitations } from "@/app/actions/collaboration";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    Calendar, 
    Plus, 
    Settings, 
    Ticket, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    ArrowUpRight,
    TrendingUp,
    Star,
    LayoutDashboard,
    Trophy,
    Users,
    Activity,
    ArrowRight,
    MapPin,
    Heart
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { HostedEventsList } from "@/components/dashboard/HostedEventsList";
import { TicketRegistrationsList } from "@/components/dashboard/TicketRegistrationsList";

export default async function DashboardPage() {
    const [user, data, inviteData] = await Promise.all([
        getUserProfile(),
        getUserDashboardData(),
        getMyInvitations()
    ]);

    if (!user || !data) {
        redirect("/login");
    }

    const { organizedEvents, registrations, likedEvents } = data;
    const pendingInvites = inviteData.success ? inviteData.invitations.length : 0;

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />
            
            <main className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold px-3 py-1 rounded-full text-xs">
                                    Member Status: {user.role.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-background shadow-xl">
                                    <AvatarImage src={user.image || ''} />
                                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                    Welcome back, {user.name?.split(' ')[0]}! 👋
                                </h1>
                            </div>
                            <p className="text-muted-foreground text-lg">
                                Managing your campus experience has never been easier.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/create-event">
                                <Button className="rounded-2xl gap-2 h-14 px-8 text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all">
                                    <Plus className="h-5 w-5" />
                                    Host Event
                                </Button>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Invitations Notification */}
                    {pendingInvites > 0 && (
                        <Link href="/dashboard/invitations">
                            <div className="mb-8 p-6 rounded-[2rem] bg-primary/5 border border-primary/10 flex items-center justify-between group hover:bg-primary/10 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                            Collaboration Invites
                                        </h3>
                                        <p className="text-slate-500 font-medium">
                                            You have {pendingInvites} pending invitation{pendingInvites > 1 ? 's' : ''} to co-host events.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-primary font-bold">
                                    View Invites
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Stats Grid - Ultra Premium Look */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { 
                                label: 'Campus Points', 
                                value: user.points, 
                                icon: Star, 
                                color: 'text-amber-500', 
                                bg: 'bg-amber-500/10', 
                                trend: `${user.points > 0 ? '+12%' : '0%'}`,
                                href: '#'
                            },
                            { 
                                label: 'My Tickets', 
                                value: registrations.reduce((sum, reg) => sum + (reg.ticketCount || 1), 0), 
                                icon: Ticket, 
                                color: 'text-blue-500', 
                                bg: 'bg-blue-500/10', 
                                trend: registrations.length > 0 ? 'Active' : 'Empty',
                                href: '/my-events'
                            },
                            { 
                                label: 'Organized', 
                                value: organizedEvents.length, 
                                icon: Calendar, 
                                color: 'text-purple-500', 
                                bg: 'bg-purple-500/10', 
                                trend: organizedEvents.length > 0 ? 'Total' : 'None',
                                href: '/hosted-events'
                            },
                            { 
                                label: 'Reputation', 
                                value: user.points >= 500 ? 'Elite' : user.points >= 200 ? 'Pro' : user.points >= 50 ? 'Rising' : 'Starter', 
                                icon: Trophy, 
                                color: 'text-emerald-500', 
                                bg: 'bg-emerald-500/10', 
                                trend: `Rank: ${user.points >= 500 ? 'Top 1%' : user.points >= 200 ? 'Top 10%' : 'Standard'}`,
                                href: '/profile'
                            },
                        ].map((stat, i) => (
                            <Link key={i} href={stat.href || '#'}>
                                <Card className="rounded-3xl border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group overflow-hidden relative h-full cursor-pointer hover:-translate-y-1">
                                    <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 -mr-8 -mt-8", stat.bg.replace('/10', ''))} />
                                    <CardContent className="p-8 relative">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300", stat.bg)}>
                                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                                            </div>
                                            <Badge variant="secondary" className="bg-secondary/50 text-muted-foreground border-none font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-tighter">
                                                {stat.trend}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
                                            <p className="text-4xl font-black">{stat.value}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>



                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                         {/* Liked Events Section */}
                         <div className="lg:col-span-3 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-xl">
                                    <Heart className="h-5 w-5 text-red-500" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">Events You Liked</h2>
                            </div>

                            {likedEvents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {likedEvents.slice(0, 4).map(event => (
                                        <Card key={event.id} className="rounded-3xl border-border/40 hover:border-red-500/20 transition-all group overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-xl">
                                            <div className="relative h-40 overflow-hidden">
                                                <img src={event.image} alt={event.title} className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105" />
                                                <div className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-red-500 shadow-sm">
                                                    <Heart className="w-4 h-4 fill-current" />
                                                </div>
                                            </div>
                                            <CardContent className="p-5">
                                                <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-none font-bold text-[10px] uppercase mb-2">
                                                    {event.category}
                                                </Badge>
                                                <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{event.title}</h3>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 font-medium">
                                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                                    {format(new Date(event.date), 'MMM dd, yyyy')}
                                                </div>
                                                <Link href={`/events/${event.id}`} className="block mt-4">
                                                    <Button variant="outline" size="sm" className="w-full rounded-xl font-bold border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-800/10 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                    <Heart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-bold">No favorite events yet. Heart some events to save them here!</p>
                                </div>
                            )}
                         </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        
                        {/* Main Feed: Organized Events */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <Activity className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight">Your Hosted Events</h2>
                                </div>
                                <Link href="/hosted-events">
                                    <Button variant="ghost" className="text-sm font-bold text-primary gap-1 group">
                                        View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>

                            <HostedEventsList initialEvents={organizedEvents.slice(0, 4)} />
                        </div>

                        {/* Sidebar: Upcoming Registrations */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-xl">
                                        <Ticket className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight">Your Tickets</h2>
                                </div>
                            </div>

                            <TicketRegistrationsList initialRegistrations={registrations.slice(0, 5)} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
