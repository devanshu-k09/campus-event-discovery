'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    MessageSquare, X, Users, Settings, 
    Bell, Minimize2, Maximize2, Loader2,
    ShieldCheck, Sparkles, Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { pusherClient } from '@/lib/pusher-client';
import { sendChatMessage, getChatMessages, deleteChatMessage } from '@/app/actions/chat';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface EventChatProps {
    eventId: string;
    currentUser: any;
    isRegistered: boolean;
    isHost: boolean;
    eventName: string;
}

export function EventChat({ eventId, currentUser, isRegistered, isHost, eventName }: EventChatProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        const fetchMessages = async () => {
            const res = await getChatMessages(eventId);
            if (res.success) {
                setMessages(res.messages || []);
            }
            setIsLoading(false);
        };
        fetchMessages();
    }, [eventId]);

    // Pusher Subscription
    useEffect(() => {
        if (!pusherClient) return;

        const channel = pusherClient.subscribe(`event-chat-${eventId}`);

        const handleNewMessage = (data: any) => {
            setMessages(prev => {
                if (prev.some(m => m.id === data.id)) return prev;
                return [...prev, data];
            });
            setIsOpen(currentIsOpen => {
                if (!currentIsOpen) {
                    setUnreadCount(prev => prev + 1);
                }
                return currentIsOpen;
            });
        };

        const handleDeleteMessage = (data: { messageId: string }) => {
            setMessages(prev => prev.filter(m => m.id !== data.messageId));
        };

        channel.bind('new-message', handleNewMessage);
        channel.bind('delete-message', handleDeleteMessage);

        return () => {
            channel.unbind('new-message', handleNewMessage);
            channel.unbind('delete-message', handleDeleteMessage);
            pusherClient.unsubscribe(`event-chat-${eventId}`);
        };
    }, [eventId]);

    // Auto Scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (text: string) => {
        const res = await sendChatMessage(eventId, text);
        if (res.error) {
            toast.error(res.error);
        } else if (res.message) {
            setMessages(prev => {
                if (prev.some(m => m.id === res.message.id)) return prev;
                return [...prev, res.message];
            });
        }
    };

    const handleDeleteMessage = async (id: string) => {
        // Optimistically remove
        setMessages(prev => prev.filter(m => m.id !== id));
        const res = await deleteChatMessage(id);
        if (res.error) {
            toast.error(res.error);
            // On error, we'd ideally fetch again, but simple toast is ok
        } else {
            toast.success('Message deleted');
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setUnreadCount(0);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <Button
                onClick={toggleChat}
                className={cn(
                    "fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl z-50 transition-all duration-500 hover:scale-110 active:scale-95 group overflow-hidden",
                    isOpen ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "bg-primary text-white"
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-full group-hover:animate-shimmer" />
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {unreadCount > 0 && !isOpen && (
                    <span className="absolute -top-1 -right-1 h-6 w-6 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </Button>

            {/* Chat Panel */}
            <div className={cn(
                "fixed bottom-28 right-8 w-[90vw] sm:w-[400px] h-[70vh] bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-none border border-slate-200/60 dark:border-slate-800/60 z-50 flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right",
                isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
            )}>
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <Hash className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight truncate max-w-[180px]">
                                    {eventName}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Live Chat
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isHost && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest px-2 h-6 border-none">
                                    Host Mode
                                </Badge>
                            )}
                            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-hidden relative bg-slate-50/30 dark:bg-slate-950/30">
                    <ScrollArea className="h-full px-6" ref={scrollRef}>
                        <div className="py-8 space-y-2">
                            {/* Intro Message */}
                            <div className="flex flex-col items-center justify-center text-center p-8 mb-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Welcome to the event chat!</h4>
                                <p className="text-[11px] text-slate-400 font-bold mt-1 max-w-[200px]">Only registered attendees can participate in the live conversation.</p>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary/30" />
                                </div>
                            ) : messages.map((msg) => (
                                <MessageBubble 
                                    key={msg.id}
                                    message={msg}
                                    isOwnMessage={msg.userId === currentUser?.id}
                                    isHost={msg.userId === eventId} // Simplified host check for now
                                    onDelete={handleDeleteMessage}
                                    canDelete={isHost || msg.userId === currentUser?.id}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Input Area */}
                <ChatInput 
                    onSendMessage={handleSendMessage} 
                    disabled={!isRegistered && !isHost}
                    placeholder={!isRegistered && !isHost ? "Register to join the chat" : "Message #event-chat..."}
                />
            </div>
        </>
    );
}
