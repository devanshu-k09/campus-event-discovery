import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EventCardSkeletonProps {
    view?: 'grid' | 'list';
}

export function EventCardSkeleton({ view = 'grid' }: EventCardSkeletonProps) {
    return (
        <Card className={cn(
            "overflow-hidden h-full flex flex-col border-border/50",
            view === 'list' ? "flex-row md:h-56" : ""
        )}>
            {/* Image Skeleton */}
            <div className={cn(
                "relative bg-muted skeleton-shimmer",
                view === 'grid' ? "h-48 w-full" : "w-1/3 min-w-[33%] h-full"
            )} />

            {/* Content Skeleton */}
            <div className={cn(
                "flex flex-col flex-grow p-4 bg-white dark:bg-slate-900",
                view === 'list' && "justify-between"
            )}>
                <div className="space-y-3">
                    {/* Title */}
                    <div className="h-5 bg-muted rounded-md w-3/4 skeleton-shimmer" />
                    <div className="h-5 bg-muted rounded-md w-1/2 skeleton-shimmer" />

                    {/* Date & Location */}
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="h-4 bg-muted rounded-md w-2/3 skeleton-shimmer" />
                        <div className="h-4 bg-muted rounded-md w-1/2 skeleton-shimmer" />
                    </div>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between">
                    {/* Price */}
                    <div className="h-5 bg-muted rounded-md w-16 skeleton-shimmer" />
                    {/* Button */}
                    <div className="h-8 bg-muted rounded-full w-24 skeleton-shimmer" />
                </div>
            </div>
        </Card>
    );
}
