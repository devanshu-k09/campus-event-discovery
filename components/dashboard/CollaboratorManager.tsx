'use client';

import { useState } from 'react';
import { 
    Users, Plus, Mail, Shield, 
    Trash2, Loader2, CheckCircle2,
    Settings2, UserMinus, UserPlus,
    MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { inviteCollaborator, removeCollaborator, updateCollaboratorRole } from '@/app/actions/collaboration';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface CollaboratorManagerProps {
    eventId: string;
    initialCollaborators: any[];
    isOwner: boolean;
}

export function CollaboratorManager({ eventId, initialCollaborators, isOwner }: CollaboratorManagerProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'CO_HOST' | 'MANAGER'>('CO_HOST');
    const [isInviting, setIsInviting] = useState(false);
    const [collaborators, setCollaborators] = useState(initialCollaborators);

    const handleInvite = async () => {
        if (!email) return toast.error('Please enter an email');
        setIsInviting(true);
        const res = await inviteCollaborator(eventId, email, role);
        setIsInviting(false);

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success('Invitation sent successfully!');
            setEmail('');
            // Refresh list (in a real app we'd fetch or use revalidatePath)
        }
    };

    const handleRemove = async (id: string) => {
        const res = await removeCollaborator(id);
        if (res.error) {
            toast.error(res.error);
        } else {
            setCollaborators(prev => prev.filter(c => c.id !== id));
            toast.success('Collaborator removed');
        }
    };

    const handleUpdateRole = async (id: string, newRole: 'CO_HOST' | 'MANAGER') => {
        const res = await updateCollaboratorRole(id, newRole);
        if (res.error) {
            toast.error(res.error);
        } else {
            setCollaborators(prev => prev.map(c => c.id === id ? { ...c, role: newRole } : c));
            toast.success('Role updated');
        }
    };

    return (
        <div className="space-y-8">
            {/* Invitation Form */}
            {isOwner && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <UserPlus className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Expand the Team</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Invite a new host or manager</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                                placeholder="Enter collaborator email..." 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-11 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 font-medium"
                            />
                        </div>
                        <Select value={role} onValueChange={(val: any) => setRole(val)}>
                            <SelectTrigger className="w-full sm:w-[160px] h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 font-bold">
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800 p-2">
                                <SelectItem value="CO_HOST" className="rounded-xl py-2.5 font-bold">Co-Host</SelectItem>
                                <SelectItem value="MANAGER" className="rounded-xl py-2.5 font-bold">Manager</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button 
                            onClick={handleInvite} 
                            disabled={isInviting}
                            className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl font-black shadow-lg shadow-primary/20 transition-all active:scale-95 shrink-0 gap-2"
                        >
                            {isInviting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            Send Invitation
                        </Button>
                    </div>
                </div>
            )}

            {/* Collaborators List */}
            <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-4">Active Team Members ({collaborators.length})</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collaborators.map((collab) => (
                        <div key={collab.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-200/10 dark:shadow-none hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white dark:border-slate-800 group-hover:scale-105 transition-transform duration-300">
                                        <Image 
                                            src={collab.user?.image || '/placeholder-avatar.jpg'} 
                                            alt={collab.user?.name || 'User'} 
                                            fill 
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{collab.user?.name || 'User'}</p>
                                        <p className="text-[10px] font-black text-slate-400 truncate uppercase tracking-widest">{collab.user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-none",
                                        collab.role === 'CO_HOST' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                    )}>
                                        {collab.role}
                                    </Badge>
                                    
                                    {isOwner && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <MoreVertical className="w-4 h-4 text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-200 dark:border-slate-800">
                                                <DropdownMenuItem 
                                                    onClick={() => handleUpdateRole(collab.id, collab.role === 'CO_HOST' ? 'MANAGER' : 'CO_HOST')}
                                                    className="rounded-xl font-bold text-xs py-2.5 cursor-pointer gap-2"
                                                >
                                                    <Shield className="w-4 h-4" /> Change to {collab.role === 'CO_HOST' ? 'Manager' : 'Co-Host'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleRemove(collab.id)}
                                                    className="rounded-xl font-bold text-xs py-2.5 cursor-pointer gap-2 text-rose-500 focus:text-rose-500 focus:bg-rose-500/10"
                                                >
                                                    <UserMinus className="w-4 h-4" /> Remove from Team
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Status: <span className={cn("ml-1", collab.status === 'ACCEPTED' ? 'text-emerald-500' : 'text-amber-500')}>{collab.status}</span>
                                </p>
                                {collab.status === 'INVITED' && (
                                    <p className="text-[9px] font-bold text-slate-400 italic">Awaiting response...</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {collaborators.length === 0 && (
                        <div className="md:col-span-2 py-10 flex flex-col items-center justify-center text-center gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <Users className="w-10 h-10 text-slate-300" />
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No collaborators yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
