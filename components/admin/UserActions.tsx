"use client";

import { 
  MoreVertical, 
  Trash2, 
  Ban, 
  ArrowUpRight 
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
import { adminTerminateUser } from "@/app/actions/user";
import { useState } from "react";

interface UserActionsProps {
  userId: string;
  userName: string;
}

export function UserActions({ userId, userName }: UserActionsProps) {
  const router = useRouter();
  const [isTerminating, setIsTerminating] = useState(false);

  const handleAction = async (action: string) => {
    switch (action) {
      case 'insights':
        toast.info(`Fetching insights for ${userName}...`, {
          description: "Analyzing user behavior and activity patterns."
        });
        // router.push(`/admin/users/${userId}`);
        break;
      case 'restrict':
        toast.warning(`Account Restricted: ${userName}`, {
          description: "The user's access has been limited to read-only."
        });
        break;
      case 'terminate':
        if (isTerminating) return;
        
        const confirmTerminate = window.confirm(`Are you sure you want to terminate ${userName}? This will cancel all their events and bookings.`);
        if (!confirmTerminate) return;

        setIsTerminating(true);
        toast.loading(`Terminating ${userName}...`, { id: 'terminate-toast' });
        
        try {
            const res = await adminTerminateUser(userId);
            if (res.success) {
                toast.success(`User Terminated: ${userName}`, {
                    id: 'terminate-toast',
                    description: "All access tokens revoked, account deactivated, and events cancelled."
                });
                router.refresh();
            } else {
                toast.error(`Termination Failed`, {
                    id: 'terminate-toast',
                    description: res.error || "An error occurred."
                });
            }
        } catch (error) {
            toast.error(`Error`, {
                id: 'terminate-toast',
                description: "Something went wrong."
            });
        } finally {
            setIsTerminating(false);
        }
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          suppressHydrationWarning
          className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group"
        >
          <MoreVertical className="w-5 h-5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-slate-200 dark:border-slate-800 p-2 shadow-xl">
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">User Options</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleAction('insights')}
          className="rounded-xl gap-2 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span className="font-bold">View full insights</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleAction('restrict')}
          className="rounded-xl gap-2 cursor-pointer focus:bg-amber-50 dark:focus:bg-amber-900/20 focus:text-amber-600 dark:focus:text-amber-400"
        >
          <Ban className="w-4 h-4" />
          <span className="font-bold">Restrict account</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />
        <DropdownMenuItem 
          onClick={() => handleAction('terminate')}
          className="rounded-xl gap-2 cursor-pointer text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-900/20"
        >
          <Trash2 className="w-4 h-4" />
          <span className="font-bold">Terminate user</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
