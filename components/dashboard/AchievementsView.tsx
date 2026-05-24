'use client';

import { motion } from 'framer-motion';
import {
    Medal,
    Star,
    Award,
    Check,
    Lock,
    Info,
    Trophy,
    MoreVertical,
    TrendingUp,
    Sparkles,
    ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// --- Mock Data for Achievements View ---
const badges = [
    {
        id: 1,
        name: 'Event Explorer',
        description: 'Earned on Oct 12',
        icon: 'https://cdn-icons-png.flaticon.com/512/3112/3112946.png', // Placeholder or use the URL from HTML
        status: 'earned',
        color: 'bg-blue-500'
    },
    {
        id: 2,
        name: 'Early Bird',
        description: 'Earned on Nov 02',
        icon: 'https://cdn-icons-png.flaticon.com/512/3280/3280979.png',
        status: 'earned',
        color: 'bg-amber-500'
    },
    {
        id: 3,
        name: 'Networking Ninja',
        description: 'Connect with 10 peers',
        icon: 'https://cdn-icons-png.flaticon.com/512/1256/1256650.png',
        status: 'locked',
        color: 'bg-slate-400'
    },
    {
        id: 4,
        name: 'Volunteer Star',
        description: 'Assist in 2 events',
        icon: 'https://cdn-icons-png.flaticon.com/512/2990/2990638.png',
        status: 'locked',
        color: 'bg-slate-400'
    }
];

const milestones = [
    {
        id: 1,
        title: 'Workshop Enthusiast',
        description: 'Attend 5 workshops',
        current: 3,
        total: 5,
        progress: 60
    },
    {
        id: 2,
        title: 'Feedback Contributor',
        description: 'Provide feedback for 10 events',
        current: 8,
        total: 10,
        progress: 80
    }
];

const leaderboard = [
    { rank: 1, name: 'Sarah Johnson', points: '4,890', avatar: 'https://i.pravatar.cc/150?u=sarah', color: 'text-yellow-500' },
    { rank: 2, name: 'Marcus King', points: '4,120', avatar: 'https://i.pravatar.cc/150?u=marcus', color: 'text-slate-400' },
    { rank: 3, name: 'Elena Rodriguez', points: '3,950', avatar: 'https://i.pravatar.cc/150?u=elena', color: 'text-orange-400' },
];

export function AchievementsView() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Celebration Milestone Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
                        <Medal className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Keep going, Alex!</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Only <span className="text-primary font-bold">50 points</span> to your next milestone: <span className="italic">Expert Organizer</span>.</p>
                    </div>
                </div>
                <Button className="relative z-10 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    Explore Events
                </Button>
                <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-10">
                    <Star className="w-[150px] h-[150px] fill-current" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Achievement Area */}
                <div className="lg:col-span-3 space-y-10">

                    {/* Badge Grid Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                                <Award className="w-6 h-6 text-primary" />
                                Badges & Medals
                            </h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">All 24</span>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-full">Earned 12</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {badges.map((badge) => (
                                <div
                                    key={badge.id}
                                    className={cn(
                                        "bg-white dark:bg-slate-900 border p-6 rounded-xl text-center group transition-all relative overflow-hidden",
                                        badge.status === 'earned'
                                            ? "border-slate-200 dark:border-slate-800 border-b-4 border-b-primary hover:shadow-xl hover:-translate-y-1"
                                            : "border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 grayscale opacity-70"
                                    )}
                                >
                                    <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center relative">
                                        {/* Using simple colored circles as placeholders if external images fail, or render provided logic */}
                                        <div className={cn("w-14 h-14 rounded-full", badge.status === 'earned' ? badge.color : "bg-slate-300")} />

                                        {badge.status === 'earned' && (
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900">
                                                <Check className="w-3 h-3" strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                    <h4 className={cn("font-bold", badge.status === 'earned' ? "text-slate-800 dark:text-white" : "text-slate-400")}>
                                        {badge.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1 italic">{badge.description}</p>

                                    {badge.status === 'locked' && (
                                        <div className="absolute top-2 right-2 text-slate-400">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Next Milestones / Progress Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Upcoming Milestones</h3>
                            <Info className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {milestones.map((milestone) => (
                                <div key={milestone.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white">{milestone.title}</h4>
                                            <p className="text-sm text-slate-500">{milestone.description}</p>
                                        </div>
                                        <span className="text-primary font-bold">{milestone.progress}%</span>
                                    </div>
                                    <Progress value={milestone.progress} className="h-3 bg-primary/10" />
                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-2">
                                        <span>{milestone.current} Completed</span>
                                        <span>{milestone.total} Total</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar: Leaderboard */}
                <aside className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Leaderboard
                            </h3>
                            <p className="text-xs text-slate-500">Top contributors this month</p>
                        </div>
                        <div className="p-4 space-y-3">
                            {leaderboard.map((user) => (
                                <div key={user.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className={cn("w-6 text-center font-bold", user.color)}>{user.rank}</div>
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate text-slate-800 dark:text-white">{user.name}</p>
                                        <p className="text-[10px] text-slate-500">{user.points} pts</p>
                                    </div>
                                </div>
                            ))}

                            {/* Separator */}
                            <div className="flex justify-center py-1">
                                <MoreVertical className="w-4 h-4 text-slate-300" />
                            </div>

                            {/* Current User Rank */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-white dark:ring-slate-800">
                                <div className="w-6 text-center font-bold">12</div>
                                <div className="relative w-10 h-10 rounded-full border border-white/30 overflow-hidden">
                                    <Image src="https://i.pravatar.cc/150?u=a042581f4e29026024ab" alt="You" fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">Alex (You)</p>
                                    <p className="text-[10px] text-indigo-100 opacity-90">2,450 pts</p>
                                </div>
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center">
                            <button className="text-xs font-bold text-primary hover:underline">View Full Leaderboard</button>
                        </div>
                    </div>

                    {/* Rewards Tip Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-primary p-6 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-indigo-200" />
                            <h4 className="font-bold">Redeem Rewards</h4>
                        </div>
                        <p className="text-xs text-indigo-100 mb-4 leading-relaxed">Trade your hard-earned points for campus cafe vouchers or exclusive merch.</p>
                        <Button variant="secondary" className="w-full text-primary font-bold hover:bg-white/90">
                            Visit Shop
                        </Button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
