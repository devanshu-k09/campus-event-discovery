'use client';

import { Calendar, MapPin, Users, MoreHorizontal, Edit, Eye, Trash2, Send, Shield, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TeamEventCardProps {
    event: any;
    currentUserId: string;
}

export function TeamEventCard({ event, currentUserId }: TeamEventCardProps) {
    const isOwner = event.organizerId === currentUserId;
    const collaborator = event.collaborators?.find((c: any) => c.userId === currentUserId);
    const role = isOwner ? 'OWNER' : collaborator?.role || 'MEMBER';

    const roleColors = {
        OWNER: 'bg-indigo-500 shadow-indigo-500/20',
        CO_HOST: 'bg-emerald-500 shadow-emerald-500/20',
        MANAGER: 'bg-amber-500 shadow-amber-500/20',
        MEMBER: 'bg-slate-500 shadow-slate-500/20',
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none hover:shadow-2xl hover:shadow-slate-200/40 dark:hover:border-primary/30 transition-all duration-500 group overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                
                {/* Image Section */}
                <div className="relative w-full md:w-48 aspect-video md:aspect-square rounded-[2rem] overflow-hidden shrink-0 shadow-lg">
                    <Image 
                        src={event.image || '/placeholder-event.jpg'} 
                        alt={event.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3">
                        <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-none text-white shadow-lg", roleColors[role as keyof typeof roleColors])}>
                            {role}
                        </Badge>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-4 w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{event.category}</p>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors leading-tight">
                                {event.title}
                            </h3>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-200 dark:border-slate-800 min-w-[180px]">
                                <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer gap-2 font-bold text-sm py-2.5">
                                    <Link href={`/events/${event.id}`}><Eye className="w-4 h-4" /> View Live</Link>
                                </DropdownMenuItem>
                                {(role === 'OWNER' || role === 'CO_HOST') && (
                                    <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer gap-2 font-bold text-sm py-2.5">
                                        <Link href={`/edit-event/${event.id}`}><Edit className="w-4 h-4" /> Edit Event</Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer gap-2 font-bold text-sm py-2.5">
                                    <Link href={`/team-dashboard/events/${event.id}/attendees`}><Users className="w-4 h-4" /> Manage Attendees</Link>
                                </DropdownMenuItem>
                                {role === 'OWNER' && (
                                    <DropdownMenuItem className="rounded-xl focus:bg-rose-500/10 focus:text-rose-500 cursor-pointer gap-2 font-bold text-sm py-2.5 text-rose-500">
                                        <Trash2 className="w-4 h-4" /> Delete Event
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold">{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold truncate max-w-[150px]">{event.location || 'Online'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold">{event._count?.registrations || 0} Registered</span>
                        </div>
                    </div>

                    {/* Team Avatars */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3 overflow-hidden">
                                {/* Organizer */}
                                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 relative group/avatar">
                                    <Image 
                                        src={event.organizer?.image || '/placeholder-avatar.jpg'} 
                                        alt={event.organizer?.name || 'Owner'} 
                                        fill 
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/50 rounded-full" />
                                </div>
                                {/* Collaborators */}
                                {event.collaborators?.slice(0, 3).map((collab: any, idx: number) => (
                                    <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 relative">
                                        <Image 
                                            src={collab.user?.image || '/placeholder-avatar.jpg'} 
                                            alt={collab.user?.name || 'User'} 
                                            fill 
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                                {event.collaborators?.length > 3 && (
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800">
                                        <span className="text-[10px] font-black text-slate-500">+{event.collaborators.length - 3}</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team {1 + (event.collaborators?.length || 0)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-none",
                                event.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'
                            )}>
                                {event.status}
                            </Badge>
                            <Link href={`/team-dashboard/events/${event.id}`}>
                                <Button size="sm" variant="ghost" className="rounded-xl h-8 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 gap-1.5 px-3">
                                    Manage <ExternalLink className="w-3 h-3" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
