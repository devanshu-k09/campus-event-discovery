'use client';

import { Button } from '@/components/ui/button';
import { SearchX, Calendar, Sparkles, MapPin, Bell } from 'lucide-react';

interface NoEventsFoundProps {
    onClearFilters: () => void;
}

export function NoEventsFound({ onClearFilters }: NoEventsFoundProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">

                {/* Illustration */}
                <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-primary/10 border border-primary/10">
                            <SearchX className="w-24 h-24 text-primary" />
                        </div>
                        {/* Floating Decorative Icons */}
                        <Calendar className="absolute -top-2 left-0 text-slate-300 dark:text-slate-600 transform -rotate-12 w-8 h-8" />
                        <Sparkles className="absolute top-10 -right-4 text-primary/30 transform rotate-12 w-10 h-10" />
                        <MapPin className="absolute -bottom-4 right-10 text-slate-400/20 w-12 h-12" />
                    </div>
                </div>

                {/* Messaging */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Oops! No events here.</h1>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        It looks like your filters are a bit too specific. Try adjusting your search criteria to find what you're looking for.
                    </p>
                </div>

                {/* Primary CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        onClick={onClearFilters}
                        className="w-full sm:w-auto px-10 py-6 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <SearchX className="w-5 h-5" />
                        Clear All Filters
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto px-10 py-6 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-bold rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary/20 hover:text-primary transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                        <Bell className="w-5 h-5 group-hover:animate-bounce" />
                        Notify Me
                    </Button>
                </div>

                {/* Secondary Assistance */}
                <div className="pt-8 flex flex-col items-center gap-4 border-t border-primary/10">
                    <p className="text-sm text-slate-400">Or try searching for popular terms:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {['Pizza Socials', 'Career Fair', 'Basketball Games'].map((term) => (
                            <button
                                key={term}
                                className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
