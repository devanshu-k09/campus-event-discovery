'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    className?: string;
    color?: 'default' | 'blue' | 'purple' | 'pink' | 'green' | 'yellow';
}

export function StatsCard({
    label,
    value,
    icon: Icon,
    trend,
    className,
    color = 'default'
}: StatsCardProps) {

    const colorStyles = {
        default: "bg-background border-border",
        blue: "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
        purple: "bg-purple-50/50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100",
        pink: "bg-pink-50/50 dark:bg-pink-900/10 border-pink-200 dark:border-pink-800 text-pink-900 dark:text-pink-100",
        green: "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
        yellow: "bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100",
    };

    const iconStyles = {
        default: "text-muted-foreground",
        blue: "text-blue-500",
        purple: "text-purple-500",
        pink: "text-pink-500",
        green: "text-green-500",
        yellow: "text-yellow-500",
    };

    return (
        <Card className={cn("overflow-hidden transition-all hover:shadow-md", colorStyles[color], className)}>
            <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium opacity-80">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold">{value}</h3>
                        {trend && (
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">
                                {trend}
                            </span>
                        )}
                    </div>
                </div>
                <div className={cn("p-3 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm shadow-sm", iconStyles[color])}>
                    <Icon className="w-6 h-6" />
                </div>
            </CardContent>
        </Card>
    );
}
