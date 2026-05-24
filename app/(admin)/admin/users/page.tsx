import { prisma } from "@/lib/db";
import Link from "next/link";
import { Suspense } from "react";
import { UserActions } from "@/components/admin/UserActions";
import { UserListFilters } from "@/components/admin/UserListFilters";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Trash2, 
  Ban, 
  CheckCircle2, 
  CalendarDays,
  Mail,
  Shield,
  Filter,
  ArrowUpRight
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

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    role?: string;
    userType?: string;
    city?: string;
    category?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const role = resolvedParams.role || "";
  const userType = resolvedParams.userType || "";
  const city = resolvedParams.city || "";
  const category = resolvedParams.category || "";

  // Build the where clause for Prisma
  const whereClause: any = {};
  
  if (query) {
    whereClause.OR = [
      { name: { contains: query } },
      { email: { contains: query } }
    ];
  }

  if (role && ['admin', 'organizer', 'student'].includes(role)) {
    whereClause.role = role;
  }

  if (userType) {
    whereClause.userType = userType;
  }

  if (city) {
    whereClause.preferredCity = city;
  }

  if (category) {
    whereClause.interestedCategories = {
      array_contains: category
    };
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          events: true,
          registrations: true
        }
      }
    }
  });

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">User Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage permissions and monitor user engagement across the platform</p>
        </div>
        <Suspense fallback={<div className="h-10 w-full md:w-80 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />}>
          <UserListFilters />
        </Suspense>
      </div>

      <div className="w-full max-w-full overflow-hidden bg-white dark:bg-[#111827] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-[auto_1.5fr_1fr_1fr_1fr_1.2fr_1.2fr_auto] gap-6 items-center px-8 py-5 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16"></div> {/* Spacer for Avatar */}
          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">User Identity</span>
          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">User Type</span>
          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">City</span>
          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Access Level</span>
          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Activity Metrics</span>
          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Registration</span>
          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Moderation</span>
        </div>

        {/* List Body */}
        <div className="flex flex-col">
          {users.map((user) => (
            <div key={user.id} className="group flex flex-col lg:grid lg:grid-cols-[auto_1.5fr_1fr_1fr_1fr_1.2fr_1.2fr_auto] gap-4 lg:gap-6 items-start lg:items-center px-6 lg:px-8 py-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-b border-slate-50 dark:border-slate-800/50 last:border-none transition-colors">
              
              {/* Avatar */}
              <Link href={`/organizers/${user.id}`} className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-900 group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-all">
                  {user.image ? (
                    <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-black text-xl bg-slate-100 dark:bg-slate-800">
                      {user.name?.[0] || 'U'}
                    </div>
                  )}
                </div>
              </Link>

              {/* Name & Email */}
              <div className="min-w-0 flex-1 w-full lg:w-auto">
                <Link href={`/organizers/${user.id}`} className="block">
                  <p className="text-base font-black text-slate-900 dark:text-white leading-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {user.name || 'Anonymous User'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Mail className="w-3 h-3 text-indigo-500" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </Link>
              </div>

              {/* User Type */}
              <div className="w-full lg:w-auto flex lg:block justify-between items-center">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest lg:hidden">User Type</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {user.userType || 'Student'}
                </span>
              </div>

              {/* Preferred City */}
              <div className="w-full lg:w-auto flex lg:block justify-between items-center">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest lg:hidden">City</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {user.preferredCity || 'N/A'}
                </span>
              </div>

              {/* Mobile divider */}
              <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800 lg:hidden my-2"></div>

              {/* Role */}
              <div className="w-full lg:w-auto flex lg:block justify-between items-center">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest lg:hidden">Access Level</span>
                <Badge 
                  className={cn(
                    "capitalize font-black text-[10px] tracking-widest border-none px-3 py-1 rounded-full shadow-sm whitespace-nowrap",
                    user.role === 'admin' ? "bg-rose-50 dark:bg-rose-600/10 text-rose-600 dark:text-rose-400" : 
                    user.role === 'organizer' ? "bg-amber-50 dark:bg-amber-600/10 text-amber-600 dark:text-amber-400" : 
                    "bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400"
                  )}
                >
                  <Shield className="w-3 h-3 mr-1.5 opacity-70" />
                  {user.role}
                </Badge>
              </div>

              {/* Metrics */}
              <div className="w-full lg:w-auto flex lg:block justify-between items-center">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest lg:hidden">Activity</span>
                <div className="flex items-center gap-6 lg:gap-4 xl:gap-6">
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-base font-black text-slate-900 dark:text-white leading-none">{user._count.events}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter mt-1">Hosted</span>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-800"></div>
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-base font-black text-slate-900 dark:text-white leading-none">{user._count.registrations}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter mt-1">Booked</span>
                  </div>
                </div>
              </div>

              {/* Join Date */}
              <div className="w-full lg:w-auto flex lg:block justify-between items-center">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest lg:hidden">Registration</span>
                <div className="flex flex-col items-end lg:items-start">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    <CalendarDays className="w-4 h-4 text-indigo-500" />
                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter mt-1">Join Date</span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full lg:w-auto flex justify-end lg:block mt-2 lg:mt-0 text-right">
                <UserActions userId={user.id} userName={user.name || 'Anonymous User'} />
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
