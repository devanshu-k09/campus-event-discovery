'use client';

import { formatDistanceToNow } from 'date-fns';
import { 
    Plus, Edit, Send, Users, Shield, 
    CheckCircle2, AlertCircle, Info, Trash2,
    Calendar, MapPin, Globe, Laptop
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
    activities: any[];
}

const actionIcons: Record<string, any> = {
    'created event': { icon: Plus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    'edited event': { icon: Edit, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    'published event': { icon: Send, color: 'text-primary', bg: 'bg-primary/10' },
    'invited collaborator': { icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    'updated role': { icon: Shield, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    'new registration': { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    'cancelled event': { icon: Trash2, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    'default': { icon: Info, color: 'text-slate-500', bg: 'bg-slate-500/10' }
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
    if (!activities || activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl mb-4">
                    <Info className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">No recent activity</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">Start collaborating to see updates here</p>
            </div>
        );
    }

    return (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
            {activities.map((activity, idx) => {
                const actionType = activity.action.toLowerCase();
                const { icon: Icon, color, bg } = actionIcons[actionType] || actionIcons['default'];

                return (
                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                        
                        {/* Dot / Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 shadow-xl z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-transform group-hover:scale-110 duration-300 overflow-hidden bg-white dark:bg-slate-900">
                           <div className={cn("w-full h-full flex items-center justify-center", bg)}>
                               <Icon className={cn("w-5 h-5", color)} />
                           </div>
                        </div>

                        {/* Card Content */}
                        <div className="w-[calc(100%-4rem)] md:w-[45%] bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-200/20 dark:shadow-none hover:shadow-2xl transition-all duration-300 group/card">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100 dark:border-slate-800">
                                        <Image 
                                            src={activity.user?.image || '/placeholder-avatar.jpg'} 
                                            alt={activity.user?.name || 'User'} 
                                            fill 
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black text-slate-900 dark:text-white truncate tracking-tight">
                                            {activity.user?.name || activity.user?.email}
                                        </p>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{activity.action}</p>
                                    </div>
                                </div>
                                <time className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                </time>
                            </div>

                            <div className="space-y-3">
                                {activity.event && (
                                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 group/event hover:border-primary/30 transition-all">
                                        <div className="p-1.5 bg-primary/10 rounded-lg">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate">{activity.event.title}</p>
                                    </div>
                                )}
                                {activity.details && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                                        "{activity.details}"
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
