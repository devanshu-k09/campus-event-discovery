'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Ticket, 
    MapPin, 
    ArrowUpRight, 
    XCircle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { cancelRegistration } from "@/app/actions/event";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TicketRegistrationsListProps {
    initialRegistrations: any[];
}

export function TicketRegistrationsList({ initialRegistrations }: TicketRegistrationsListProps) {
    const [registrations, setRegistrations] = useState(initialRegistrations);
    const [regToCancel, setRegToCancel] = useState<string | null>(null);
    const router = useRouter();

    const handleCancel = async () => {
        if (!regToCancel) return;
        
        const res = await cancelRegistration(regToCancel);
        if (res.success) {
            toast.success("Registration cancelled successfully");
            setRegistrations(registrations.filter(r => r.id !== regToCancel));
            router.refresh();
        } else {
            toast.error(res.error || "Failed to cancel registration");
        }
    };

    if (registrations.length === 0) {
        return (
            <Card className="rounded-[2.5rem] bg-secondary/10 border-none p-10 text-center">
                <div className="p-4 bg-background rounded-2xl inline-block mb-4 shadow-sm">
                    <Ticket className="h-8 w-8 text-blue-500/40" />
                </div>
                <p className="text-muted-foreground font-bold mb-6">
                    You're not attending any upcoming events yet.
                </p>
                <Link href="/">
                    <Button className="rounded-2xl h-12 px-8 font-black bg-blue-500 hover:bg-blue-600">
                        Explore Events
                    </Button>
                </Link>
            </Card>
        );
    }

    return (
        <div className="space-y-5">
            {registrations.map(reg => (
                <Card key={reg.id} className="rounded-3xl border-border/40 hover:border-blue-500/30 transition-all group p-5 bg-card/50 backdrop-blur-sm shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center text-white text-center p-1 flex-shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <span className="text-[10px] font-black uppercase leading-none opacity-80 mb-0.5">
                                {format(new Date(reg.event.date), 'MMM')}
                            </span>
                            <span className="text-xl font-black leading-none">
                                {format(new Date(reg.event.date), 'dd')}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black truncate text-base leading-tight text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                                {reg.event.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5">
                                <Badge className={cn(
                                    "text-[9px] h-4 px-1.5 rounded-md uppercase font-black tracking-widest border-none",
                                    reg.status === 'registered' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                                )}>
                                    {reg.status}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 uppercase tracking-wider">
                                    <MapPin className="h-3 w-3" /> {reg.event.location}
                                </span>
                                {reg.ticketCount > 1 && (
                                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 rounded-md border-primary/20 text-primary font-black">
                                        {reg.ticketCount} Tickets
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => setRegToCancel(reg.id)}
                                title="Cancel Registration"
                                className="h-10 w-10 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                            >
                                <XCircle className="h-5 w-5" />
                            </Button>
                            <Link href={`/tickets/${reg.id}`}>
                                <div className="p-2 bg-secondary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                    <ArrowUpRight className="h-5 w-5" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </Card>
            ))}
            
            <Link href="/my-events" className="block mt-4">
                <Button variant="outline" className="w-full rounded-2xl h-14 font-black border-2 hover:bg-primary hover:text-white transition-all">
                    View All Tickets
                </Button>
            </Link>

            <ConfirmationModal 
                isOpen={!!regToCancel}
                onClose={() => setRegToCancel(null)}
                onConfirm={handleCancel}
                title="Cancel Registration?"
                message="Are you sure you want to cancel your registration for this event?"
                confirmText="Yes, Cancel"
                variant="danger"
            />
        </div>
    );
}
