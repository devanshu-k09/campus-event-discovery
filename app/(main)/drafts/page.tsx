'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDrafts, publishDraft, deleteEvent } from '@/app/actions/event';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Send, Clock, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DraftsPage() {
    const router = useRouter();
    const [drafts, setDrafts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadDrafts();
    }, []);

    const loadDrafts = async () => {
        try {
            const data = await getDrafts();
            setDrafts(data);
        } catch (error) {
            toast.error("Failed to load drafts");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async (id: string) => {
        setActionLoading(id + '-publish');
        const res = await publishDraft(id);
        if (res.success) {
            toast.success("Event published successfully!");
            setDrafts(drafts.filter(d => d.id !== id));
        } else {
            toast.error(res.error || "Failed to publish");
        }
        setActionLoading(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this draft?")) return;
        
        setActionLoading(id + '-delete');
        const res = await deleteEvent(id);
        if (res.success) {
            toast.success("Draft deleted");
            setDrafts(drafts.filter(d => d.id !== id));
        } else {
            toast.error(res.error || "Failed to delete");
        }
        setActionLoading(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 font-display transition-colors p-6 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
                
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Drafts</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage events you haven't published yet.</p>
                    </div>
                    <Link href="/create-event">
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-md">
                            Create New Event
                        </Button>
                    </Link>
                </div>

                {drafts.length === 0 ? (
                    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm">
                        <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No drafts found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                            You don't have any unpublished events. Ready to host something amazing?
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {drafts.map((draft) => (
                            <div key={draft.id} className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm gap-6">
                                
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                            Draft
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                                        {draft.title || "Untitled Event"}
                                    </h3>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {draft.date ? new Date(draft.date).toLocaleDateString() : 'Date TBD'}
                                            {draft.time ? ` at ${draft.time}` : ''}
                                        </div>
                                        {draft.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                <span className="line-clamp-1">{draft.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t border-slate-100 dark:border-slate-800 md:border-t-0">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => router.push(`/create-event?id=${draft.id}`)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                    >
                                        <Edit className="w-4 h-4" /> Edit
                                    </Button>
                                    
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handlePublish(draft.id)}
                                        disabled={actionLoading === draft.id + '-publish'}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30 dark:hover:bg-emerald-900/40"
                                    >
                                        {actionLoading === draft.id + '-publish' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} 
                                        Publish
                                    </Button>

                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleDelete(draft.id)}
                                        disabled={actionLoading === draft.id + '-delete'}
                                        className="px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                                    >
                                        {actionLoading === draft.id + '-delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
