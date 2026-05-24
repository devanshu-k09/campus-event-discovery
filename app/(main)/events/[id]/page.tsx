'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format, isPast } from 'date-fns';
import {
    MapPin,
    Calendar,
    Share2,
    Bookmark,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Users,
    Settings,
    Ticket,
    Copy,
    Facebook,
    Twitter,
    Linkedin,
    CalendarPlus,
    UserPlus,
    PenTool,
    Clock,
    AlertCircle,
    Star,
    Award,
    Eye,
    Code,
    MessageSquare,
    ThumbsUp,
    Loader2,
    Play
} from 'lucide-react';

import { getEventById, registerForEvent, checkUserRegistration, cancelRegistration, deleteEvent, getPublishedEvents } from '@/app/actions/event';
import EventCard from '@/components/events/EventCard';
import { toggleFollow, getFollowStatus } from '@/app/actions/user';
import { generateTicketPDF } from '@/lib/ticket-generator';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { useSession } from 'next-auth/react';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EventsSkeleton } from '@/components/events/EventsSkeleton';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from '@/app/actions/event';
import { trackInteraction } from '@/app/actions/interaction';
import { EventBadges } from '@/components/events/EventBadges';
import { CountdownTimer } from '@/components/events/CountdownTimer';
import { Laptop, Globe, Video, ExternalLink, Navigation } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { EventChat } from '@/components/events/EventChat';
import { calculateCurrentPrice } from '@/lib/pricing';
import { PriceUrgencyBadge } from '@/components/events/PriceUrgencyBadge';
import { TrendingUp, Flame, Info, IndianRupee } from 'lucide-react';

export default function EventDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [event, setEvent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registrationId, setRegistrationId] = useState<string | null>(null);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [similarEvents, setSimilarEvents] = useState<any[]>([]);
    const pricingData = event ? calculateCurrentPrice(event) : null;
    
    const handleDeleteEvent = async () => {
        try {
            const res = await deleteEvent(id as string);
            if (res.success) {
                toast.success("Event deleted successfully");
                router.push("/dashboard");
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Failed to delete event");
        }
    };

    const handleCancelRegistration = async () => {
        if (!registrationId) return;
        
        try {
            const res = await cancelRegistration(registrationId);
            if (res.success) {
                toast.success(res.message);
                setIsRegistered(false);
                setRegistrationId(null);
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Failed to cancel registration");
        }
    };
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const fetchedEvent = await getEventById(id as string);
                let currentEventCategory = '';
                let currentEventId = '';

                if (fetchedEvent) {
                    setEvent(fetchedEvent);
                    currentEventCategory = fetchedEvent.category;
                    currentEventId = fetchedEvent.id;
                    trackInteraction('view', fetchedEvent.id, fetchedEvent.category);
                    
                    // Check registration and follow status if user is logged in
                    if (session?.user?.id) {
                        const [regStatus, followStatus] = await Promise.all([
                            checkUserRegistration(fetchedEvent.id),
                            getFollowStatus(fetchedEvent.organizerId)
                        ]);
                        setIsRegistered(regStatus.registered);
                        setRegistrationId(regStatus.registrationId || null);
                        setIsFollowing(followStatus.isFollowing);
                    }
                }

                // Fetch similar database events
                if (currentEventCategory) {
                    try {
                        const dbEvents = await getPublishedEvents({ category: currentEventCategory });
                        const filtered = dbEvents.filter((e: any) => e.id !== currentEventId);
                        
                        // If not enough database events in the same category, fetch any other database events as fallback
                        if (filtered.length < 4) {
                            const allDBEvents = await getPublishedEvents();
                            const otherFiltered = allDBEvents.filter((e: any) => 
                                e.id !== currentEventId && 
                                e.category.toLowerCase() !== currentEventCategory.toLowerCase()
                            );
                            const combined = [...filtered, ...otherFiltered];
                            // Remove any potential duplicates by ID
                            const unique = combined.filter((ev, index, self) => 
                                self.findIndex(t => t.id === ev.id) === index
                            );
                            setSimilarEvents(unique.slice(0, 4));
                        } else {
                            const unique = filtered.filter((ev, index, self) => 
                                self.findIndex(t => t.id === ev.id) === index
                            );
                            setSimilarEvents(unique.slice(0, 4));
                        }
                    } catch (err) {
                        console.error("Failed to fetch similar events:", err);
                        setSimilarEvents([]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch event:", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (id) fetchEvent();
    }, [id, session?.user?.id]);

    const handleRegister = async () => {
        if (!session) {
            toast.error("Please login to register for events");
            return;
        }

        setIsRegistering(true);
        try {
            const res = await registerForEvent(id as string, ticketQuantity);
            if (res.success) {
                toast.success(res.message);
                setIsRegistered(true);
                
                // Fetch the new registration ID
                const regStatus = await checkUserRegistration(id as string);
                if (regStatus.registered) {
                    setRegistrationId(regStatus.registrationId || null);
                }
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Registration failed");
        } finally {
            setIsRegistering(false);
        }
    };

    const handleAddToCalendar = () => {
        if (!event) return;
        
        const title = encodeURIComponent(event.title);
        const details = encodeURIComponent(event.description);
        const location = encodeURIComponent(event.location);
        
        // Format dates for Google Calendar (YYYYMMDDTHHmmSSZ)
        const date = new Date(event.date);
        
        // If event.time exists (e.g. "08:00"), adjust the date object
        if (event.time) {
            const [hours, minutes] = event.time.split(':').map(Number);
            date.setHours(hours, minutes);
        }

        const startDate = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endDate = new Date(date.getTime() + 120 * 60000).toISOString().replace(/-|:|\.\d\d\d/g, "");
        
        const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;
        window.open(googleUrl, '_blank');
    };

    const handleSubmitReview = async () => {
        if (!session) {
            toast.error("Please login to submit a review");
            return;
        }
        if (!reviewComment.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        setIsSubmittingReview(true);
        try {
            const res = await submitReview(id as string, reviewRating, reviewComment);
            if (res.success) {
                toast.success("Review submitted successfully!");
                setIsReviewModalOpen(false);
                setReviewComment("");
                // Refresh event data
                const updatedEvent = await getEventById(id as string);
                if (updatedEvent) setEvent(updatedEvent);
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleFollowToggle = async () => {
        if (!session) {
            toast.error("Please login to follow organizers");
            return;
        }
        if (!event) return;
        if (session.user.id === event.organizerId) {
            toast.error("You cannot follow yourself");
            return;
        }

        setIsFollowLoading(true);
        try {
            const res = await toggleFollow(event.organizerId);
            if (res.success) {
                setIsFollowing(res.isFollowing ?? false);
                toast.success(res.isFollowing ? `Now following ${event.organizer.name}` : `Unfollowed ${event.organizer.name}`);
            } else {
                toast.error(res.error || "Failed to update follow status");
            }
        } catch (error) {
            toast.error("Failed to update follow status");
        } finally {
            setIsFollowLoading(false);
        }
    };

    if (loading) return <EventsSkeleton />;
    if (!event) notFound();

    // similarEvents is now stateful, initialized to [] and populated on mount.

    const spotsLeft = event.capacity - event.registeredCount;
    const isEventPast = isPast(new Date(event.date));

    // Mock friend data
    const friendsAttending = [
        { id: 1, image: "https://i.pravatar.cc/150?u=1" },
        { id: 2, image: "https://i.pravatar.cc/150?u=2" },
        { id: 3, image: "https://i.pravatar.cc/150?u=3" },
    ];

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen pb-20">

            {/* Navigation / Breadcrumb Area */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            <ChevronRight className="w-3 h-3" />
                            <Link href="/events" className="hover:text-primary transition-colors">Events</Link>
                            <ChevronRight className="w-3 h-3" />
                            {isEventPast && (
                                <>
                                    <Link href="/events?filter=past" className="hover:text-primary transition-colors">Past Events</Link>
                                    <ChevronRight className="w-3 h-3" />
                                </>
                            )}
                            <span className="text-slate-900 dark:text-white font-medium truncate max-w-[150px] md:max-w-xs">{event.title}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Hero Section */}
                <div className={cn(
                    "relative w-full h-[400px] rounded-xl overflow-hidden mb-8 shadow-xl group",
                    isEventPast ? "h-[350px]" : "h-[400px]"
                )}>
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className={cn(
                            "object-cover transition-all duration-700",
                            isEventPast ? "grayscale-[40%] brightness-[70%] group-hover:grayscale-0" : "group-hover:scale-105"
                        )}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8 lg:p-12">
                        {/* Sold Out Badge */}
                        {!isEventPast && spotsLeft <= 0 && (
                            <div className="absolute top-4 right-4 animate-bounce duration-1000">
                                <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 uppercase tracking-wide">
                                    <AlertCircle className="w-4 h-4" /> SOLD OUT
                                </span>
                            </div>
                        )}

                        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {/* Event Type Badge */}
                                    <Badge className={cn(
                                        "px-3 py-1 font-bold rounded-full uppercase tracking-widest shadow-lg border-none",
                                        event.eventType === 'ONLINE' ? "bg-blue-500 text-white shadow-blue-500/40" :
                                        event.eventType === 'HYBRID' ? "bg-amber-500 text-white shadow-amber-500/40" :
                                        "bg-emerald-500 text-white shadow-emerald-500/40"
                                    )}>
                                        {event.eventType === 'ONLINE' ? <Laptop className="w-3.5 h-3.5 mr-1.5 inline" /> : 
                                         event.eventType === 'HYBRID' ? <Globe className="w-3.5 h-3.5 mr-1.5 inline" /> : 
                                         <MapPin className="w-3.5 h-3.5 mr-1.5 inline" />}
                                        {event.eventType || 'PHYSICAL'}
                                    </Badge>

                                    {event.badges && event.badges.length > 0 ? (
                                        <EventBadges badges={event.badges} />
                                    ) : (
                                        <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg shadow-primary/40">
                                            {event.category}
                                        </span>
                                    )}
                                    {isEventPast && (
                                        <span className="px-3 py-1 rounded-full bg-slate-100/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider">
                                            Completed
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-md leading-tight max-w-4xl">{event.title}</h1>

                                {!isEventPast && (
                                    <div className="mb-8">
                                        <CountdownTimer targetDate={new Date(event.date)} className="w-fit" />
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-6 text-white/90">
                                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                        <span className="text-sm font-medium">{format(new Date(event.date), 'EEEE, MMM do, yyyy')} • {event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                                        <MapPin className={cn("w-5 h-5", event.eventType === 'ONLINE' ? "text-blue-400" : "text-red-400")} />
                                        <span className="text-sm font-medium">
                                            {event.eventType === 'ONLINE' ? 'Virtual / Online Event' : event.location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Watch Trailer Button */}
                            {event.videoUrl && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button 
                                            size="lg" 
                                            className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white font-bold h-14 px-8 rounded-2xl group transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                                                <Play className="w-5 h-5 text-white fill-current" />
                                            </div>
                                            Watch Trailer
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[900px] p-0 bg-black border-slate-800 overflow-hidden">
                                        <DialogTitle className="sr-only">Event Trailer: {event.title}</DialogTitle>
                                        <DialogDescription className="sr-only">Watch the trailer for {event.title}</DialogDescription>
                                        <div className="aspect-video w-full">
                                            {event.videoType === 'youtube' ? (
                                                <iframe 
                                                    src={`https://www.youtube.com/embed/${event.videoUrl.split('v=')[1]?.split('&')[0] || event.videoUrl.split('/').pop()}?autoplay=1`}
                                                    className="w-full h-full"
                                                    allow="autoplay; encrypted-media"
                                                    allowFullScreen
                                                />
                                            ) : event.videoType === 'vimeo' ? (
                                                <iframe 
                                                    src={`https://player.vimeo.com/video/${event.videoUrl.split('/').pop()}?autoplay=1`}
                                                    className="w-full h-full"
                                                    allow="autoplay; fullscreen"
                                                    allowFullScreen
                                                />
                                            ) : (
                                                <video 
                                                    src={event.videoUrl} 
                                                    controls 
                                                    autoPlay 
                                                    className="w-full h-full"
                                                />
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Event Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Tabs Navigation */}
                        <Tabs defaultValue={isEventPast ? "reviews" : "about"} className="w-full">
                            <div className="border-b border-slate-200 dark:border-slate-800 mb-8">
                                <TabsList className="bg-transparent h-auto p-0 space-x-8">
                                    <TabsTrigger value="about" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-1 py-4 text-slate-500 font-medium hover:text-primary transition-colors">About</TabsTrigger>
                                    <TabsTrigger value="resources" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-1 py-4 text-slate-500 font-medium hover:text-primary transition-colors">Resources</TabsTrigger>
                                    <TabsTrigger value="gallery" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-1 py-4 text-slate-500 font-medium hover:text-primary transition-colors">Gallery</TabsTrigger>
                                    <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-1 py-4 text-slate-500 font-medium hover:text-primary transition-colors">Reviews</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="about" className="space-y-8 animate-in fade-in duration-300">
                                {/* Description */}
                                <section className="bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">About the Event</h2>
                                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                                        <p>{event.description}</p>
                                        <p>
                                            Join us for an immersive experience with industry leaders and fellow students.
                                            {isEventPast ? " This event was a huge success, featuring 3 keynotes and 5 workshops." : " Prepare for a day of learning, networking, and growth."}
                                        </p>
                                    </div>
                                </section>

                                {/* Organizer & Friends (Only show if NOT past event or if relevant) */}
                                {!isEventPast && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Organizer */}
                                        <section className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                                            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Organized by</h3>
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                                                        {(event.organizer.image || event.organizer.avatar) ? (
                                                            <Image src={event.organizer.image || event.organizer.avatar} alt={event.organizer.name} width={48} height={48} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Users className="w-6 h-6 text-primary" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{event.organizer.name}</p>
                                                        <p className="text-xs text-slate-500">Official Student Org</p>
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant={isFollowing ? "default" : "outline"} 
                                                    size="sm" 
                                                    className={cn(
                                                        "h-8 transition-all duration-200 font-semibold", 
                                                        isFollowing 
                                                            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 shadow-none border-none" 
                                                            : "text-primary border-primary/20 hover:bg-primary/5 hover:text-primary"
                                                    )}
                                                    onClick={handleFollowToggle}
                                                    disabled={isFollowLoading}
                                                >
                                                    {isFollowLoading ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                                                    ) : isFollowing ? (
                                                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                                    ) : null}
                                                    {isFollowing ? 'Following' : 'Follow'}
                                                </Button>
                                            </div>
                                        </section>
                                        {/* Location & Map Section */}
                                        {(event.eventType === 'PHYSICAL' || event.eventType === 'HYBRID') && (
                                            <section className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Location</h3>
                                                        <p className="text-sm text-slate-500 font-medium mt-1">
                                                            {event.locationAddress || event.location}
                                                        </p>
                                                    </div>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="h-9 gap-2"
                                                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`, '_blank')}
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Get Directions
                                                    </Button>
                                                </div>

                                                <div className="rounded-xl overflow-hidden h-[300px] border border-slate-100 dark:border-slate-800 relative group">
                                                    <MapPreview 
                                                        lat={event.latitude} 
                                                        lng={event.longitude} 
                                                        name={event.locationName || event.location} 
                                                    />
                                                </div>
                                            </section>
                                        )}

                                        {/* Attendees */}
                                        <section className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                                            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Attendees</h3>
                                            <div className="flex items-center mt-auto">
                                                <div className="flex -space-x-3 overflow-hidden">
                                                    {friendsAttending.map((friend) => (
                                                        <Avatar key={friend.id} className="w-10 h-10 border-2 border-white dark:border-slate-900 ring-2 ring-transparent">
                                                            <AvatarImage src={friend.image} />
                                                            <AvatarFallback>U{friend.id}</AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                        +{Math.max(12, event.registeredCount - 3)}
                                                    </div>
                                                </div>
                                                <p className="ml-4 text-sm text-slate-500 font-medium">
                                                    {Math.max(12, event.registeredCount)} friends are going
                                                </p>
                                            </div>
                                        </section>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="reviews" className="space-y-8 animate-in fade-in duration-300">
                                {/* Rating Summary */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-12">
                                    <div className="text-center">
                                        <div className="text-6xl font-black text-slate-900 dark:text-white">4.8</div>
                                        <div className="flex justify-center text-amber-400 my-2 gap-1">
                                            {[1, 2, 3, 4].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                            <Star className="w-5 h-5 fill-current opacity-50" />
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">Average of 142 ratings</div>
                                    </div>
                                    <div className="flex-1 w-full space-y-3">
                                        {[
                                            { stars: 5, count: 120, pct: '85%' },
                                            { stars: 4, count: 15, pct: '10%' },
                                            { stars: 3, count: 5, pct: '3%' },
                                            { stars: 2, count: 2, pct: '2%' },
                                            { stars: 1, count: 0, pct: '0%' },
                                        ].map((row) => (
                                            <div key={row.stars} className="flex items-center gap-4">
                                                <span className="text-xs font-semibold text-slate-500 w-12">{row.stars} stars</span>
                                                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: row.pct }}></div>
                                                </div>
                                                <span className="text-xs text-slate-500 w-8">{row.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full md:w-auto">
                                        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="w-full md:w-auto font-bold shadow-lg" size="lg">
                                                    <PenTool className="w-4 h-4 mr-2" />
                                                    Write a Review
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-bold">Share your experience</DialogTitle>
                                                    <DialogDescription>
                                                        How was the event? Your feedback helps the campus community.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-6 space-y-6">
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Rating</label>
                                                        <div className="flex gap-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    onClick={() => setReviewRating(star)}
                                                                    className={cn(
                                                                        "w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center",
                                                                        reviewRating >= star 
                                                                            ? "bg-amber-50 border-amber-400 text-amber-500 shadow-sm" 
                                                                            : "bg-slate-50 border-slate-200 text-slate-300 hover:border-slate-300"
                                                                    )}
                                                                >
                                                                    <Star className={cn("w-6 h-6", reviewRating >= star && "fill-current")} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Your Review</label>
                                                        <Textarea 
                                                            placeholder="What did you like? What could be improved?"
                                                            className="min-h-[120px] rounded-xl resize-none focus:ring-primary"
                                                            value={reviewComment}
                                                            onChange={(e) => setReviewComment(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button 
                                                        variant="ghost" 
                                                        onClick={() => setIsReviewModalOpen(false)}
                                                        className="font-bold"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button 
                                                        onClick={handleSubmitReview}
                                                        disabled={isSubmittingReview}
                                                        className="font-bold min-w-[120px]"
                                                    >
                                                        {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>

                                {/* Filter Bar */}
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">What people are saying</h3>
                                    <Button variant="outline" size="sm" className="h-9 gap-2">
                                        Sort: Most Relevant
                                    </Button>
                                </div>

                                {/* Real Reviews from DB */}
                                <div className="space-y-6">
                                    {event.reviews && event.reviews.length > 0 ? (
                                        event.reviews.map((review: any) => (
                                            <div key={review.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="w-12 h-12">
                                                            <AvatarImage src={review.user.image} />
                                                            <AvatarFallback>{review.user.name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-bold text-slate-900 dark:text-white">{review.user.name}</h4>
                                                                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded uppercase">
                                                                    <CheckCircle className="w-3 h-3" /> Verified Attendee
                                                                </span>
                                                            </div>
                                                            <div className="flex text-amber-400 scale-75 origin-left mt-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-current" : "opacity-30")} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-slate-400">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{review.comment}</p>
                                                <div className="mt-4 flex items-center gap-6">
                                                    <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                                                        <ThumbsUp className="w-4 h-4" /> Helpful
                                                    </button>
                                                    <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                                                        <MessageSquare className="w-4 h-4" /> Reply
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500">No reviews yet. Be the first to share your thoughts!</p>
                                        </div>
                                    )}

                                    {/* Keep some mock reviews if needed, or remove them */}
                                </div>
                            </TabsContent>

                            <TabsContent value="resources" className="min-h-[200px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                <p className="text-slate-500">Event resources and slides will appear here.</p>
                            </TabsContent>

                            <TabsContent value="gallery" className="min-h-[200px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                <p className="text-slate-500">Event photos and highlights will appear here.</p>
                            </TabsContent>
                        </Tabs>

                    </div>


                    {/* Right Column: Sticky Sidebar / Action Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {isEventPast ? (
                                // STATE: PAST EVENT (Event Ended)
                                <>
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-500">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold mb-6">
                                            <AlertCircle className="w-4 h-4" />
                                            Event Completed
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">This event has ended</h3>
                                        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-sm">
                                            The {event.title} concluded on {format(new Date(event.date), 'MMMM do, yyyy')}. Registration is now closed for this session.
                                        </p>
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center py-3 border-y border-slate-100 dark:border-slate-800">
                                                <span className="text-slate-500 dark:text-slate-400 text-sm">Total Participants</span>
                                                <span className="font-bold text-slate-900 dark:text-white">342</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                                                <span className="text-slate-500 dark:text-slate-400 text-sm">Projects Submitted</span>
                                                <span className="font-bold text-slate-900 dark:text-white">84</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                                                <span className="text-slate-500 dark:text-slate-400 text-sm">Prize Pool Claimed</span>
                                                <span className="font-bold text-slate-900 dark:text-white">$5,000</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Button className="w-full font-bold" size="lg">
                                                <Award className="w-4 h-4 mr-2" />
                                                View Winners
                                            </Button>
                                            <Button variant="outline" className="w-full font-bold border-primary text-primary hover:bg-primary/5">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Gallery Highlights
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Organizer Info (Consistent Style) */}
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Organized by</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Code className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{event.organizer.name}</div>
                                                <div className="text-sm text-slate-500">Official Student Org</div>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full mt-6">Follow Society</Button>
                                    </div>

                                    {/* Static Location Map */}
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                        <div className="h-32 bg-slate-200 dark:bg-slate-800 relative">
                                            {/* Placeholder Static Map */}
                                            <div className="absolute inset-0 bg-slate-300 dark:bg-slate-700 w-full h-full opacity-50 grayscale flex items-center justify-center">
                                                <MapPin className="text-slate-500 w-8 h-8" />
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-white p-2 rounded-full shadow-lg">
                                                    <MapPin className="text-primary w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-slate-900 dark:text-white">{event.location}</h4>
                                            <p className="text-sm text-slate-500 mt-1">University Campus</p>
                                        </div>
                                    </div>
                                    
                                    {/* Organizer Actions */}
                                    {session?.user?.id === event.organizerId && (
                                        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Organizer Toolkit</p>
                                            <div className="flex flex-col gap-2">
                                                <Link href={`/edit-event/${event.id}`}>
                                                    <Button variant="outline" className="w-full font-bold h-11 rounded-xl">
                                                        Edit Event Details
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => setIsDeleteModalOpen(true)}
                                                    className="w-full font-bold h-11 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                                >
                                                    Delete Event
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <ConfirmationModal 
                                        isOpen={isDeleteModalOpen}
                                        onClose={() => setIsDeleteModalOpen(false)}
                                        onConfirm={handleDeleteEvent}
                                        title="Delete Event?"
                                        message="Are you sure you want to delete this event? This action cannot be undone and all registrations will be lost."
                                        confirmText="Yes, Delete"
                                        variant="danger"
                                    />
                                </>
                            ) : isRegistered ? (
                                // STATE: REGISTERED (Success)
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
                                    <div className="flex items-center gap-2 mb-6 justify-center py-2 px-4 bg-green-50 dark:bg-green-500/10 rounded-lg text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20">
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="text-sm font-bold uppercase tracking-wider">You're going!</span>
                                    </div>
                                    <div className="text-center mb-6">
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-3">Your Entry Ticket</p>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 mx-auto w-48 h-48 flex items-center justify-center relative group cursor-pointer hover:border-primary/50 transition-colors">
                                            <Image
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${event.id}-${event.registeredCount + 1}`}
                                                alt="QR Code"
                                                width={150}
                                                height={150}
                                                className="opacity-90 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                        {event.eventType === 'ONLINE' ? (
                                            <p className="text-[10px] text-blue-500 font-bold mt-3 uppercase tracking-wider animate-pulse">Online Session • Join below</p>
                                        ) : (
                                            <p className="text-[10px] text-slate-400 mt-3 italic">Scan at the entrance gate</p>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {/* Join Online Button */}
                                        {(event.eventType === 'ONLINE' || event.eventType === 'HYBRID') && event.meetingLink && (
                                            <Button 
                                                className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl shadow-lg shadow-blue-500/20 group"
                                                size="lg"
                                                onClick={() => window.open(event.meetingLink, '_blank')}
                                            >
                                                <Video className="w-5 h-5 mr-2 animate-pulse" />
                                                Join Online Event
                                            </Button>
                                        )}
                                        <Link href="/dashboard" className="w-full block">
                                            <Button className="w-full font-bold shadow-lg shadow-primary/20" size="lg">
                                                <Settings className="w-4 h-4 mr-2" />
                                                Manage Dashboard
                                            </Button>
                                        </Link>
                                        <Link href={`/tickets/${registrationId}`} className="w-full block">
                                            <Button variant="outline" className="w-full font-bold border-primary/20 text-primary hover:bg-primary/5 hover:text-primary">
                                                <Ticket className="w-4 h-4 mr-2" />
                                                View Ticket
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="ghost" 
                                            className="w-full font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                            onClick={() => setIsCancelModalOpen(true)}
                                        >
                                            Cancel Registration
                                        </Button>
                                    </div>

                                    <ConfirmationModal 
                                        isOpen={isCancelModalOpen}
                                        onClose={() => setIsCancelModalOpen(false)}
                                        onConfirm={handleCancelRegistration}
                                        title="Cancel Registration?"
                                        message="Are you sure you want to cancel your registration for this event? This action cannot be undone."
                                        confirmText="Yes, Cancel"
                                        variant="danger"
                                    />
                                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Invite your friends</p>
                                        <div className="flex justify-center gap-4">
                                            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all flex items-center justify-center">
                                                <Facebook className="w-5 h-5" />
                                            </button>
                                            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all flex items-center justify-center">
                                                <Twitter className="w-5 h-5" />
                                            </button>
                                            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center">
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : spotsLeft <= 0 ? (
                                // STATE: SOLD OUT / WAITLIST
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-xl overflow-hidden animate-in fade-in duration-500">
                                    <div className="p-6 border-b border-primary/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Admission</p>
                                                <p className="text-2xl font-bold text-primary">
                                                    {pricingData?.currentPrice === 0 ? "Free" : `₹${pricingData?.currentPrice}`}
                                                </p>
                                            </div>
                                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-1 rounded-lg">
                                                <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">0 spots left</p>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="w-full h-full bg-red-500"></div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" /> {event.capacity} / {event.capacity} Students registered
                                        </p>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4">
                                            <div className="flex gap-3">
                                                <div className="mt-0.5"><div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-[10px] font-bold text-primary">i</span></div></div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">This event is currently full.</p>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                                                        Join the waitlist to secure your place in line. We'll automatically notify you if a spot opens up.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button className="w-full py-6 font-bold shadow-lg shadow-primary/20" size="lg">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Join Waitlist
                                        </Button>
                                        <p className="text-[11px] text-center text-slate-500 uppercase font-medium tracking-tight">
                                            Waitlist Position: #{Math.floor(Math.random() * 20) + 1}
                                        </p>
                                    </div>
                                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-center gap-6 border-t border-slate-100 dark:border-slate-800">
                                        <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
                                            <Share2 className="w-3.5 h-3.5" /> Share
                                        </button>
                                        <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
                                            <Bookmark className="w-3.5 h-3.5" /> Save
                                        </button>
                                        <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
                                            <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[8px]">!</div> Report
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // STATE: OPEN REGISTRATION (Future, Slots Available)
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 -mx-6 -mt-6 bg-slate-50/50 dark:bg-slate-800/20">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-slate-500 font-medium">Registration Fee</span>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {event.dynamicPricingEnabled && Number(event.price) < (pricingData?.currentPrice || 0) && (
                                                        <span className="text-sm text-slate-400 line-through font-medium mt-1">₹{Number(event.price)}</span>
                                                    )}
                                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                                        {pricingData?.currentPrice === 0 ? "Free" : `₹${pricingData?.currentPrice}`}
                                                    </span>
                                                </div>
                                                {event.dynamicPricingEnabled && pricingData?.label && (
                                                    <PriceUrgencyBadge label={pricingData.label} urgency={pricingData.urgency} className="mt-2" />
                                                )}
                                            </div>
                                        </div>
                                        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium w-fit ${spotsLeft < 10
                                            ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                            : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            }`}>
                                            <Users className="w-4 h-4" />
                                            <span>{spotsLeft} spots left</span>
                                        </div>
                                        
                                        {event.dynamicPricingEnabled && (
                                            <div className="mt-4 p-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl border border-amber-500/20">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                                                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest">Dynamic Pricing Active</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pricingData?.occupancyRate}%` }}
                                                        className="h-full bg-amber-500"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-bold mt-2 leading-tight">
                                                    {pricingData?.reason}. Prices increase as event fills.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="py-6 space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 mt-1">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{format(new Date(event.date), 'MMMM do, yyyy')}</p>
                                                <p className="text-sm text-slate-500">{event.time}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 mt-1">
                                                {event.eventType === 'ONLINE' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                                                    {event.eventType === 'ONLINE' ? 'Virtual Session' : event.location}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {event.eventType === 'PHYSICAL' ? 'University Campus' : 
                                                     event.eventType === 'HYBRID' ? 'Campus & Online' : 'Zoom / Meet / Teams'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-4 space-y-3">
                                            {event.eventSource === 'external' ? (
                                                <Button
                                                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white font-bold py-6 rounded-lg transition-all shadow-lg active:scale-[0.98] text-base"
                                                    onClick={() => window.open(event.externalLink, '_blank')}
                                                >
                                                    Get Tickets on Ticketmaster
                                                </Button>
                                            ) : (
                                                <>
                                                    {!isRegistered && (
                                                        <div className="mb-4 space-y-2">
                                                            <div className="flex items-center justify-between px-1">
                                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Quantity</span>
                                                                <span className="text-xs font-medium text-slate-500">Max 10</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                                                <button 
                                                                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 shadow-sm hover:text-primary transition-colors font-bold"
                                                                >
                                                                    -
                                                                </button>
                                                                <div className="flex-1 text-center font-bold">
                                                                    {ticketQuantity}
                                                                </div>
                                                                <button 
                                                                    onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 shadow-sm hover:text-primary transition-colors font-bold"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <Button
                                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-lg transition-all shadow-lg shadow-primary/25 active:scale-[0.98] text-base"
                                                        onClick={handleRegister}
                                                        disabled={isRegistered || isRegistering || spotsLeft <= 0}
                                                    >
                                                        {isRegistering ? (
                                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                        ) : isRegistered ? (
                                                            'Already Registered'
                                                        ) : (
                                                            `Register for ${ticketQuantity} Ticket${ticketQuantity > 1 ? 's' : ''}`
                                                        )}
                                                    </Button>
                                                </>
                                            )}

                                            <Button
                                                variant="outline"
                                                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold py-6 rounded-lg transition-all border-none"
                                                onClick={handleAddToCalendar}
                                            >
                                                <CalendarPlus className="w-4 h-4 mr-2" />
                                                Add to Calendar
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-2 pt-2">
                                        <p className="text-xs text-center text-slate-400">
                                            By registering, you agree to our Student Conduct Code and Event Policies.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Additional Info / Hosted By Sidebar (Only Future Events) */}
                            {!isEventPast && (
                                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <div className="w-6 h-6 text-primary flex items-center justify-center font-bold">
                                                <PenTool className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Hosted by</p>
                                            <p className="text-xs text-slate-500">{event.organizer.name}</p>
                                        </div>
                                    </div>
                                    <Link href={`/organizers/${event.organizer.id}`} className="block">
                                        <Button variant="outline" className="w-full text-xs h-9">
                                            View Organization Profile
                                        </Button>
                                    </Link>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Similar Events Carousel */}
                {similarEvents.length > 0 && (
                    <section className="mt-16">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Similar Events</h3>
                            <div className="flex space-x-2">
                                <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all">
                                    <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>
                                <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all">
                                    <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>
                        </div>

                        <div className="flex overflow-x-auto pb-6 space-x-6 scrollbar-hide snap-x">
                            {similarEvents.map((similarEvent) => (
                                <div key={similarEvent.id} className="min-w-[300px] w-[300px] snap-start">
                                    <EventCard event={similarEvent} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </main>

            {/* Footer Space */}
            <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© 2024 CampusPulse. All rights reserved.</p>
                </div>
            </footer>

            {/* Real-time Event Chat */}
            {event && (
                <EventChat 
                    eventId={event.id}
                    eventName={event.title}
                    currentUser={session?.user}
                    isRegistered={isRegistered}
                    isHost={session?.user?.id === event.organizerId || event.collaborators?.some((c: any) => c.userId === session?.user?.id)}
                />
            )}
        </div>
    );
}

function MapPreview({ lat, lng, name }: { lat?: number | null, lng?: number | null, name: string }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey || '',
        libraries: ["places"] as any,
    });

    if (!apiKey || loadError) return (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-6 text-center">
            <MapPin className="w-8 h-8 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500 font-medium mb-4">Map preview is unavailable</p>
            <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 h-9"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank')}
            >
                <ExternalLink className="w-4 h-4" />
                View on Google Maps
            </Button>
        </div>
    );

    if (!lat || !lng) return (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 italic text-sm">
            Location coordinates not available
        </div>
    );

    if (!isLoaded) return (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
    );

    return (
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{ lat, lng }}
            zoom={15}
            options={{
                disableDefaultUI: true,
                zoomControl: true,
            }}
        >
            <Marker position={{ lat, lng }} title={name} />
        </GoogleMap>
    );
}
