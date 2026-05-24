'use client';

import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface FeaturedEventsProps {
    events: Event[];
}

export function FeaturedEvents({ events }: FeaturedEventsProps) {
    // Take top 3 for the grid
    const featured = events.slice(0, 3);

    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-foreground">Featured Highlights</h2>
                        <p className="text-muted-foreground">Handpicked events you can't miss</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="rounded-full">
                            <ChevronRight className="w-4 h-4 rotate-180" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featured.map((event) => (
                        <div key={event.id} className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-[400px]">
                            {/* Image */}
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                            {/* Badge */}
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-primary text-white font-bold px-2 py-1 rounded uppercase border-none">
                                    Featured
                                </Badge>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <div className="flex gap-2 mb-2 text-primary font-bold text-sm">
                                    <span suppressHydrationWarning>{format(new Date(event.date), 'MMM dd')}</span>
                                    <span>•</span>
                                    <span suppressHydrationWarning>{format(new Date(event.date), 'h:mm a')}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{event.title}</h3>
                                <p className="text-white/70 text-sm flex items-center gap-1 mb-4">
                                    <MapPin className="w-4 h-4" /> {event.location}
                                </p>
                                <Button className="w-full bg-white text-slate-900 font-bold hover:bg-primary hover:text-white transition-colors border-none" asChild>
                                    <Link href={`/events/${event.id}`}>Get Tickets</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
