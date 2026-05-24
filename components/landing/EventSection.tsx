'use client';

import { SmartEvent, Event } from '@/types';
import EventCard from '@/components/events/EventCard';
import { EventCardSkeleton } from '@/components/events/EventCardSkeleton';
import { ChevronRight, CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EventSectionProps {
    title: string;
    subtitle?: string;
    events: (Event | SmartEvent)[];
    loading?: boolean;
    viewAllLink?: string;
    emptyMessage?: string;
    hideIfEmpty?: boolean;
}

const getTitleIconAndText = (title: string) => {
    // Check if title starts with an emoji followed by space
    const emojiRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])\s*(.+)$/u;
    const match = title.match(emojiRegex);
    if (match) {
        return { icon: match[1], cleanTitle: match[2] };
    }
    return { icon: null, cleanTitle: title };
};

export function EventSection({
    title,
    subtitle,
    events,
    loading = false,
    viewAllLink = '/events',
    emptyMessage = 'No events found.',
    hideIfEmpty = false
}: EventSectionProps) {
    if (hideIfEmpty && !loading && events.length === 0) {
        return null;
    }

    const { icon, cleanTitle } = getTitleIconAndText(title);

    return (
        <section className="mt-16 first:mt-8">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-6 gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        {icon && (
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-base border border-indigo-500/20 shrink-0">
                                {icon}
                            </span>
                        )}
                        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {cleanTitle}
                        </h2>
                    </div>
                    {subtitle && (
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {subtitle}
                        </p>
                    )}
                </div>

                {viewAllLink && (
                    <Link 
                        href={viewAllLink} 
                        className="flex items-center gap-1 text-xs md:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-all border border-indigo-500/20 dark:border-indigo-500/30 hover:border-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10 px-3.5 py-1.5 md:px-4 md:py-2 rounded-xl shrink-0 group"
                    >
                        <span>View All</span>
                        <ChevronRight className="w-3.5 h-3.5 md:w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                )}
            </div>

            {/* Grid Container */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <EventCardSkeleton key={i} />
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl text-center max-w-2xl mx-auto">
                    <div className="p-4 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 rounded-full mb-4 border border-indigo-500/20">
                        <CalendarX className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        {title.includes('Recommended') ? 'No recommended events yet' : 'No events found'}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
                        {title.includes('Recommended') 
                            ? 'Complete your interests or explore all events.' 
                            : emptyMessage || 'Check back later or explore other categories.'}
                    </p>
                    <Button asChild variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary hover:text-white px-6 py-2.5 h-auto text-xs font-bold">
                        <Link href="/events">Explore All Events</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </section>
    );
}
