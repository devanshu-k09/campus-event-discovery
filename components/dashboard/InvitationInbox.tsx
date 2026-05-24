'use client';

import { useState, useEffect } from 'react';
import { getMyInvitations, respondToInvitation } from '@/app/actions/collaboration';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Check, X, Loader2, Inbox, Info } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { format } from 'date-fns';

export function InvitationInbox() {
    const [invitations, setInvitations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchInvitations = async () => {
        setIsLoading(true);
        const result = await getMyInvitations();
        if (result.success) {
            setInvitations(result.invitations || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const handleResponse = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
        setProcessingId(id);
        const result = await respondToInvitation(id, status);
        if (result.success) {
            toast.success(status === 'ACCEPTED' ? 'Invitation accepted!' : 'Invitation declined');
            fetchInvitations();
        } else {
            toast.error(result.error || 'Failed to respond');
        }
        setProcessingId(null);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-slate-500 font-medium">Checking for invitations...</p>
            </div>
        );
    }

    if (invitations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Inbox className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">All caught up!</h3>
                <p className="text-sm text-slate-500">No pending invitations at the moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
                <Info className="w-4 h-4 text-primary" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending ({invitations.length})</p>
            </div>
            
            <div className="grid gap-4">
                {invitations.map((invite) => (
                    <div key={invite.id} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                        <div className="flex flex-col md:flex-row gap-6 p-6">
                            {/* Event Image */}
                            <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                                <Image 
                                    src={invite.event.image || '/placeholder-event.jpg'} 
                                    alt={invite.event.title} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                                        {invite.event.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            {format(new Date(invite.event.date), 'PPP')}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            {invite.event.location}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-primary/5 dark:bg-primary/10 px-4 py-2 rounded-xl border border-primary/10">
                                    <p className="text-xs font-bold text-primary">Role: {invite.role}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col gap-2 justify-end">
                                <Button
                                    onClick={() => handleResponse(invite.id, 'ACCEPTED')}
                                    disabled={!!processingId}
                                    className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 flex-1 md:flex-none"
                                >
                                    {processingId === invite.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-4 h-4 mr-2" /> Accept</>}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleResponse(invite.id, 'REJECTED')}
                                    disabled={!!processingId}
                                    className="rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 font-bold h-12 px-6 flex-1 md:flex-none"
                                >
                                    <X className="w-4 h-4 mr-2" /> Decline
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
