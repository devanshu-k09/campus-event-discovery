'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from '@/components/events/EventCard';
import { FilterSidebar } from '@/components/events/FilterSidebar';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
    SlidersHorizontal,
    X,
    ChevronLeft,
    ChevronRight,
    Search,
    ChevronDown,
    ArrowUpDown
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DateRange } from 'react-day-picker';
import { isWithinInterval } from 'date-fns';
import { EventsSkeleton } from '@/components/events/EventsSkeleton';
import { Navbar } from '@/components/landing/Navbar';
import { NoEventsFound } from '@/components/events/NoEventsFound';

export default function EventsPage() {
    const [mounted, setMounted] = useState(false);
    const [allEvents, setAllEvents] = useState<any[]>([]);

    // Filter State
    const [filters, setFilters] = useState({
        categories: [] as string[],
        dateRange: undefined as DateRange | undefined,
        priceRange: [0, 1000] as [number, number],
        location: 'all',
        timeOfDay: 'all',
        costType: [] as string[] // 'free', 'paid', 'under-500'
    });

    const [sortBy, setSortBy] = useState('upcoming');

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setMounted(true);
        // Read search query from URL
        const params = new URLSearchParams(window.location.search);
        const query = params.get('search');
        if (query) {
            setSearchQuery(query);
        }
    }, []);

    // BUG 3 FIX: Fetch published events from database instead of using mockData
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch('/api/events?upcoming=true');
                const json = await res.json();
                if (json.success && json.data) {
                    setAllEvents(json.data);
                } else {
                    setAllEvents([]);
                }
            } catch (error) {
                setAllEvents([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEvents();
    }, []);

    // Filter Logic — operates on DB-fetched events instead of mockData
    const filteredEvents = allEvents.filter(event => {
        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                event.title.toLowerCase().includes(query) ||
                (event.description || '').toLowerCase().includes(query) ||
                (event.location || '').toLowerCase().includes(query) ||
                (event.category || '').toLowerCase().includes(query);

            if (!matchesSearch) return false;
        }

        // Category Filter
        if (filters.categories.length > 0 && !filters.categories.includes(event.category)) {
            return false;
        }

        // Date Range Filter
        if (filters.dateRange?.from) {
            const eventDate = new Date(event.date);
            if (filters.dateRange.to) {
                if (!isWithinInterval(eventDate, { start: filters.dateRange.from, end: filters.dateRange.to })) {
                    return false;
                }
            } else if (eventDate < filters.dateRange.from) {
                return false;
            }
        }

        // Price Filter (in ₹)
        const eventPrice = typeof event.price === 'number' ? event.price : Number(event.price);
        if (eventPrice < filters.priceRange[0] || eventPrice > filters.priceRange[1]) {
            return false;
        }

        // Cost Type Filter (BUG 5 FIX: All references use ₹, not $)
        if (filters.costType.length > 0) {
            const matchesCostINR = filters.costType.some(type => {
                if (type === 'free') return eventPrice === 0;
                if (type === 'under-10') return eventPrice > 0 && eventPrice < 500; // Under ₹500
                if (type === 'paid') return eventPrice > 0;
                return false;
            });
            if (!matchesCostINR) return false;
        }

        // Location Filter
        if (filters.location !== 'all') {
            if (!(event.location || '').toLowerCase().includes(filters.location.toLowerCase())) {
                return false;
            }
        }

        // Time of Day (Simplified logic)
        if (filters.timeOfDay !== 'all') {
            const hour = new Date(event.date).getHours();
            if (filters.timeOfDay === 'morning' && (hour < 6 || hour >= 12)) return false;
            if (filters.timeOfDay === 'afternoon' && (hour < 12 || hour >= 17)) return false;
            if (filters.timeOfDay === 'evening' && hour < 17) return false;
        }

        return true;
    });

    // Sort Logic
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        switch (sortBy) {
            case 'upcoming':
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case 'popularity':
                return (b.popularityScore || 0) - (a.popularityScore || 0);
            case 'relevance':
                return 0;
            default:
                return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
    });

    const activeFilterCount =
        filters.categories.length +
        filters.costType.length +
        (filters.dateRange ? 1 : 0) +
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0) +
        (filters.location !== 'all' ? 1 : 0) +
        (filters.timeOfDay !== 'all' ? 1 : 0);

    const removeCategory = (cat: string) => {
        setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }));
    };

    const removeCostType = (type: string) => {
        setFilters(prev => ({ ...prev, costType: prev.costType.filter(t => t !== type) }));
    };

    const clearAll = () => {
        setFilters({
            categories: [],
            dateRange: undefined,
            priceRange: [0, 1000],
            location: 'all',
            timeOfDay: 'all',
            costType: []
        });
        setSearchQuery('');
    }

    if (!mounted) return null;
    if (isLoading) return <EventsSkeleton />;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans pb-20">
            <Navbar onSearch={setSearchQuery} />
            <div className="max-w-[1440px] mx-auto px-6 py-8 pt-24">

                <div className="flex gap-8">

                    {/* Sidebar Filters (Desktop) */}
                    <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-24 h-fit">
                        <FilterSidebar filters={filters} onFilterChange={setFilters} />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">

                        {/* Header & Filter Chips */}
                        <div className="mb-8">
                            <div className="flex items-baseline justify-between mb-4">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming Events</h1>
                                <span className="text-sm text-slate-500">{sortedEvents.length} events found for your selection</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">

                                {/* Mobile Filter Button */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="lg:hidden mr-2">
                                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                                            Filters
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="overflow-y-auto w-full sm:w-[350px]">
                                        <SheetHeader className="text-left mb-6">
                                            <SheetTitle>Filters</SheetTitle>
                                        </SheetHeader>
                                        <FilterSidebar filters={filters} onFilterChange={setFilters} className="border-none shadow-none" />
                                    </SheetContent>
                                </Sheet>

                                {/* Category Chips */}
                                {filters.categories.map(cat => (
                                    <div key={cat} className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm animate-in fade-in zoom-in duration-200">
                                        {cat}
                                        <button onClick={() => removeCategory(cat)} className="hover:opacity-80 transition-opacity ml-1">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* Cost Chips */}
                                {filters.costType.map(type => (
                                    <div key={type} className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm animate-in fade-in zoom-in duration-200 capitalize">
                                        {type.replace('-', ' ')}
                                        <button onClick={() => removeCostType(type)} className="hover:opacity-80 transition-opacity ml-1">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="text-xs font-semibold text-primary hover:underline ml-2"
                                    >
                                        Clear All
                                    </button>
                                )}

                                <div className="ml-auto flex items-center gap-3 text-sm">
                                    <span className="text-slate-500 font-medium hidden sm:inline">Sort by:</span>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-[180px] h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white shadow-sm focus:ring-primary/20 transition-all">
                                            <div className="flex items-center gap-2">
                                                <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                                                <SelectValue placeholder="Sort by" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-2xl">
                                            <SelectItem value="upcoming" className="font-medium focus:bg-primary/5 focus:text-primary rounded-lg transition-colors cursor-pointer">Date (Upcoming)</SelectItem>
                                            <SelectItem value="popularity" className="font-medium focus:bg-primary/5 focus:text-primary rounded-lg transition-colors cursor-pointer">Popularity</SelectItem>
                                            <SelectItem value="relevance" className="font-medium focus:bg-primary/5 focus:text-primary rounded-lg transition-colors cursor-pointer">Relevance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Event Grid */}
                        {sortedEvents.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {sortedEvents.map((event) => (
                                        <motion.div
                                            key={event.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <EventCard event={event} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <NoEventsFound onClearFilters={clearAll} />
                        )}

                        {/* Pagination */}
                        {sortedEvents.length > 0 && (
                            <div className="mt-12 flex justify-center">
                                <nav className="flex items-center gap-2">
                                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50" disabled>
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-md shadow-primary/20">1</button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">2</button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">3</button>
                                    <span className="mx-2 text-slate-400">...</span>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">8</button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </nav>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
