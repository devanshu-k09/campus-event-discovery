'use client';

import { useState, useEffect } from 'react';
import { Event, SmartEvent } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Heart, ExternalLink, GraduationCap, Trophy, Music, Laptop, Settings, Users as UsersIcon, Briefcase, HeartPulse, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { toggleLike, checkUserRegistration, registerForEvent } from '@/app/actions/event';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface EventCardProps {
    event: Event | SmartEvent;
    view?: 'grid' | 'list';
    onBookmark?: (eventId: string) => void;
    onRegister?: (eventId: string) => void;
    priority?: boolean;
}

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'Academic': return GraduationCap;
        case 'Sports': return Trophy;
        case 'Cultural': return Music;
        case 'Tech': return Laptop;
        case 'Workshop': return Settings;
        case 'Social': return UsersIcon;
        case 'Career': return Briefcase;
        case 'Health': return HeartPulse;
        default: return HelpCircle;
    }
};

const getBadgeStyles = (badge: string) => {
    const b = badge.toLowerCase();
    if (b === 'trending' || b === 'selling fast' || b === 'live event') {
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
    if (b === 'featured' || b === 'ai pick') {
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
    if (b === 'new') {
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
    if (b === 'free') {
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
    if (b === 'paid') {
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    }
    if (b === 'online') {
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
    }
    if (b === 'hybrid') {
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    }
    if (b === 'physical') {
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
    }
    return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
};

export default function EventCard({
    event,
    view = 'grid',
    onBookmark,
    onRegister,
    priority = false
}: EventCardProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLiked, setIsLiked] = useState(event.isLiked || false);
    const [isLiking, setIsLiking] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (session?.user && event.id) {
            checkUserRegistration(event.id).then(res => {
                if (res.registered) {
                    setIsRegistered(true);
                }
            }).catch(err => console.error("Error checking registration:", err));
        }
    }, [session, event.id]);

    const isExternal = event.eventSource === 'external';
    const isSoldOut = event.capacity > 0 && (event.registeredCount || 0) >= event.capacity;
    
    // Dynamic badges list creation
    const badges: string[] = [];
    if ('badges' in event && Array.isArray(event.badges)) {
        event.badges.forEach((b: string) => {
            if (b && !badges.includes(b)) badges.push(b);
        });
    }
    if ((event as any).isFeatured && !badges.includes('Featured')) {
        badges.push('Featured');
    }
    if (event.category && !badges.includes(event.category)) {
        badges.push(event.category);
    }
    if (event.eventType && !badges.includes(event.eventType)) {
        badges.push(event.eventType);
    }
    const priceLabel = Number(event.price) === 0 ? 'Free' : 'Paid';
    if (!badges.includes(priceLabel)) {
        badges.push(priceLabel);
    }

    const visibleBadges = badges.slice(0, 3);
    const extraBadgesCount = badges.length - 3;

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            toast.error("Please login to bookmark events");
            return;
        }

        setIsLiking(true);
        const nextLikedState = !isLiked;
        setIsLiked(nextLikedState);

        try {
            const res = await toggleLike(event.id);
            if (res.success) {
                setIsLiked(res.liked || false);
                toast.success(res.liked ? "Added to favorites" : "Removed from favorites");
                onBookmark?.(event.id);
            } else {
                setIsLiked(!nextLikedState);
                toast.error(res.error || "Failed to update bookmark");
            }
        } catch (error) {
            setIsLiked(!nextLikedState);
            toast.error("Something went wrong");
        } finally {
            setIsLiking(false);
        }
    };

    const handleRegister = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            toast.error("Please log in to register");
            router.push('/login');
            return;
        }

        if (isExternal) {
            window.open(event.externalLink || '#', '_blank', 'noopener,noreferrer');
            return;
        }

        if (onRegister) {
            onRegister(event.id);
            return;
        }

        setRegistering(true);
        try {
            const res = await registerForEvent(event.id);
            if (res.success) {
                toast.success(res.message || "Registered successfully!");
                setIsRegistered(true);
                router.refresh();
            } else {
                toast.error(res.error || "Failed to register");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred during registration");
        } finally {
            setRegistering(false);
        }
    };

    const formattedDate = () => {
        if (!event.date) return 'Date TBA';
        try {
            const d = new Date(event.date);
            if (isNaN(d.getTime())) return 'Date TBA';
            const dateStr = format(d, 'MMM dd, yyyy');
            const timeStr = event.time ? ` • ${event.time}` : ' • Time TBA';
            return `${dateStr}${timeStr}`;
        } catch {
            return 'Date TBA';
        }
    };

    const capacity = event.capacity || 0;
    const registeredCount = event.registeredCount || 0;
    const hasCapacity = capacity > 0;
    const spotsLeft = hasCapacity ? Math.max(0, capacity - registeredCount) : 0;
    const capacityPercentage = hasCapacity ? Math.min((registeredCount / capacity) * 100, 100) : 0;

    const getProgressColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-rose-500';
        if (percentage >= 75) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const renderImage = () => {
        const imageUrl = event.image;
        if (!imageUrl || imageError) {
            const Icon = getCategoryIcon(event.category || '');
            return (
                <div className="w-full h-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col items-center justify-center gap-3 p-4">
                    <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-indigo-400">
                        <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">{event.category || 'Event'}</span>
                </div>
            );
        }
        return (
            <Image
                src={imageUrl}
                alt={event.title || 'Untitled Event'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(true)}
                priority={priority}
            />
        );
    };

    const targetUrl = isExternal ? (event.externalLink || '#') : `/events/${event.id}`;

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="h-full group"
        >
            <Card className={cn(
                "overflow-hidden h-full flex flex-col bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 rounded-2xl relative",
                view === 'list' ? "flex-row md:h-56" : ""
            )}>
                <Link 
                    href={targetUrl} 
                    target={isExternal ? "_blank" : "_self"}
                    rel={isExternal ? "noopener noreferrer" : ""}
                    className="absolute inset-0 z-10"
                    aria-label={`View details for ${event.title}`}
                />
                    {/* Image Area */}
                    <div className={cn(
                        "relative overflow-hidden shrink-0",
                        view === 'grid' ? "h-[180px] w-full" : "w-1/3 min-w-[33%] h-full"
                    )}>
                        {renderImage()}

                        {/* Gradient Overlay for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                        {/* Top Badges (Top-Left) */}
                        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[calc(100%-3rem)]">
                            {visibleBadges.map((badge, idx) => (
                                <span
                                    key={idx}
                                    className={cn(
                                        "px-2 py-0.5 text-[10px] font-bold rounded-md uppercase border tracking-wider backdrop-blur-sm shadow-sm",
                                        getBadgeStyles(badge)
                                    )}
                                >
                                    {badge}
                                </span>
                            ))}
                            {extraBadgesCount > 0 && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase border border-slate-500/30 bg-slate-500/20 text-slate-300 backdrop-blur-sm shadow-sm">
                                    +{extraBadgesCount}
                                </span>
                            )}
                        </div>

                        {/* Wishlist Icon (Top-Right) */}
                        <button
                            suppressHydrationWarning
                            disabled={isLiking}
                            onClick={handleBookmark}
                            className={cn(
                                "absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-slate-950/25 dark:bg-slate-900/30 backdrop-blur-md hover:bg-slate-950/50 dark:hover:bg-slate-900/50 border border-white/10 transition-all text-white hover:scale-110 active:scale-95 shadow-sm cursor-pointer",
                                isLiked ? "text-rose-500" : "text-white hover:text-rose-400"
                            )}
                            aria-label="Wishlist event"
                        >
                            <Heart className={cn("w-4 h-4 transition-transform", isLiked && "fill-current")} />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col flex-1 p-5">
                        <div className="space-y-3 flex-1">
                            {/* Title */}
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[2.5rem]">
                                    {event.title || 'Untitled Event'}
                                </h3>
                                {isExternal && (
                                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                )}
                            </div>

                            {/* Meta Info */}
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span suppressHydrationWarning>{mounted ? formattedDate() : 'Loading date...'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span className="line-clamp-1">
                                        {event.eventType === 'ONLINE' ? 'Virtual Session' : (event.locationName || event.location || 'Venue not announced')}
                                    </span>
                                </div>
                            </div>

                            {/* Seats Left Row */}
                            {hasCapacity && (
                                <div className="space-y-1 pt-1">
                                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                        <span className={cn(spotsLeft < 10 ? "text-rose-500" : "")}>
                                            {spotsLeft} spots left
                                        </span>
                                        <span>{Math.round(capacityPercentage)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all duration-500 ease-out", getProgressColor(capacityPercentage))}
                                            style={{ width: `${capacityPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Area */}
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                            {/* Price */}
                            <div className="font-bold text-slate-900 dark:text-white text-sm shrink-0">
                                {Number(event.price) === 0 ? (
                                    <span className="text-emerald-500 font-extrabold text-base">Free</span>
                                ) : (
                                    <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">₹{Number(event.price).toFixed(2)}</span>
                                )}
                            </div>

                            {/* Register/Details Button */}
                            <Button
                                disabled={registering || isSoldOut || isRegistered}
                                onClick={handleRegister}
                                size="sm"
                                className={cn(
                                    "relative z-20 font-semibold rounded-xl text-xs px-4 py-2 transition-all cursor-pointer shadow-sm hover:shadow-md",
                                    isRegistered 
                                        ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100"
                                        : isSoldOut
                                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-200"
                                        : isExternal
                                        ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/10 hover:shadow-indigo-500/20"
                                )}
                            >
                                {isRegistered 
                                    ? 'Registered' 
                                    : isSoldOut 
                                    ? 'Sold Out' 
                                    : isExternal 
                                    ? 'Get Tickets' 
                                    : 'Register'}
                            </Button>
                        </div>
                    </div>
                </Card>
        </motion.div>
    );
}
