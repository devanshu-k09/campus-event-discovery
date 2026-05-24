'use client';

import { LucideIcon, CalendarCheck, Award, MessageSquare, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type ActivityType = 'register' | 'attend' | 'badge' | 'review';

export interface Activity {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: Date;
    metadata?: any;
}

interface ActivityFeedProps {
    activities: Activity[];
    className?: string;
}

const getActivityIcon = (type: ActivityType): LucideIcon => {
    switch (type) {
        case 'register': return CalendarCheck;
        case 'attend': return Star;
        case 'badge': return Award;
        case 'review': return MessageSquare;
    }
};

const getActivityColor = (type: ActivityType) => {
    switch (type) {
        case 'register': return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
        case 'attend': return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
        case 'badge': return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
        case 'review': return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
    }
};

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
    if (activities.length === 0) {
        return <div className="text-center py-4 text-muted-foreground text-sm">No recent activity.</div>;
    }

    return (
        <div className={cn("space-y-4", className)}>
            {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);

                return (
                    <div key={activity.id} className="flex gap-4 items-start group">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5", colorClass)}>
                            <Icon className="w-4 h-4" />
                        </div>

                        <div className="space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none">{activity.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
                            <p className="text-[10px] text-muted-foreground/70">
                                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
