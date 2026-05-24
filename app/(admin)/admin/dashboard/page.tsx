import { prisma } from "@/lib/db";
import { 
  Users, 
  Calendar, 
  Ticket, 
  IndianRupee, 
  Activity,
  ArrowUpRight,
  Plus
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/StatCard";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminDashboardPage() {
  // Fetch stats in parallel
  const [
    totalUsers,
    totalEvents,
    totalRegistrations,
    revenueResult,
    recentRegistrations,
    topEvents
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.registration.count(),
    prisma.registration.aggregate({
      _sum: {
        priceAtBooking: true
      }
    }),
    prisma.registration.findMany({
      take: 5,
      orderBy: { registeredAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, image: true } },
        event: { select: { title: true, category: true } }
      }
    }),
    prisma.event.findMany({
      take: 4,
      orderBy: { registrations: { _count: 'desc' } },
      include: {
        _count: { select: { registrations: true } },
        organizer: { select: { name: true, image: true } }
      }
    })
  ]);

  const totalRevenue = Number(revenueResult._sum.priceAtBooking || 0);

  // Fake chart data (derived from actual data if needed)
  const revenueData = [
    { name: 'Jan', revenue: totalRevenue * 0.1, bookings: 45 },
    { name: 'Feb', revenue: totalRevenue * 0.15, bookings: 52 },
    { name: 'Mar', revenue: totalRevenue * 0.25, bookings: 88 },
    { name: 'Apr', revenue: totalRevenue * 0.2, bookings: 65 },
    { name: 'May', revenue: totalRevenue * 0.3, bookings: 120 },
  ];

  const categoryData = [
    { name: 'Technical', value: 45 },
    { name: 'Cultural', value: 30 },
    { name: 'Sports', value: 15 },
    { name: 'Workshop', value: 10 },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Platform performance and strategic overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            Download Report
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-2xl text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
            <Plus size={18} />
            Create Alert
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Users" 
          value={totalUsers.toLocaleString()} 
          iconName="users" 
          trend="12.5%" 
          trendUp={true} 
          color="indigo" 
          delay={0}
          href="/admin/users"
        />
        <StatCard 
          title="Active Events" 
          value={totalEvents} 
          iconName="calendar" 
          trend="8.2%" 
          trendUp={true} 
          color="amber" 
          delay={0.1}
          href="/admin/events"
        />
        <StatCard 
          title="Total Bookings" 
          value={totalRegistrations.toLocaleString()} 
          iconName="ticket" 
          trend="24.1%" 
          trendUp={true} 
          color="emerald" 
          delay={0.2}
          href="/admin/bookings"
        />
        <StatCard 
          title="Gross Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          iconName="rupee" 
          trend="18.5%" 
          trendUp={true} 
          color="rose" 
          delay={0.3}
          href="/admin/analytics"
        />
      </div>

      {/* Analytics Section */}
      <AnalyticsCharts revenueData={revenueData} categoryData={categoryData} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Bookings</h3>
            <Link href="/admin/bookings" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 group">
              View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-800/50">
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Event</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {recentRegistrations.length > 0 ? recentRegistrations.map((reg) => (
                    <tr key={reg.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                      <td className="px-8 py-5">
                        <Link href="/admin/users" className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border-2 border-slate-50 dark:border-slate-800 group-hover:border-indigo-100 transition-all">
                            <AvatarImage src={reg.user.image || ""} />
                            <AvatarFallback className="bg-indigo-600 text-white font-bold">{reg.user.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{reg.user.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{reg.user.email}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-8 py-5">
                        <Link href="/admin/events" className="block">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{reg.event.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{reg.event.category}</p>
                        </Link>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-emerald-600">₹{Number(reg.priceAtBooking).toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Badge className="bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border-none font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">
                          Successful
                        </Badge>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full">
                            <Activity className="w-10 h-10 text-slate-300" />
                          </div>
                          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No recent bookings found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Trending Events */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Trending Events</h3>
          <div className="space-y-4">
            {topEvents.map((event, i) => (
              <Link
                key={event.id}
                href="/admin/events"
                className="group block p-5 bg-white dark:bg-[#111827] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14 rounded-2xl border-2 border-slate-50 dark:border-slate-800">
                      <AvatarImage src={event.organizer.image || ""} />
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-black">{event.organizer.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors leading-tight">
                        {event.title}
                      </h4>
                      <Badge className="bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-none font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-tighter shrink-0">
                        Top {i+1}
                      </Badge>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-tight">by {event.organizer.name}</p>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Bookings</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">{event._count.registrations}</span>
                      </div>
                      <div className="w-[1px] h-6 bg-slate-100 dark:bg-slate-800" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Growth</span>
                        <span className="text-sm font-black text-emerald-600">+{Math.floor(Math.random() * 20) + 10}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {topEvents.length === 0 && <p className="text-center text-slate-400 italic">No events trending</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
