"use client";

import { 
  MoreVertical, 
  Star, 
  TrendingUp, 
  Trash2, 
  Eye 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EventActionsProps {
  eventId: string;
  eventTitle: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

export function EventActions({ eventId, eventTitle, isFeatured, isTrending }: EventActionsProps) {
  const router = useRouter();

  const handleAction = (action: string) => {
    switch (action) {
      case 'preview':
        toast.info(`Opening preview for ${eventTitle}...`);
        router.push(`/events/${eventId}`);
        break;
      case 'feature':
        toast.success(`${isFeatured ? 'Removed from' : 'Added to'} Featured`, {
          description: `${eventTitle} has been updated.`
        });
        break;
      case 'trending':
        toast.success(`${isTrending ? 'Removed from' : 'Added to'} Trending`, {
          description: `${eventTitle} status updated.`
        });
        break;
      case 'delete':
        toast.error('Event Deleted', {
          description: `${eventTitle} has been removed from the platform.`
        });
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group">
          <MoreVertical className="w-5 h-5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 mt-2 rounded-2xl border-slate-200 dark:border-slate-800 p-2 shadow-xl">
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">Moderation Actions</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleAction('preview')}
          className="rounded-xl gap-2 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400"
        >
          <Eye className="w-4 h-4" />
          <span className="font-bold">Preview on site</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleAction('feature')}
          className="rounded-xl gap-2 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400"
        >
          <Star className="w-4 h-4" />
          <span className="font-bold">{isFeatured ? 'Remove from Featured' : 'Mark as Featured'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleAction('trending')}
          className="rounded-xl gap-2 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400"
        >
          <TrendingUp className="w-4 h-4" />
          <span className="font-bold">{isTrending ? 'Remove from Trending' : 'Mark as Trending'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />
        <DropdownMenuItem 
          onClick={() => handleAction('delete')}
          className="rounded-xl gap-2 cursor-pointer text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-900/20"
        >
          <Trash2 className="w-4 h-4" />
          <span className="font-bold">Delete Event</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
