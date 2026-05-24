'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import { DateRange } from 'react-day-picker';
import { Lightbulb } from 'lucide-react';

interface FilterState {
    categories: string[];
    dateRange: DateRange | undefined;
    priceRange: [number, number];
    location: string;
    timeOfDay: string;
    costType: string[]; // 'free', 'paid', 'under-10'
}

interface FilterSidebarProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    className?: string;
    counts?: { [key: string]: number }; // Optional category counts
}

export function FilterSidebar({ filters, onFilterChange, className, counts }: FilterSidebarProps) {
    const handleCategoryChange = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        onFilterChange({ ...filters, categories: newCategories });
    };

    const handleCostChange = (type: string) => {
        const newCostTypes = filters.costType.includes(type)
            ? filters.costType.filter(c => c !== type)
            : [...filters.costType, type];
        onFilterChange({ ...filters, costType: newCostTypes });
    };

    return (
        <div className={cn("space-y-8", className)}>
            {/* Categories */}
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Categories</h3>
                <div className="space-y-3">
                    {CATEGORIES.map(c => c.label).map((category) => (
                        <label key={category} className="flex items-center group cursor-pointer">
                            <div className="relative flex items-center">
                                <Checkbox
                                    checked={filters.categories.includes(category)}
                                    onCheckedChange={() => handleCategoryChange(category)}
                                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary transition-colors data-[state=checked]:bg-primary data-[state=checked]:text-white"
                                />
                            </div>
                            <span className={cn(
                                "ml-3 text-sm font-medium transition-colors",
                                filters.categories.includes(category)
                                    ? "text-primary"
                                    : "text-slate-600 dark:text-slate-400 group-hover:text-primary"
                            )}>
                                {category}
                            </span>
                            {/* Mock counts or real counts if passed */}
                            <span className="ml-auto text-xs text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                {counts?.[category] || Math.floor(Math.random() * 20) + 1}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Cost Filter (Matching HTML) */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Cost</h3>
                <div className="space-y-3">
                    <label className="flex items-center group cursor-pointer">
                        <div className="relative flex items-center">
                            <Checkbox
                                checked={filters.costType.includes('free')}
                                onCheckedChange={() => handleCostChange('free')}
                                className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                            />
                        </div>
                        <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary">Free</span>
                    </label>
                    <label className="flex items-center group cursor-pointer">
                        <div className="relative flex items-center">
                            <Checkbox
                                checked={filters.costType.includes('under-10')}
                                onCheckedChange={() => handleCostChange('under-10')}
                                className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                            />
                        </div>
                        <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary">Under ₹500</span>
                    </label>
                    <label className="flex items-center group cursor-pointer">
                        <div className="relative flex items-center">
                            <Checkbox
                                checked={filters.costType.includes('paid')}
                                onCheckedChange={() => handleCostChange('paid')}
                                className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                            />
                        </div>
                        <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary">Paid</span>
                    </label>
                </div>
            </div>

            {/* Pro Tip Box - Redesigned for Premium Look */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Lightbulb className="w-12 h-12 text-primary rotate-12" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-primary/20 rounded-lg">
                            <Lightbulb className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Pro Tip</span>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        Enable <span className="text-primary font-bold">"My Clubs"</span> to see exclusive events from groups you've already joined!
                    </p>
                </div>
                
                {/* Subtle Decorative element */}
                <div className="absolute -bottom-1 -left-1 w-12 h-12 bg-primary/5 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
}
