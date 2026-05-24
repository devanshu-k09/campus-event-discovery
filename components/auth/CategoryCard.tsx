'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
    id: string;
    label: string;
    icon?: string | LucideIcon; // Can be a string emoji or icon component
    isSelected: boolean;
    onClick: () => void;
}

export function CategoryCard({ id, label, icon, isSelected, onClick }: CategoryCardProps) {
    // Helper to render icon/emoji
    const renderIcon = () => {
        if (typeof icon === 'string') {
            return <span className="text-2xl">{icon}</span>;
        }
        if (icon) {
            const IconComp = icon;
            return <IconComp className={cn("w-6 h-6", isSelected ? "text-primary" : "text-muted-foreground")} />;
        }
        return null;
    };

    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 gap-2 h-28 w-full",
                isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
            )}
        >
            <div className={cn(
                "p-2 rounded-full transition-colors",
                isSelected ? "bg-primary/10" : "bg-muted"
            )}>
                {renderIcon()}
            </div>
            <span className={cn(
                "text-sm font-medium",
                isSelected ? "text-primary" : "text-foreground"
            )}>
                {label}
            </span>
        </motion.button>
    );
}
