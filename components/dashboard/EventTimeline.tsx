'use client';

import { Event } from '@/types';
import { format } from 'date-fns';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface EventTimelineProps {
    events: Event[];
    className?: string;
}

export function EventTimeline({ events, className }: EventTimelineProps) {
    if (events.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No upcoming events. Find something new!
            </div>
        );
    }

    return (
        <div className={cn("space-y-0", className)}>
            {events.map((event, index) => (
                <div key={event.id} className="relative pl-6 pb-6 last:pb-0 group">
                    {/* Vertical Line */}
                    {index !== events.length - 1 && (
                        <div className="absolute top-2 left-[5px] w-0.5 h-full bg-border group-hover:bg-primary/30 transition-colors" />
                    )}

                    {/* Dot */}
                    <div className="absolute top-2 left-0 w-3 h-3 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors z-10" />

                    {/* Content */}
                    <div className="flex flex-col sm:flex-row gap-4 bg-muted/20 p-3 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50">
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden shrink-0">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 space-y-1">
                            <Link href={`/events/${event.id}`} className="font-semibold hover:text-primary transition-colors line-clamp-1 block">
                                {event.title}
                            </Link>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{format(new Date(event.date), 'MMM dd')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{event.time}</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                                    <Link href={`/events/${event.id}`}>
                                        View Details <ArrowRight className="w-3 h-3 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
