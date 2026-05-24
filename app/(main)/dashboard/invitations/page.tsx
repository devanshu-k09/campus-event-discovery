'use client';

import { InvitationInbox } from '@/components/dashboard/InvitationInbox';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function InvitationsPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-8 mb-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Link 
                        href="/dashboard" 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Mail className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Collaboration Invites
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Manage your invitations to co-host campus events
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4">
                <InvitationInbox />
            </main>
        </div>
    );
}
