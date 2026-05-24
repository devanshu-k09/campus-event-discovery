'use client';

import { useState, useRef } from 'react';
import { Send, Smile, Paperclip, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    onSendMessage: (message: string) => Promise<void>;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({ onSendMessage, disabled, placeholder }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isSending || disabled) return;

        setIsSending(true);
        try {
            await onSendMessage(message);
            setMessage('');
            inputRef.current?.focus();
        } finally {
            setIsSending(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
        >
            <div className="relative flex items-center gap-2 group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-violet-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                
                <div className="relative flex-1 flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-primary/50 transition-all px-4 h-12">
                    <button type="button" className="text-slate-400 hover:text-primary transition-colors p-1">
                        <Smile className="w-5 h-5" />
                    </button>
                    
                    <input 
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={placeholder || "Type a message..."}
                        disabled={disabled || isSending}
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    />

                    <button type="button" className="text-slate-400 hover:text-primary transition-colors p-1">
                        <Paperclip className="w-5 h-5" />
                    </button>
                </div>

                <Button 
                    type="submit" 
                    disabled={!message.trim() || isSending || disabled}
                    size="icon"
                    className="relative h-12 w-12 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 shrink-0 transition-all active:scale-90 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-full group-hover:animate-shimmer" />
                    {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </Button>
            </div>
            
            {disabled && (
                <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest mt-3">
                    Register for the event to join the conversation
                </p>
            )}
        </form>
    );
}
