'use client';

import { 
    Zap, TrendingUp, Clock, AlertCircle, 
    Flame, Sparkles, Timer, Rocket 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PriceUrgencyBadgeProps {
    label: string | null;
    urgency: string;
    className?: string;
}

export function PriceUrgencyBadge({ label, urgency, className }: PriceUrgencyBadgeProps) {
    if (!label) return null;

    const getColors = () => {
        switch (urgency) {
            case 'critical':
                return 'bg-rose-500 text-white border-rose-400 shadow-rose-500/20';
            case 'high':
                return 'bg-amber-500 text-white border-amber-400 shadow-amber-500/20';
            default:
                return 'bg-blue-500 text-white border-blue-400 shadow-blue-500/20';
        }
    };

    const getIcon = () => {
        switch (urgency) {
            case 'critical':
                return <Flame className="w-3 h-3 animate-pulse" />;
            case 'high':
                return <Zap className="w-3 h-3" />;
            default:
                return <Sparkles className="w-3 h-3" />;
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-sm transition-all hover:scale-105",
                    getColors(),
                    className
                )}
            >
                {getIcon()}
                <span>{label}</span>
            </motion.div>
        </AnimatePresence>
    );
}
