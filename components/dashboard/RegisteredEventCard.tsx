'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    MapPin,
    Clock,
    CalendarPlus,
    Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Event } from '@/types';
import { format } from 'date-fns';

interface RegisteredEventCardProps {
    event: Event;
    isPast?: boolean;
}

export function RegisteredEventCard({ event, isPast = false }: RegisteredEventCardProps) {
    const date = new Date(event.date);
    const month = format(date, 'MMM');
    const day = format(date, 'dd');
    const startTime = event.time || '10:00 AM';
    const endTime = '12:00 PM'; // Mock end time if not available

    return (
        <div className={cn(
            "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow group",
            isPast && "opacity-75 grayscale-[20%] hover:opacity-100 hover:grayscale-0"
        )}>
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden relative shrink-0">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-lg text-center shadow-sm">
                        <span className="block text-xs font-bold uppercase text-primary leading-tight">{month}</span>
                        <span className="block text-lg font-black leading-tight">{day}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1 w-full">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                    {event.category}
                                </span>
                                {!isPast && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                        Upcoming
                                    </span>
                                )}
                                {isPast && (
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                        Completed
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{event.title}</h3>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                                <div className="flex items-center gap-1">
                                    {event.location.toLowerCase().includes('online') ? (
                                        <Video className="w-4 h-4 text-slate-400" />
                                    ) : (
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                    )}
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span>{startTime} - {endTime}</span>
                                </div>
                            </div>
                        </div>
                        {!isPast && (
                            <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors hidden sm:block" title="Export to Calendar">
                                <CalendarPlus className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 gap-4">
                        {/* Attendees Stack */}
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-200">
                                    <Image
                                        src={`https://i.pravatar.cc/150?u=${event.id + i}`}
                                        alt="Attendee"
                                        width={32}
                                        height={32}
                                    />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                +{event.registeredCount - 3}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 w-full sm:w-auto">
                            {!isPast ? (
                                <>
                                    <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-1 sm:flex-none">
                                        Cancel
                                    </Button>
                                    <Button className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 flex-1 sm:flex-none">
                                        View Details
                                    </Button>
                                </>
                            ) : (
                                <Button variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex-1 sm:flex-none">
                                    View Summary
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
