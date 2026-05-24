'use client';

import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Armchair, Dumbbell, Palette, Heart, ChevronRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface WeekendEventsProps {
    events: Event[];
}

export function WeekendEvents({ events }: WeekendEventsProps) {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-extrabold text-foreground flex items-center gap-3">
                        <Armchair className="text-accent-pink w-8 h-8" /> This Weekend
                    </h2>
                    <Link href="/events" className="text-primary font-bold hover:underline flex items-center gap-1 group">
                        See calendar <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
                    {events.map((event) => (
                        <div key={event.id} className="snap-start shrink-0 w-80 bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md group border border-border/50 hover:border-primary/50 transition-colors">
                            <div className="h-32 bg-primary/10 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                                <Calendar className="text-primary w-12 h-12 relative z-10" />
                            </div>

                            <div className="p-5">
                                <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground mb-2 inline-block uppercase" suppressHydrationWarning>
                                    {format(new Date(event.date), 'EEEE')}
                                </span>
                                <h5 className="font-bold text-foreground mb-1 text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                    {event.title}
                                </h5>
                                <p className="text-xs text-muted-foreground mb-4 font-medium" suppressHydrationWarning>
                                    {event.location} • {format(new Date(event.date), 'h:mm a')}
                                </p>
                                <Button variant="link" className="p-0 h-auto text-sm font-bold text-primary hover:text-primary/80" asChild>
                                    <Link href={`/events/${event.id}`}>View Details</Link>
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Fallback if no weekend events, mock some for visual fidelity as per design */}
                    {events.length === 0 && (
                        <div className="w-full text-center py-10 text-muted-foreground">
                            No events scheduled for this weekend. Check back later!
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
