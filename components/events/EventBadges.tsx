import { EventBadge } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Flame, Radio, Star, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventBadgesProps {
    badges: EventBadge[];
    compact?: boolean;
    className?: string;
}

export function EventBadges({ badges, compact = false, className }: EventBadgesProps) {
    if (!badges || badges.length === 0) return null;

    const getBadgeConfig = (badge: EventBadge) => {
        switch (badge) {
            case 'Live Event':
                return { icon: Radio, color: 'bg-red-500 text-white border-red-500 hover:bg-red-600' };
            case 'AI Pick':
                return { icon: Sparkles, color: 'bg-purple-500 text-white border-purple-500 hover:bg-purple-600' };
            case 'Trending':
                return { icon: Flame, color: 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' };
            case 'Featured':
                return { icon: Star, color: 'bg-yellow-400 text-yellow-950 border-yellow-400 hover:bg-yellow-500' };
            case 'New':
                return { icon: Clock, color: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' };
            case 'Selling Fast':
                return { icon: AlertCircle, color: 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600' };
            default:
                return { icon: null, color: 'bg-secondary text-secondary-foreground' };
        }
    };

    return (
        <div className={cn("flex flex-wrap gap-1.5", className)}>
            {badges.map(badge => {
                const { icon: Icon, color } = getBadgeConfig(badge);
                return (
                    <Badge 
                        key={badge} 
                        variant="outline" 
                        className={cn(
                            "shadow-sm font-medium backdrop-blur-md transition-all duration-300",
                            color,
                            compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
                        )}
                    >
                        {Icon && <Icon className={cn("mr-1", compact ? "w-3 h-3" : "w-4 h-4")} />}
                        {badge}
                    </Badge>
                );
            })}
        </div>
    );
}
