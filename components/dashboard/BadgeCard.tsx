'use client';

import { Badge } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeCardProps {
    badge: Badge;
    isUnlocked: boolean;
    earnedDate?: Date;
    className?: string;
}

export function BadgeCard({ badge, isUnlocked, earnedDate, className }: BadgeCardProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card className={cn(
                        "overflow-hidden transition-all hover:shadow-md cursor-help border-2",
                        isUnlocked
                            ? "border-primary/20 bg-gradient-to-br from-background to-primary/5"
                            : "border-dashed border-border opacity-70 bg-muted/30 grayscale hover:grayscale-0",
                        className
                    )}>
                        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                            <div className="relative w-16 h-16">
                                {/* Placeholder for badge icon if no image provided, assuming badge.icon contains image URL or Lucide component name? 
                     Mock data defines icon as string (emoji or url). 
                     Let's assume it's an emoji/string for now as per mockData.ts
                 */}
                                <div className={cn(
                                    "w-full h-full rounded-full flex items-center justify-center text-4xl shadow-inner",
                                    isUnlocked ? "bg-white dark:bg-black/20" : "bg-gray-200 dark:bg-gray-800"
                                )}>
                                    {badge.icon}
                                </div>

                                {!isUnlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-full">
                                        <Lock className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1 w-full">
                                <h4 className={cn("font-bold text-sm", !isUnlocked && "text-muted-foreground")}>
                                    {badge.name}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                                    {badge.description}
                                </p>
                            </div>

                            {isUnlocked && earnedDate && (
                                <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                                    Earned {earnedDate.toLocaleDateString()}
                                </span>
                            )}
                        </CardContent>
                    </Card>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-semibold">{badge.name}</p>
                    <p className="text-xs text-muted-foreground max-w-[200px]">{badge.description}</p>
                    {!isUnlocked && <p className="text-xs text-red-400 mt-1 italic">Locked</p>}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
