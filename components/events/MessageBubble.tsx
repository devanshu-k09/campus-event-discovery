'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
    message: any;
    isOwnMessage: boolean;
    isHost?: boolean;
    onDelete?: (id: string) => void;
    canDelete?: boolean;
}

export function MessageBubble({ message, isOwnMessage, isHost, onDelete, canDelete }: MessageBubbleProps) {
    return (
        <div className={cn(
            "flex gap-3 mb-4 group animate-in fade-in slide-in-from-bottom-2 duration-300",
            isOwnMessage ? "flex-row-reverse" : "flex-row"
        )}>
            {/* Avatar */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm border border-slate-200 dark:border-slate-800 self-end mb-1">
                <Image 
                    src={message.user?.image || '/placeholder-avatar.jpg'} 
                    alt={message.user?.name || 'User'} 
                    fill 
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className={cn(
                "flex flex-col max-w-[80%] space-y-1",
                isOwnMessage ? "items-end" : "items-start"
            )}>
                <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {isOwnMessage ? 'You' : (message.user?.name || 'User')}
                    </span>
                    {isHost && (
                        <div className="flex items-center gap-0.5 bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">
                            <Shield className="w-2.5 h-2.5" />
                            <span className="text-[8px] font-black uppercase">Host</span>
                        </div>
                    )}
                </div>

                <div className="relative group/bubble">
                    <div className={cn(
                        "px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm break-words",
                        isOwnMessage 
                            ? "bg-primary text-white rounded-tr-none" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none"
                    )}>
                        {message.message}
                    </div>

                    {/* Delete Action */}
                    {canDelete && (
                        <button 
                            onClick={() => onDelete?.(message.id)}
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-rose-500 opacity-0 group-hover/bubble:opacity-100 transition-opacity shadow-lg",
                                isOwnMessage ? "right-full mr-2" : "left-full ml-2"
                            )}
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    )}
                </div>

                <span className="text-[9px] font-bold text-slate-400 uppercase px-1">
                    {format(new Date(message.createdAt), 'h:mm a')}
                </span>
            </div>
        </div>
    );
}
