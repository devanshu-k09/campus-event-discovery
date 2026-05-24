"use client";

import { 
  AlertTriangle, 
  Flag, 
  MessageSquare, 
  ShieldAlert, 
  Filter, 
  Download, 
  MoreVertical,
  CheckCircle,
  Clock,
  User,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function AdminReportsPage() {
  // Placeholder data for reports
  const reports = [
    {
      id: "REP-001",
      type: "Inappropriate Content",
      reporter: { name: "John Doe", image: null },
      target: "Workshop on Ethical Hacking",
      date: "2026-05-09",
      status: "pending",
      severity: "high"
    },
    {
      id: "REP-002",
      type: "Spam Event",
      reporter: { name: "Alice Smith", image: null },
      target: "Free Bitcoin Giveaway",
      date: "2026-05-10",
      status: "resolved",
      severity: "critical"
    },
    {
      id: "REP-003",
      type: "User Conduct",
      reporter: { name: "Bob Wilson", image: null },
      target: "User: mark_dev",
      date: "2026-05-10",
      status: "pending",
      severity: "medium"
    }
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Security & Compliance</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Audit platform integrity and resolve user-generated reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <Filter size={18} />
            Filter Incident
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reports.map((report) => (
          <div 
            key={report.id}
            className="group bg-white dark:bg-[#111827] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className={cn(
                  "p-5 rounded-[1.5rem] shadow-lg",
                  report.severity === 'critical' ? "bg-rose-50 text-rose-600 shadow-rose-100" :
                  report.severity === 'high' ? "bg-amber-50 text-amber-600 shadow-amber-100" :
                  "bg-indigo-50 text-indigo-600 shadow-indigo-100",
                  "dark:bg-slate-900 dark:shadow-none"
                )}>
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black text-slate-400 font-mono tracking-widest">{report.id}</span>
                    <Badge className={cn(
                      "font-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-md border-none",
                      report.status === 'resolved' ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    )}>
                      {report.status}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{report.type}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Target: <span className="text-slate-900 dark:text-slate-300 font-bold">{report.target}</span></p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8 lg:text-right">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Reporter</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-slate-100">
                      <AvatarFallback className="text-[10px] font-black">{report.reporter.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{report.reporter.name}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Incident Date</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{report.date}</span>
                </div>
                <button 
                  onClick={() => {
                    toast.success(`Action initiated for ${report.id}`, {
                      description: `Reviewing ${report.target} reported by ${report.reporter.name}.`
                    });
                  }}
                  className="px-6 py-3 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-2xl text-sm font-black hover:bg-indigo-100 dark:hover:bg-indigo-600/20 transition-all flex items-center gap-2"
                >
                  Take Action <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
