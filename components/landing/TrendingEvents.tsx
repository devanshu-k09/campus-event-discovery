'use client';

import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Video, Users, Utensils, Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface TrendingEventsProps {
    events: Event[];
}

export function TrendingEvents({ events }: TrendingEventsProps) {
    return (
        <section className="py-12 bg-white dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-10">
                    <h2 className="text-3xl font-extrabold text-foreground mb-2">Trending Now</h2>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <Link key={event.id} href={`/events/${event.id}`} className="group">
                            <div className="bg-background-light dark:bg-slate-800 rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                                        {event.price === 0 ? 'FREE' : `₹${event.price}`}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-accent-pink uppercase mb-3 text-secondary">
                                        <Briefcase className="w-4 h-4" /> {event.category}
                                    </div>
                                    <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{event.title}</h4>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-muted-foreground flex items-center gap-2" suppressHydrationWarning>
                                            <Calendar className="w-3.5 h-3.5" />
                                            {format(new Date(event.date), 'MMM dd • h:mm a')}
                                        </p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {event.location}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-border">
                                        <div className="flex -space-x-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="h-8 w-8 rounded-full border-2 border-background overflow-hidden relative bg-muted">
                                                    <Image
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.id + i}`}
                                                        alt="Avatar"
                                                        fill
                                                    />
                                                </div>
                                            ))}
                                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                                +{event.registeredCount}
                                            </div>
                                        </div>

                                        <span className="text-primary font-bold text-lg">
                                            {event.price === 0 ? 'Free' : `₹${event.price}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button variant="secondary" size="lg" className="px-10 py-6 text-base font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700" asChild>
                        <Link href="/events">Show More Events</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
