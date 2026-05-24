'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Clock, 
    MapPin, 
    ArrowUpRight, 
    Trash2,
    Calendar
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { deleteEvent } from "@/app/actions/event";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface HostedEventsListProps {
    initialEvents: any[];
}

export function HostedEventsList({ initialEvents }: HostedEventsListProps) {
    const [events, setEvents] = useState(initialEvents);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async () => {
        if (!eventToDelete) return;
        
        const res = await deleteEvent(eventToDelete);
        if (res.success) {
            toast.success("Event deleted successfully");
            setEvents(events.filter(e => e.id !== eventToDelete));
            router.refresh();
        } else {
            toast.error(res.error || "Failed to delete event");
        }
    };

    if (events.length === 0) {
        return (
            <Card className="rounded-[3rem] border-dashed border-2 flex flex-col items-center justify-center p-16 text-center bg-secondary/10">
                <div className="p-6 bg-background rounded-3xl shadow-xl mb-6">
                    <Calendar className="h-10 w-10 text-primary/40" />
                </div>
                <h3 className="font-black text-2xl">Create your legacy.</h3>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto mt-3">
                    You haven't hosted any events yet. Lead the campus and start hosting today!
                </p>
                <Link href="/create-event" className="mt-8">
                    <Button className="rounded-2xl h-14 px-10 text-lg font-black shadow-xl shadow-primary/20">
                        Start Hosting Now
                    </Button>
                </Link>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {events.map(event => (
                <Card key={event.id} className="rounded-[2.5rem] border-border/40 hover:border-primary/20 transition-all group overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-2xl hover:shadow-primary/5">
                    <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8">
                        <div className="h-32 w-32 sm:h-24 sm:w-24 rounded-3xl bg-secondary relative overflow-hidden flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                            <img src={event.image} alt={event.title} className="object-cover h-full w-full" />
                        </div>
                        <div className="flex-1 text-center sm:text-left min-w-0">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                <Badge className={cn(
                                    "text-[10px] h-5 px-2 rounded-full uppercase font-black tracking-widest border-none",
                                    event.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                )}>
                                    {event.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-bold">
                                    {format(new Date(event.date), 'MMMM dd, yyyy')}
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black truncate leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-bold">
                                    <Clock className="h-4 w-4 text-primary/50" />
                                    {event.time}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-bold">
                                    <MapPin className="h-4 w-4 text-primary/50" />
                                    {event.location}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 sm:ml-auto w-full sm:w-auto">
                            <Link href={`/edit-event/${event.id}`} className="flex-1 sm:flex-none">
                                <Button className="rounded-2xl w-full sm:w-auto h-12 px-6 font-bold gap-2 group">
                                    Manage
                                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Button>
                            </Link>
                            <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => setEventToDelete(event.id)}
                                className="h-12 w-12 rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all shadow-sm border border-slate-200 dark:border-slate-800"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <ConfirmationModal 
                isOpen={!!eventToDelete}
                onClose={() => setEventToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Event?"
                message="Are you sure you want to delete this event? This action cannot be undone and all registrations will be removed."
                confirmText="Yes, Delete"
                variant="danger"
            />
        </div>
    );
}
