'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Infinity, Music, Terminal, Trophy, Palette, Utensils, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
    { id: 'all', label: 'All Events', icon: Infinity },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'workshops', label: 'Workshops', icon: Terminal },
    { id: 'sports', label: 'Sports', icon: Trophy },
    { id: 'arts', label: 'Art & Design', icon: Palette },
    { id: 'food', label: 'Food', icon: Utensils },
    { id: 'networking', label: 'Networking', icon: Users },
];

export function CategoryFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const active = searchParams.get('category') || 'all';

    const handleCategoryClick = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (id === 'all') {
            params.delete('category');
        } else {
            params.set('category', id);
        }
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    return (
        <section className="py-4 overflow-x-auto no-scrollbar">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-3 pb-4">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = active === cat.id;

                        return (
                            <Button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                variant={isActive ? "default" : "outline"}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-full font-semibold shrink-0 transition-all duration-300 border-none",
                                    isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                                        : "bg-white dark:bg-slate-800 text-muted-foreground hover:text-primary"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", !isActive && "text-primary")} />
                                {cat.label}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
