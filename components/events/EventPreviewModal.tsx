import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
    Calendar, Clock, MapPin, Users, Globe, IndianRupee, 
    ChevronLeft, Send, Shield, ExternalLink, FileText, 
    AlertCircle, Sparkles, Map as MapIcon, ArrowLeft,
    Image as ImageIcon, Info
} from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EventPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPublish: () => void;
    data: any;
    collaborators: any[];
}

export function EventPreviewModal({ isOpen, onClose, onPublish, data, collaborators }: EventPreviewModalProps) {
    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1100px] w-[95vw] h-[90vh] p-0 rounded-[2.5rem] border-none shadow-2xl bg-slate-50 dark:bg-slate-950 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-300 flex flex-col">
                <DialogHeader className="sr-only">
                    <DialogTitle>Event Preview</DialogTitle>
                </DialogHeader>

                {/* Sticky Premium Header */}
                <div className="shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 px-8 py-5 flex items-center justify-between shadow-sm z-50">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-2xl">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-xl leading-tight">Live Preview</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-tight flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Updating in real-time
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            onClick={onClose} 
                            className="rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 px-4 h-11"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back to Edit</span>
                        </Button>
                        <Button 
                            onClick={onPublish} 
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl font-black px-8 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all gap-2 h-11"
                        >
                            <Send className="w-4 h-4" />
                            <span>Publish Event</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1 min-h-0 w-full overflow-hidden">
                    <ScrollArea className="h-full w-full">
                        <div className="p-6 md:p-10">
                            <div className="max-w-7xl mx-auto">
                                
                                {/* 2-Column Grid Layout (70/30) */}
                                <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
                                    
                                    {/* LEFT SIDE: MAIN CONTENT (70%) */}
                                    <div className="lg:col-span-7 space-y-10">
                                        
                                        {/* Cover Image Section */}
                                        <div className="relative aspect-[21/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-slate-200/50 dark:ring-slate-800/50 bg-slate-100 dark:bg-slate-900 group">
                                            {data.previewUrl ? (
                                                <Image 
                                                    src={data.previewUrl} 
                                                    alt={data.title} 
                                                    fill 
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                                    <div className="p-6 bg-white/50 dark:bg-black/20 rounded-full backdrop-blur-md">
                                                        <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-sm">Banner Placeholder</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                                        </div>

                                        {/* Title & Metadata */}
                                        <div className="space-y-6">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Badge className="bg-primary hover:bg-primary text-white border-none px-6 py-2 rounded-full font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20">
                                                    {data.category || 'Uncategorized'}
                                                </Badge>
                                                <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none px-6 py-2 rounded-full font-black text-[11px] uppercase tracking-widest">
                                                    {data.eventType || 'Physical'}
                                                </Badge>
                                            </div>
                                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                                                {data.title || 'Your Event Title'}
                                            </h1>
                                        </div>

                                        {/* Description Section */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2.5 h-8 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary),0.6)]" />
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">About the Event</h3>
                                            </div>
                                            
                                            {data.description ? (
                                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                                    <p className="text-slate-600 dark:text-slate-400 leading-[1.8] text-xl font-medium whitespace-pre-wrap">
                                                        {data.description}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="bg-slate-100/50 dark:bg-slate-900/50 rounded-[2.5rem] p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-5">
                                                    <div className="p-5 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl">
                                                        <FileText className="w-10 h-10 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">Your story starts here</p>
                                                        <p className="text-sm text-slate-400 font-medium">Description will update as you type</p>
                                                    </div>
                                                </div>
                                            )}
                                        </section>

                                        {/* Venue & Map Section */}
                                        <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/30 dark:shadow-none space-y-10">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                                                    <MapIcon className="w-8 h-8 text-primary" />
                                                    Venue & Location
                                                </h3>
                                            </div>

                                            {data.eventType === 'ONLINE' ? (
                                                <div className="flex items-center gap-8 p-8 bg-primary/5 rounded-[2rem] border border-primary/10">
                                                    <div className="p-6 bg-primary rounded-3xl shadow-xl shadow-primary/20">
                                                        <Globe className="w-10 h-10 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-primary text-2xl uppercase tracking-tight">Global Access</p>
                                                        <p className="text-lg text-slate-500 dark:text-slate-400 font-bold">Attendees will receive the link via email</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-8">
                                                    <div className="flex items-start gap-6">
                                                        <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-3xl shrink-0">
                                                            <MapPin className="w-8 h-8 text-primary" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                                                {data.locationName || data.location || 'Venue Pending'}
                                                            </p>
                                                            <p className="text-lg text-slate-500 font-bold tracking-tight">
                                                                {data.locationAddress || 'Address details will be generated here'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Map Placeholder UI */}
                                                    <div className="h-[350px] w-full bg-slate-100 dark:bg-slate-800/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-6 overflow-hidden relative group/map cursor-default">
                                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-200/30 to-transparent dark:from-slate-800/30" />
                                                        <div className="p-6 bg-white dark:bg-slate-800 rounded-full shadow-2xl relative z-10 transition-transform group-hover/map:scale-110">
                                                            <MapPin className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                                        </div>
                                                        <div className="text-center relative z-10">
                                                            <p className="text-lg font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Live Map Preview</p>
                                                            <p className="text-sm text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest mt-2 px-10">Map rendering is optimized for the published view</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </section>
                                    </div>

                                    {/* RIGHT SIDE: SIDEBAR (30%) */}
                                    <div className="lg:col-span-3 space-y-8">
                                        
                                        {/* Sticky Sidebar Container */}
                                        <div className="sticky top-6 space-y-8">
                                            
                                            {/* Quick Details Card */}
                                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/20 dark:shadow-none space-y-10">
                                                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] border-b border-slate-100 dark:border-slate-800 pb-4">Event Intelligence</h3>
                                                
                                                <div className="space-y-10">
                                                    {/* Date Item */}
                                                    <div className="flex items-center gap-6 group">
                                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
                                                            <Calendar className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                                                            <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                                                {data.date ? format(new Date(data.date), 'MMM dd, yyyy') : 'TBA'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Time Item */}
                                                    <div className="flex items-center gap-6 group">
                                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
                                                            <Clock className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Time</p>
                                                            <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">{data.time || 'TBA'}</p>
                                                        </div>
                                                    </div>

                                                    {/* Price Item */}
                                                    <div className="flex items-center gap-6 group">
                                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
                                                            <IndianRupee className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Entry</p>
                                                            <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                                                {data.price && parseFloat(data.price) > 0 ? `₹${data.price}` : 'FREE'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Capacity Item */}
                                                    <div className="flex items-center gap-6 group">
                                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
                                                            <Users className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Spots</p>
                                                            <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                                                {data.capacity || 'Open'} Seats
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                                                        <Shield className="w-6 h-6 text-emerald-500" />
                                                    </div>
                                                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-tight uppercase tracking-widest">Organizer <br/>Verified</p>
                                                </div>
                                            </div>

                                            {/* Team Card */}
                                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/20 dark:shadow-none space-y-8">
                                                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">The Crew</h3>
                                                
                                                <div className="space-y-5">
                                                    {collaborators.length === 0 ? (
                                                        <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                                                <Users className="w-6 h-6 text-slate-400" />
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Collaborators will appear here</p>
                                                        </div>
                                                    ) : (
                                                        collaborators.map((collab, idx) => (
                                                            <div key={idx} className="flex items-center gap-5 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[1.5rem] transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-primary/20 shrink-0">
                                                                    {(collab.user?.email?.[0] || 'U').toUpperCase()}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{collab.user?.email || 'Unknown User'}</p>
                                                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{collab.role?.replace('_', ' ') || 'Member'}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            {/* Tips Section */}
                                            <div className="p-6 bg-slate-100 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-3">
                                                <div className="flex items-center gap-2 text-primary">
                                                    <Info className="w-4 h-4" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">Pro Tip</p>
                                                </div>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                                    High-quality images and clear descriptions increase event engagement by up to 40%.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
