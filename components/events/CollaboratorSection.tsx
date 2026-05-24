'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, X, Loader2, Mail, Shield, User as UserIcon, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { inviteCollaborator, getCollaborators, removeCollaborator } from '@/app/actions/collaboration';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CollaboratorSectionProps {
    eventId?: string;
    isOwner: boolean;
    localCollaborators?: any[];
    onLocalUpdate?: (collaborators: any[]) => void;
}

export function CollaboratorSection({ 
    eventId, 
    isOwner, 
    localCollaborators = [], 
    onLocalUpdate 
}: CollaboratorSectionProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'CO_HOST' | 'MANAGER'>('CO_HOST');
    const [isInviting, setIsInviting] = useState(false);
    const [collaborators, setCollaborators] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const isLocalMode = !eventId;

    const fetchCollaborators = async () => {
        if (isLocalMode) return;
        setIsLoading(true);
        const result = await getCollaborators(eventId!);
        if (result.success) {
            setCollaborators(result.collaborators || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!isLocalMode) {
            fetchCollaborators();
        }
    }, [eventId]);

    const handleInvite = async (e?: React.BaseSyntheticEvent) => {
        if (e) e.preventDefault();
        if (!email) return;

        if (isLocalMode) {
            if (localCollaborators.some(c => c.email === email)) {
                toast.error('Collaborator already added');
                return;
            }
            const newCollab = {
                id: Math.random().toString(36).substr(2, 9),
                user: { email, name: email.split('@')[0], image: null },
                role,
                status: 'PENDING',
                email // Store email directly for easy access
            };
            if (onLocalUpdate) {
                onLocalUpdate([...localCollaborators, newCollab]);
            }
            setEmail('');
            toast.success('Collaborator added to list');
            return;
        }

        setIsInviting(true);
        const result = await inviteCollaborator(eventId!, email, role);
        if (result.success) {
            toast.success('Invitation sent successfully!');
            setEmail('');
            fetchCollaborators();
        } else {
            toast.error(result.error || 'Failed to send invitation');
        }
        setIsInviting(false);
    };

    const handleRemove = async (id: string, collabEmail?: string) => {
        if (isLocalMode) {
            if (onLocalUpdate) {
                onLocalUpdate(localCollaborators.filter(c => c.id !== id));
            }
            toast.success('Collaborator removed');
            return;
        }

        const result = await removeCollaborator(id);
        if (result.success) {
            toast.success('Collaborator removed');
            fetchCollaborators();
        } else {
            toast.error(result.error || 'Failed to remove collaborator');
        }
    };

    const displayCollaborators = isLocalMode ? localCollaborators : collaborators;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-primary/10 rounded-2xl shadow-inner shadow-primary/5">
                    <Users className="text-primary w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Team <span className="text-primary italic">Collaboration</span></h2>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-0.5">Scale your impact with a professional team</p>
                </div>
            </div>

            {isOwner && (
                <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-8 relative overflow-hidden group/container">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover/container:bg-primary/10 transition-colors" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="collab-email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Member Email</Label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/input:text-primary transition-colors" />
                                <Input
                                    id="collab-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g., organizer@campus.edu"
                                    className="pl-11 h-14 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/10 transition-all font-bold text-sm shadow-inner"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Team Role</Label>
                            <Select value={role} onValueChange={(v: any) => setRole(v)}>
                                <SelectTrigger className="h-14 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/10 transition-all font-bold text-sm px-6 shadow-inner w-full md:min-w-[180px] [&_[data-slot=select-value]]:line-clamp-none">
                                    <div className="flex items-center gap-3 w-full">
                                        <Shield className="w-5 h-5 text-primary shrink-0" />
                                        <SelectValue />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-[2rem] border-slate-200 dark:border-slate-800 shadow-2xl p-2">
                                    <SelectItem value="CO_HOST" className="rounded-2xl py-4 px-5 focus:bg-primary/5 group/item">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-black text-sm uppercase tracking-tight group-hover/item:text-primary transition-colors">CO-HOST</span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Full editing and administrative access</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="MANAGER" className="rounded-2xl py-4 px-5 focus:bg-amber-500/5 group/item">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-black text-sm uppercase tracking-tight group-hover/item:text-amber-500 transition-colors">MANAGER</span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Check-in and analytics management only</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <Button 
                        type="button"
                        onClick={handleInvite}
                        disabled={isInviting || !email} 
                        className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-95 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                        {isInviting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <div className="flex items-center justify-center gap-3">
                                <UserPlus className="w-5 h-5" />
                                <span>{isLocalMode ? 'Add to Team' : 'Send Invitation'}</span>
                            </div>
                        )}
                    </Button>
                </div>
            )}

            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Active Collaborators ({displayCollaborators.length})</h3>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/10 dark:shadow-none">
                        <div className="relative">
                           <Loader2 className="w-12 h-12 animate-spin text-primary/20" />
                           <div className="absolute inset-0 flex items-center justify-center">
                               <Users className="w-5 h-5 text-primary" />
                           </div>
                        </div>
                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-6">Fetching Team Members...</p>
                    </div>
                ) : displayCollaborators.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50/30 dark:bg-slate-950/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-100 dark:border-slate-800">
                            <Users className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Team is empty</h4>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Add collaborators to share the load.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayCollaborators.map((collab) => (
                            <div key={collab.id} className="group flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                                <div className="flex items-center gap-5 min-w-0">
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 shrink-0 group-hover:scale-105 transition-transform duration-500">
                                        {collab.user.image ? (
                                            <Image src={collab.user.image} alt={collab.user.name || ''} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <UserIcon className="w-6 h-6 text-slate-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black text-slate-900 dark:text-white text-sm truncate tracking-tight">
                                            {collab.user.name || collab.user.email.split('@')[0]}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-black truncate uppercase tracking-[0.05em] mt-0.5">
                                            {collab.user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end gap-1.5">
                                        <Badge 
                                            className={cn(
                                                "text-[8px] font-black uppercase tracking-widest h-6 rounded-full px-3 border-none shadow-sm",
                                                collab.status === 'ACCEPTED' ? "bg-emerald-500 text-white" :
                                                collab.status === 'REJECTED' ? "bg-rose-500 text-white" :
                                                "bg-amber-500 text-white"
                                            )}
                                        >
                                            {collab.status}
                                        </Badge>
                                        <Badge variant="outline" className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 whitespace-nowrap">
                                            {collab.role.replace('_', '-')}
                                        </Badge>
                                    </div>
                                    
                                    {isOwner && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleRemove(collab.id, collab.user.email)}
                                            className="h-10 w-10 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all shrink-0"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
