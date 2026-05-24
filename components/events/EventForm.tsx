'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Calendar, MapPin, Users, ArrowLeft, Image as ImageIcon,
    CloudUpload, FileText, Settings, IndianRupee, Loader2, X,
    Globe, Laptop, Video, Info
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { saveEvent, getEventById } from '@/app/actions/event';
import { logEventActivity } from '@/app/actions/activity';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { MediaUploadSection } from './MediaUploadSection';
import { CollaboratorSection } from './CollaboratorSection';
import { LocationPicker } from './LocationPicker';
import { EventPreviewModal } from './EventPreviewModal';
import { Eye, TrendingUp } from 'lucide-react';
import { SmartPricingSection } from './SmartPricingSection';
import { calculateCurrentPrice } from '@/lib/pricing';

const eventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string().min(1, 'Category is required'),
    capacity: z.string().min(1, 'Capacity is required'),
    price: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    location: z.string().optional().default(''),
    locationName: z.string().optional().default(''),
    locationAddress: z.string().optional().default(''),
    latitude: z.number().optional().nullable().default(null),
    longitude: z.number().optional().nullable().default(null),
    eventType: z.enum(['PHYSICAL', 'ONLINE', 'HYBRID']).default('PHYSICAL'),
    meetingLink: z.string().optional().default(''),
    isPrivate: z.boolean().default(false),
    requiresApproval: z.boolean().default(false),
    showAttendeeList: z.boolean().default(true),
    dynamicPricingEnabled: z.boolean().default(false),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
}).refine((data) => {
    if (data.eventType === 'PHYSICAL' || data.eventType === 'HYBRID') {
        return !!data.location && data.location.length >= 3;
    }
    return true;
}, {
    message: 'Location is required for physical/hybrid events',
    path: ['location'],
}).refine((data) => {
    if (data.eventType === 'ONLINE') {
        return !!data.meetingLink && /^https?:\/\//.test(data.meetingLink);
    }
    return true;
}, {
    message: 'Valid meeting link is required for online events',
    path: ['meetingLink'],
});

type EventFormData = z.infer<typeof eventSchema>;

const CATEGORIES = [
    { value: 'tech', label: 'Technology' },
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'career', label: 'Career' },
    { value: 'health', label: 'Health' },
    { value: 'social', label: 'Social' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'competition', label: 'Competition' },
    { value: 'other', label: 'Other' },
];

interface EventFormProps {
    eventId?: string;
}

export default function EventForm({ eventId }: EventFormProps) {
    const router = useRouter();
    const { data: session } = useSession();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [isFetching, setIsFetching] = useState(!!eventId);
    
    // Media State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [videoMedia, setVideoMedia] = useState<{
        type: 'upload' | 'youtube' | 'vimeo' | null;
        file: File | null;
        link: string | null;
    }>({ type: null, file: null, link: null });
    const [organizerId, setOrganizerId] = useState<string | null>(null);
    const [existingEvent, setExistingEvent] = useState<any>(null);
    const [localCollaborators, setLocalCollaborators] = useState<any[]>([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Smart Pricing State
    const [priceThresholds, setPriceThresholds] = useState<any[]>([]);
    const [timeBasedIncrease, setTimeBasedIncrease] = useState<any>({ lastHours: 24, increase: 20 });

    const form = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: '',
            description: '',
            category: '',
            capacity: '',
            price: '',
            date: '',
            time: '',
            location: '',
            eventType: 'PHYSICAL',
            status: 'draft',
            dynamicPricingEnabled: false,
            isPrivate: false,
            requiresApproval: false,
            showAttendeeList: true,
            minPrice: '',
            maxPrice: ''
        }
    });

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        control,
        reset,
        watch,
        formState: { errors },
    } = form;

    const watchedValues = useWatch({ control });


    useEffect(() => {
        if (eventId) {
            const fetchEvent = async () => {
                setIsFetching(true);
                try {
                    const event = await getEventById(eventId);
                    if (event) {
                        const formattedDate = new Date(event.date).toISOString().split('T')[0];
                        
                        reset({
                            title: event.title,
                            description: event.description,
                            category: event.category.toLowerCase(),
                            capacity: event.capacity.toString(),
                            price: event.price.toString(),
                            date: formattedDate,
                            time: event.time,
                            location: event.location || '',
                            locationName: event.locationName || '',
                            locationAddress: event.locationAddress || '',
                            latitude: event.latitude || null,
                            longitude: event.longitude || null,
                            eventType: (event.eventType as any) || 'PHYSICAL',
                            meetingLink: event.meetingLink || '',
                            isPrivate: event.isPrivate,
                            requiresApproval: event.requiresApproval,
                            showAttendeeList: event.showAttendeeList,
                            dynamicPricingEnabled: event.dynamicPricingEnabled,
                            minPrice: event.minPrice?.toString() || '',
                            maxPrice: event.maxPrice?.toString() || '',
                        });
                        if (event.priceThresholds) setPriceThresholds(event.priceThresholds as any[]);
                        if (event.timeBasedIncrease) setTimeBasedIncrease(event.timeBasedIncrease);
                        setExistingEvent(event);
                        setOrganizerId(event.organizerId);
                        if (event.image) setPreviewUrl(event.image);
                        if (event.videoUrl) {
                            setVideoMedia({
                                type: (event.videoType as any) || (event.videoUrl.includes('youtube') ? 'youtube' : 'upload'),
                                file: null,
                                link: event.videoUrl
                            });
                        }
                        if (event.collaborators) {
                            setLocalCollaborators(event.collaborators);
                        }
                    } else {
                        toast.error("Event not found");
                    }
                } catch (error) {
                    console.error("Error fetching event:", error);
                    toast.error("Failed to load event data");
                } finally {
                    setIsFetching(false);
                }
            };
            fetchEvent();
        }
    }, [eventId, reset]);

    useEffect(() => {
        const errorCount = Object.keys(errors).length;
        if (errorCount > 0) {
            console.log('Form errors:', errors);
            const firstError = Object.values(errors)[0]?.message as string;
            toast.error(firstError || "Please check the form for errors");
        }
    }, [errors]);

    const handleApiSubmit = async (data: EventFormData, status: 'draft' | 'published') => {
        if (!session) {
            toast.error('You must be logged in to save events');
            return;
        }

        // Final Validation for publishing
        if (status === 'published') {
            const requiredFields = ['title', 'description', 'category', 'capacity', 'date', 'time'];
            for (const field of requiredFields) {
                if (!(data as any)[field]) {
                    toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required for publishing`);
                    return;
                }
            }

            if (!imageFile && !previewUrl) {
                toast.error('Cover image is required for publishing');
                return;
            }

            if (data.eventType === 'ONLINE' && !data.meetingLink) {
                toast.error('Meeting link is required for online events');
                return;
            }
            if (data.eventType !== 'ONLINE' && !data.locationName && !data.location) {
                toast.error('Location is required for physical events');
                return;
            }
        }

        if (status === 'published') setIsSubmitting(true);
        else setIsSavingDraft(true);

        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            if (imageFile) formData.append('image', imageFile);
            if (videoMedia.file) formData.append('videoFile', videoMedia.file);
            if (videoMedia.type) formData.append('videoType', videoMedia.type);
            if (videoMedia.link) formData.append('videoLink', videoMedia.link);
            if (eventId) formData.append('eventId', eventId);
            
            formData.append('status', status);
            
            // Add local collaborators
            if (!eventId && localCollaborators.length > 0) {
                formData.append('collaborators', JSON.stringify(localCollaborators.map(c => ({
                    email: c.user.email,
                    role: c.role
                }))));
            }

            // Add Smart Pricing data
            formData.append('priceThresholds', JSON.stringify(priceThresholds));
            formData.append('timeBasedIncrease', JSON.stringify(timeBasedIncrease));

            const result = await saveEvent(formData);

            if (result.success) {
                // Log Activity
                if (result.eventId) {
                    await logEventActivity(
                        result.eventId, 
                        eventId ? 'edited event' : 'created event',
                        status === 'published' ? 'Published the event' : 'Saved as draft'
                    );
                }

                toast.success(status === 'published' ? 'Event published successfully!' : 'Draft saved!');
                router.push(status === 'published' ? `/events/${result.eventId}` : '/drafts');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to save event');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
            setIsSavingDraft(false);
            setIsPreviewOpen(false);
        }
    };

    const onSubmit = (data: EventFormData) => handleApiSubmit(data, 'published');
    const handleSaveDraft = () => {
        const values = getValues();
        if (!values.title) {
            toast.error("At least a title is required to save a draft.");
            return;
        }
        handleApiSubmit(values, 'draft');
    };

    const eventType = useWatch({
        control,
        name: 'eventType',
        defaultValue: 'PHYSICAL',
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 pb-20">
            {/* Navbar */}
            <nav className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 mb-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-sm">Dashboard</span>
                    </Link>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                        {eventId ? 'Edit Event' : 'Create Event'}
                    </h1>
                    <div className="w-20"></div>
                </div>
            </nav>

            {isFetching && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <div className="bg-card p-8 rounded-3xl shadow-2xl border flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="font-bold text-lg">Loading event details...</p>
                    </div>
                </div>
            )}

            <main className="max-w-6xl mx-auto px-4 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Media Section */}
                    <section className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
                        <MediaUploadSection 
                            onImageChange={setImageFile}
                            onVideoChange={setVideoMedia}
                            initialImage={previewUrl || undefined}
                            initialVideo={videoMedia.link || undefined}
                            initialVideoType={videoMedia.type || undefined}
                        />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Left Column */}
                        <div className="space-y-8">
                            <section className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-8">
                                    <FileText className="text-primary w-6 h-6" />
                                    <h2 className="text-lg font-bold">Details</h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            Event Title <span className="text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            {...register('title')}
                                            className="w-full h-12 bg-transparent border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl font-medium"
                                            placeholder="What's the name of your event?"
                                        />
                                        {errors.title && <p className="text-xs text-rose-500 font-medium">{errors.title.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            Full Description <span className="text-rose-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            {...register('description')}
                                            className="w-full bg-transparent border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl min-h-[180px] font-medium py-4"
                                            placeholder="Tell them why they can't miss it..."
                                        />
                                        {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            Category <span className="text-rose-500">*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            name="category"
                                            render={({ field }) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full h-12 bg-transparent border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl font-medium">
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {CATEGORIES.map(cat => (
                                                            <SelectItem key={cat.value} value={cat.value} className="rounded-lg">{cat.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.category && <p className="text-xs text-rose-500 font-medium">{errors.category.message}</p>}
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-8">
                                    <Users className="text-primary w-6 h-6" />
                                    <h2 className="text-lg font-bold">Capacity & Pricing</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            Max Capacity <span className="text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            {...register('capacity')}
                                            className="w-full h-12 bg-transparent border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl font-medium"
                                            placeholder="e.g., 100"
                                        />
                                        {errors.capacity && <p className="text-xs text-rose-500 font-medium">{errors.capacity.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            Price (₹)
                                        </Label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <Input
                                                id="price"
                                                type="number"
                                                {...register('price')}
                                                className="w-full h-12 pl-10 bg-transparent border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl font-medium"
                                                placeholder="Free if empty"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <CollaboratorSection 
                                    eventId={eventId || ''} 
                                    isOwner={!eventId || (!!session?.user?.id && session.user.id === organizerId)} 
                                    localCollaborators={localCollaborators}
                                    onLocalUpdate={setLocalCollaborators}
                                />
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            <section className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-8">
                                    <Globe className="text-primary w-6 h-6" />
                                    <h2 className="text-lg font-bold">Event Type & Access</h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            How will attendees join? <span className="text-rose-500">*</span>
                                        </Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'PHYSICAL', label: 'Physical', icon: MapPin, desc: 'On-campus venue' },
                                                { id: 'ONLINE', label: 'Online', icon: Laptop, desc: 'Virtual meeting' },
                                                { id: 'HYBRID', label: 'Hybrid', icon: Globe, desc: 'Both options' }
                                            ].map((type) => (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setValue('eventType', type.id as any, { shouldValidate: true })}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2",
                                                        eventType === type.id 
                                                            ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10" 
                                                            : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                                                    )}
                                                >
                                                    <type.icon className={cn("w-6 h-6", eventType === type.id ? "animate-pulse" : "")} />
                                                    <span className="text-[10px] font-black uppercase tracking-wider">{type.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="date" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                Event Date <span className="text-rose-500">*</span>
                                            </Label>
                                            <Input
                                                id="date"
                                                type="date"
                                                {...register('date')}
                                                className="w-full h-12 bg-transparent border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl font-medium"
                                            />
                                            {errors.date && <p className="text-xs text-rose-500 font-medium">{errors.date.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="time" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                Start Time <span className="text-rose-500">*</span>
                                            </Label>
                                            <Input
                                                id="time"
                                                type="time"
                                                {...register('time')}
                                                className="w-full h-12 bg-transparent border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl font-medium"
                                            />
                                            {errors.time && <p className="text-xs text-rose-500 font-medium">{errors.time.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Physical Location Field */}
                                        {(eventType === 'PHYSICAL' || eventType === 'HYBRID') && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Label htmlFor="location" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    Venue Location <span className="text-rose-500">*</span>
                                                </Label>
                                                <LocationPicker 
                                                    onLocationSelect={(data) => {
                                                        setValue('locationName', data.name);
                                                        setValue('locationAddress', data.address);
                                                        setValue('location', data.name); // Legacy support
                                                        setValue('latitude', data.lat);
                                                        setValue('longitude', data.lng);
                                                    }}
                                                    defaultLocation={existingEvent?.locationName || existingEvent?.location || ''}
                                                    defaultLat={existingEvent?.latitude || undefined}
                                                    defaultLng={existingEvent?.longitude || undefined}
                                                    error={errors.locationName?.message || errors.location?.message}
                                                />
                                            </div>
                                        )}

                                        {/* Meeting Link Field */}
                                        {(eventType === 'ONLINE' || eventType === 'HYBRID') && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Label htmlFor="meetingLink" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    Meeting Link {eventType === 'ONLINE' && <span className="text-rose-500">*</span>}
                                                </Label>
                                                <div className="relative">
                                                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                                                    <Input
                                                        id="meetingLink"
                                                        {...register('meetingLink')}
                                                        className="w-full h-12 pl-12 bg-transparent border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl font-medium"
                                                        placeholder="Paste Zoom / Google Meet link"
                                                    />
                                                </div>
                                                {errors.meetingLink && <p className="text-xs text-rose-500 font-medium">{errors.meetingLink.message}</p>}
                                                <div className="flex items-center gap-2 px-2 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <Info className="w-3.5 h-3.5 text-slate-400" />
                                                    <p className="text-[10px] text-slate-400 font-medium italic">Supports Zoom, G-Meet, MS Teams links</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-8">
                                    <Settings className="text-primary w-6 h-6" />
                                    <h2 className="text-lg font-bold">Preferences</h2>
                                </div>
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between group">
                                        <div className="pr-4">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Private Event</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">Only accessible via direct link</p>
                                        </div>
                                        <Controller
                                            control={control}
                                            name="isPrivate"
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary" />
                                            )}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between group">
                                        <div className="pr-4">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Requires Approval</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">Manually review every attendee</p>
                                        </div>
                                        <Controller
                                            control={control}
                                            name="requiresApproval"
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary" />
                                            )}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between group">
                                        <div className="pr-4">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Public Attendee List</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">Let others see who is joining</p>
                                        </div>
                                        <Controller
                                            control={control}
                                            name="showAttendeeList"
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary" />
                                            )}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 sticky bottom-6 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-full sm:w-auto">
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => setIsPreviewOpen(true)}
                                className="px-6 rounded-xl font-bold h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all w-full sm:w-auto gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                Review Event
                            </Button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => onSubmit(getValues(), 'draft')}
                                disabled={isSavingDraft || isSubmitting}
                                className="px-6 rounded-xl font-bold h-12 text-slate-600 dark:text-slate-400 hover:text-primary transition-all w-full sm:w-[160px]"
                            >
                                {isSavingDraft ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save as Draft'}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || isSavingDraft}
                                className="px-8 rounded-xl bg-primary text-white font-bold hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 transition-all h-12 w-full sm:w-[200px]"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : eventId ? 'Update & Publish' : 'Publish Event'}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Event Preview Modal */}
                <EventPreviewModal 
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                    onPublish={() => onSubmit(getValues(), 'published')}
                    data={{
                        ...watchedValues,
                        previewUrl
                    }}
                    collaborators={localCollaborators}
                />
            </main>
        </div>
    );
}
