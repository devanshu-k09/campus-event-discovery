import { prisma } from "@/lib/db";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  IndianRupee,
  Calendar,
  User
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
import { cn } from "@/lib/utils";

import { ExportCSVButton } from "@/components/admin/ExportCSVButton";

export default async function AdminBookingsPage() {
  const bookings = await prisma.registration.findMany({
    orderBy: { registeredAt: 'desc' },
    include: {
      user: { select: { name: true, email: true, image: true } },
      event: { select: { title: true, category: true } }
    },
    take: 20
  });

  const serializedBookings = bookings.map(booking => ({
    ...booking,
    priceAtBooking: Number(booking.priceAtBooking)
  }));

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Transaction Ledger</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Monitor financial health and manage platform-wide registrations</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportCSVButton data={serializedBookings as any} />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Transaction ID</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Event Asset</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</TableHead>
              <TableHead className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-b border-slate-50 dark:border-slate-800/50 last:border-none transition-colors">
                <TableCell className="px-8 py-6">
                  <span className="text-xs font-black text-slate-400 font-mono uppercase tracking-tighter">
                    TXN-{booking.id.substring(0, 8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border-2 border-slate-50 dark:border-slate-800">
                      <AvatarImage src={booking.user.image || ""} />
                      <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black">
                        {booking.user.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{booking.user.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{booking.user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{booking.event.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{booking.event.category}</p>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-emerald-50 dark:bg-emerald-600/10 rounded-md">
                      <IndianRupee className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {Number(booking.priceAtBooking).toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 text-right">
                  <Badge className="bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3 mr-1.5" />
                    Confirmed
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <CreditCard className="w-12 h-12 text-slate-200" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No transactions recorded</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
