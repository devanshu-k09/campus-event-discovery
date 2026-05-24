'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMyRegistrations } from '@/app/actions/event';
import { motion } from 'framer-motion';
import { 
    QrCode, 
    Calendar, 
    MapPin, 
    Clock, 
    ArrowLeft, 
    Download, 
    Share2, 
    Info,
    Loader2,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function TicketPage() {
    const params = useParams();
    const router = useRouter();
    const [registration, setRegistration] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const regs = await getMyRegistrations();
                const ticket = regs.find((r: any) => r.id === params.id);
                if (ticket) {
                    setRegistration(ticket);
                } else {
                    // Not found or unauthorized
                    console.error('Ticket not found');
                }
            } catch (error) {
                console.error('Failed to fetch ticket:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground animate-pulse font-black uppercase tracking-widest text-xs">Authenticating Ticket...</p>
            </div>
        );
    }

    if (!registration) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-border/40 text-center max-w-md w-full">
                    <div className="bg-rose-500/10 p-4 rounded-full inline-block mb-6">
                        <AlertTriangle className="w-10 h-10 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-2">Ticket Not Found</h2>
                    <p className="text-muted-foreground mb-8 font-medium">This ticket might have been cancelled, or you don't have permission to view it.</p>
                    <Button asChild className="w-full rounded-2xl h-14 font-black text-lg">
                        <Link href="/dashboard">Return to Dashboard</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const { event } = registration;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 selection:bg-primary/20">
            <div className="max-w-xl mx-auto">
                
                {/* Back Link */}
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs">Back to Dashboard</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    {/* Ticket Design */}
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-border/40">
                        
                        {/* Event Header */}
                        <div className="relative h-64 overflow-hidden">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <Badge className={cn(
                                    "mb-4 border-none font-black uppercase tracking-widest px-3 py-1 text-[10px] rounded-full",
                                    registration.status === 'registered' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                                )}>
                                    {registration.status === 'registered' ? 'Confirmed Entry' : 'Waitlist Status'}
                                </Badge>
                                <h1 className="text-3xl font-black text-white leading-tight">{event.title}</h1>
                            </div>
                        </div>

                        {/* Ticket Body */}
                        <div className="p-8 sm:p-10 space-y-10">
                            
                            {/* Key Info Grid */}
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <p className="font-black text-sm">{format(new Date(event.date), 'EEE, MMM dd, yyyy')}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <p className="font-black text-sm">{event.time}</p>
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <p className="font-black text-sm">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Separator Line */}
                            <div className="relative">
                                <div className="absolute left-[-2.5rem] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border-r border-border/40" />
                                <div className="absolute right-[-2.5rem] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border-l border-border/40" />
                                <div className="border-t-2 border-dashed border-border/60" />
                            </div>

                            {/* Ticket Controls & QR */}
                            <div className="flex flex-col items-center gap-8">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2.5rem] border border-border/20 shadow-inner relative group">
                                    {registration.status === 'registered' ? (
                                        <div className="relative">
                                            <img 
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${registration.id}&color=0f172a&bgcolor=f8fafc`} 
                                                alt="Ticket QR Code"
                                                className="w-32 h-32 opacity-90 mix-blend-multiply dark:mix-blend-normal dark:invert"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-border/40">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 flex flex-col items-center justify-center text-center gap-3">
                                            <div className="relative opacity-20 grayscale">
                                                <QrCode className="w-16 h-16" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest leading-none text-amber-600 dark:text-amber-400">Waitlist</p>
                                                <p className="text-[8px] font-bold uppercase tracking-tighter text-muted-foreground opacity-60">Pending Approval</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <p className="font-black text-sm tracking-widest uppercase mb-1">Pass ID: {registration.id.toUpperCase()}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold">Issued to {registration.userId} • Non-transferable</p>
                                </div>
                            </div>

                        </div>

                        {/* Footer Controls */}
                        <div className="bg-slate-50 dark:bg-slate-800/30 p-6 flex items-center justify-between gap-4 border-t border-border/40 print:hidden">
                            <Button 
                                variant="ghost" 
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: `Ticket for ${event.title}`,
                                            text: `Check out my ticket for ${event.title}!`,
                                            url: window.location.href,
                                        }).catch(console.error);
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success('Link copied to clipboard!');
                                    }
                                }}
                                className="flex-1 rounded-xl font-black gap-2 h-12"
                            >
                                <Share2 className="w-4 h-4" /> Share
                            </Button>
                            <Button 
                                onClick={() => window.print()}
                                className="flex-1 rounded-xl font-black gap-2 h-12 shadow-xl shadow-primary/20"
                            >
                                <Download className="w-4 h-4" /> Save PDF
                            </Button>
                        </div>

                    </div>

                    {/* Additional Notes */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 flex gap-4 print:hidden"
                    >
                        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm h-fit">
                            <Info className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="font-black text-sm mb-1">Entry Guidelines</h4>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                Please arrive at least 15 minutes before the start time. Show this digital pass at the entrance for verification.
                            </p>
                        </div>
                    </motion.div>

                </motion.div>
            </div>

            <style jsx global>{`
                @media print {
                    nav, .print\\:hidden {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        padding: 0 !important;
                    }
                    .container {
                        max-width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .shadow-2xl {
                        box-shadow: none !important;
                        border: 1px solid #e2e8f0 !important;
                    }
                }
            `}</style>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
