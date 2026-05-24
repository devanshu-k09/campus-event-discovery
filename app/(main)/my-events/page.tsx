'use client';

import { useState, useEffect } from 'react';
import { getMyRegistrations } from '@/app/actions/event';
import EventCard from '@/components/events/EventCard';
import { motion } from 'framer-motion';
import { Calendar, Ticket, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyEventsPage() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const data = await getMyRegistrations();
                setRegistrations(data);
            } catch (error) {
                console.error('Failed to fetch registrations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground animate-pulse font-medium">Fetching your tickets...</p>
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
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider"
                    >
                        <Ticket className="w-3 h-3" />
                        My Tickets
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight"
                    >
                        My <span className="text-primary">Registrations</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl"
                    >
                        Manage your upcoming events, view tickets, and keep track of your campus life.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Button asChild className="rounded-xl px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                        <Link href="/">
                            Discover More Events
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Content Section */}
            {registrations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {registrations.map((reg, index) => (
                        <motion.div
                            key={reg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="relative group">
                                {/* Registration Status Ribbon */}
                                <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm backdrop-blur-md border ${
                                    reg.status === 'registered' 
                                        ? 'bg-green-500/90 text-white border-green-400' 
                                        : reg.status === 'waitlist'
                                        ? 'bg-amber-500/90 text-white border-amber-400'
                                        : 'bg-slate-500/90 text-white border-slate-400'
                                }`}>
                                    {reg.status}
                                </div>
                                
                                <EventCard event={reg.event} />
                                
                                {/* Additional Info Footer if needed */}
                                <div className="mt-3 flex items-center justify-between px-2">
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-tighter">
                                        Registered on {new Date(reg.registeredAt).toLocaleDateString()}
                                    </p>
                                    <Link href={`/tickets/${reg.id}`} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">
                                        View Ticket Pass →
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border"
                >
                    <div className="bg-background p-6 rounded-full shadow-sm mb-6">
                        <Calendar className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No registrations yet</h3>
                    <p className="text-muted-foreground mb-8 text-center max-w-sm">
                        You haven't signed up for any events. Start exploring and join the campus community!
                    </p>
                    <Button asChild variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary hover:text-white px-8">
                        <Link href="/">Browse Events</Link>
                    </Button>
                </motion.div>
            )}

            {/* Quick Stats / Help Footer */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 flex flex-col md:flex-row items-center gap-8"
            >
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
                    <AlertCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-bold mb-1">Need help with your tickets?</h4>
                    <p className="text-muted-foreground">If you encounter any issues with your registration or can't find an event, contact our support team.</p>
                </div>
                <Button variant="ghost" className="font-bold" asChild>
                    <a href="mailto:support@campuspulse.com">Help Center</a>
                </Button>
            </motion.div>
        </div>
    );
}
