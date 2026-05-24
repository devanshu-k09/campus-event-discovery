'use client';

import { useState, useEffect } from 'react';
import { getUserDashboardData } from '@/app/actions/user';
import { motion } from 'framer-motion';
import { Calendar, Plus, Loader2, ArrowUpRight, MapPin, Users, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function HostedEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getUserDashboardData();
                if (data) {
                    setEvents(data.organizedEvents);
                }
            } catch (error) {
                console.error('Failed to fetch hosted events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground animate-pulse font-bold">Loading your hosted events...</p>
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 py-12 pt-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest"
                    >
                        <Globe className="w-3 h-3" />
                        Organizer Hub
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tight"
                    >
                        Your <span className="text-primary">Hosted</span> Events
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl font-medium"
                    >
                        Manage your creations, track registrations, and publish new experiences to the campus.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Button asChild className="rounded-2xl px-8 py-6 h-auto font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 group">
                        <Link href="/create-event">
                            <Plus className="w-5 h-5" />
                            Create New Event
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Content Section */}
            {events.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {events.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="rounded-[2.5rem] border-border/40 hover:border-primary/20 transition-all group overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-xl">
                                <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8">
                                    <div className="h-32 w-32 sm:h-28 sm:w-28 rounded-[2rem] bg-secondary relative overflow-hidden flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                        <img src={event.image} alt={event.title} className="object-cover h-full w-full" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left min-w-0">
                                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                                            <Badge className={cn(
                                                "text-[10px] h-5 px-2.5 rounded-full uppercase font-black tracking-widest border-none",
                                                event.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                            )}>
                                                {event.status}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(event.date), 'MMMM dd, yyyy')}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black truncate leading-tight group-hover:text-primary transition-colors mb-2">
                                            {event.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                                            <span className="text-sm text-muted-foreground flex items-center gap-1.5 font-bold">
                                                <MapPin className="h-4 w-4 text-primary/50" />
                                                {event.location}
                                            </span>
                                            <span className="text-sm text-muted-foreground flex items-center gap-1.5 font-bold">
                                                <Users className="h-4 w-4 text-primary/50" />
                                                {event.capacity} Capacity
                                            </span>
                                            {event.isPrivate && (
                                                <Badge variant="outline" className="rounded-md border-primary/20 text-primary gap-1 py-0.5 px-2">
                                                    <Lock className="w-3 h-3" /> Private
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto">
                                        <Button asChild className="rounded-2xl h-12 px-6 font-bold gap-2 group flex-1 sm:flex-none">
                                            <Link href={`/edit-event/${event.id}`}>
                                                Manage
                                                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" asChild className="rounded-2xl h-12 px-6 font-bold flex-1 sm:flex-none border-2 hover:bg-secondary">
                                            <Link href={`/events/${event.id}`}>
                                                View Live
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 bg-secondary/10 rounded-[3rem] border border-dashed border-border"
                >
                    <div className="bg-background p-8 rounded-3xl shadow-sm mb-6">
                        <Globe className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">No hosted events yet</h3>
                    <p className="text-muted-foreground mb-10 text-center max-w-sm font-medium">
                        Ready to make an impact? Create your first event and start building your community.
                    </p>
                    <Button asChild className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20">
                        <Link href="/create-event">Get Started Now</Link>
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
