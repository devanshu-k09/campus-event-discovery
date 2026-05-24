import { prisma } from "@/lib/db";
import { EventActions } from "@/components/admin/EventActions";
import { 
  Calendar, 
  Search, 
  MapPin, 
  Users, 
  MoreVertical, 
  Star, 
  TrendingUp, 
  Trash2, 
  Filter,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      organizer: { select: { name: true, image: true } },
      _count: { select: { registrations: true } }
    }
  });

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Global Events</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Audit platform events, moderate content, and curate featured highlights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              suppressHydrationWarning
              placeholder="Filter by title, host or category..."
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all w-full md:w-80 shadow-sm"
            />
          </div>
          <button 
            suppressHydrationWarning
            className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
          >
            <Filter size={20} />
          </button>
          <button 
            suppressHydrationWarning
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 rounded-2xl text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} />
            Add Event
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Event Detail</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Host Identity</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status & Promotion</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Registrations</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-b border-slate-50 dark:border-slate-800/50 last:border-none transition-colors">
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-900 group-hover:border-indigo-100 transition-all">
                      {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Calendar className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-black text-slate-900 dark:text-white leading-tight truncate">{event.title}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        <span className="truncate">{event.location}</span>
                        <span className="mx-1">•</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{event.category}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-slate-100 dark:border-slate-800">
                      <AvatarImage src={event.organizer.image || ""} />
                      <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-[10px] font-black">{event.organizer.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{event.organizer.name}</span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={cn(
                      "font-black text-[10px] tracking-widest border-none px-3 py-1 rounded-full",
                      event.status === 'published' ? "bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400" :
                      event.status === 'draft' ? "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400" :
                      "bg-amber-50 dark:bg-amber-600/10 text-amber-600 dark:text-amber-400"
                    )}>
                      {event.status === 'published' ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
                      {event.status}
                    </Badge>
                    
                    {event.isFeatured && (
                      <Badge className="bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-none font-black text-[10px] tracking-widest px-3 py-1 rounded-full">
                        <Star className="w-3 h-3 mr-1.5 fill-current" />
                        Featured
                      </Badge>
                    )}
                    
                    {event.popularityScore > 50 && (
                      <Badge className="bg-rose-50 dark:bg-rose-600/10 text-rose-600 dark:text-rose-400 border-none font-black text-[10px] tracking-widest px-3 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3 mr-1.5" />
                        Trending
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-3 overflow-hidden">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800" />
                      ))}
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {event._count.registrations}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 text-right">
                  <EventActions 
                    eventId={event.id} 
                    eventTitle={event.title} 
                    isFeatured={event.isFeatured} 
                    isTrending={event.popularityScore > 50} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
