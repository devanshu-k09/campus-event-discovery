'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    MapPin, 
    Calendar, 
    Users, 
    ShieldCheck, 
    Globe, 
    Twitter, 
    Instagram, 
    ChevronRight,
    Award,
    CalendarCheck,
    ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { getOrganizerById } from '@/app/actions/event';
import { toggleFollow, getFollowStatus } from '@/app/actions/user';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventsSkeleton } from '@/components/events/EventsSkeleton';
import EventCard from '@/components/events/EventCard';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function OrganizerProfilePage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const [organizer, setOrganizer] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    useEffect(() => {
        const fetchOrganizer = async () => {
            setLoading(true);
            try {
                const [data, followData] = await Promise.all([
                    getOrganizerById(id as string),
                    getFollowStatus(id as string)
                ]);
                if (data) {
                    setOrganizer(data);
                }
                setIsFollowing(followData.isFollowing);
            } catch (error) {
                console.error("Failed to fetch organizer:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrganizer();
    }, [id]);

    const handleFollow = async () => {
        if (!session) {
            toast.error("Please log in to follow organizations");
            return;
        }

        setIsFollowLoading(true);
        try {
            const res = await toggleFollow(id as string);
            if (res.success) {
                setIsFollowing(res.isFollowing!);
                toast.success(res.isFollowing ? `Now following ${organizer.name}` : `Unfollowed ${organizer.name}`);
            } else {
                toast.error(res.error || "Failed to update follow status");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsFollowLoading(false);
        }
    };

    if (loading) return <EventsSkeleton />;
    if (!organizer) notFound();

    const totalAttendees = organizer.events.reduce((acc: number, event: any) => acc + event.registeredCount, 0);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
            {/* Header / Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 pt-24 mb-8">
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/events" className="hover:text-primary transition-colors">Events</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 dark:text-white font-medium">{organizer.name}</span>
                </nav>

                {/* Organizer Hero Card */}
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/20 via-indigo-500/20 to-purple-500/20"></div>
                    
                    <div className="relative px-6 pb-8 pt-12 md:px-12 md:pb-12 md:pt-16 flex flex-col md:flex-row items-start md:items-center gap-8">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl relative z-10">
                                <Image 
                                    src={organizer.image || `https://i.pravatar.cc/150?u=${organizer.id}`} 
                                    alt={organizer.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg z-20 border-2 border-white dark:border-slate-900">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Bio / Info */}
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{organizer.name}</h1>
                                <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1">Verified Host</Badge>
                            </div>
                            
                             <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                                {organizer.bio || ""}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {organizer.collegeName || ""}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    Member since {format(new Date(organizer.createdAt), 'MMM yyyy')}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="w-full md:w-auto flex flex-col gap-3">
                            <Button 
                                onClick={handleFollow}
                                disabled={isFollowLoading}
                                className={cn(
                                    "w-full md:w-48 font-bold shadow-lg transition-all",
                                    isFollowing 
                                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 shadow-none" 
                                        : "shadow-primary/20"
                                )} 
                                size="lg"
                            >
                                {isFollowing ? "Following" : "Follow Organization"}
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="rounded-xl"><Globe className="w-4 h-4" /></Button>
                                <Button variant="outline" size="icon" className="rounded-xl"><Twitter className="w-4 h-4" /></Button>
                                <Button variant="outline" size="icon" className="rounded-xl"><Instagram className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                        <div className="p-6 text-center border-r border-slate-100 dark:border-slate-800">
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{organizer.events.length}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Events Hosted</p>
                        </div>
                        <div className="p-6 text-center md:border-r border-slate-100 dark:border-slate-800">
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{totalAttendees}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Attendees</p>
                        </div>
                        <div className="p-6 text-center border-r border-slate-100 dark:border-slate-800">
                            <p className="text-2xl font-black text-slate-900 dark:text-white">4.9/5</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Average Rating</p>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-2xl font-black text-slate-900 dark:text-white">12</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Awards Won</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs / Sections */}
            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Events by {organizer.name}</h2>
                        <p className="text-slate-500 text-sm mt-1">Discover what they are hosting this semester</p>
                    </div>
                    <Link href="/events" className="hidden md:flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                        Explore all events <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                {organizer.events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {organizer.events.map((event: any) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <EventCard event={event} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <CalendarCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No active events</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">This organization hasn't published any public events yet. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
