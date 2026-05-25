import { Search, CalendarCheck } from 'lucide-react';

export function EventsSkeleton() {
    return (
        <div className="font-sans bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
            {/* Top Navigation Bar Skeleton */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <CalendarCheck className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Campus<span className="text-primary">Pulse</span>
                        </span>
                    </div>
                    {/* Search Bar Placeholder */}
                    <div className="flex-grow max-w-2xl relative hidden md:block">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search className="w-5 h-5" />
                        </span>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg h-10"></div>
                    </div>
                    {/* User Profile Skeleton */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <div className="w-24 h-3 rounded skeleton-shimmer mb-2"></div>
                            <div className="w-16 h-2 rounded skeleton-shimmer"></div>
                        </div>
                        <div className="w-10 h-10 rounded-full skeleton-shimmer"></div>
                    </div>
                </div>
            </nav>

            <div className="max-w-[1440px] mx-auto flex">
                {/* Filter Sidebar Skeleton */}
                <aside className="w-64 hidden lg:block sticky top-16 h-fit p-6 border-r border-slate-200 dark:border-slate-800">
                    <div className="space-y-8">
                        {/* Categories */}
                        <div>
                            <div className="h-4 w-20 rounded skeleton-shimmer mb-4"></div>
                            <ul className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <li key={i}>
                                        <div className="h-10 w-full rounded-lg skeleton-shimmer"></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Date Filter */}
                        <div>
                            <div className="h-4 w-24 rounded skeleton-shimmer mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full skeleton-shimmer"></div>
                                        <div className="h-3 w-16 rounded skeleton-shimmer"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Campus Location */}
                        <div>
                            <div className="h-4 w-16 rounded skeleton-shimmer mb-4"></div>
                            <div className="h-10 w-full rounded-lg skeleton-shimmer"></div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 lg:p-10">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="h-8 w-48 rounded skeleton-shimmer mb-2"></div>
                            <div className="h-4 w-64 rounded skeleton-shimmer"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-32 rounded-lg skeleton-shimmer"></div>
                            <div className="lg:hidden h-10 w-24 rounded-lg skeleton-shimmer"></div>
                        </div>
                    </header>

                    {/* Skeleton Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="h-48 w-full skeleton-shimmer"></div>
                                <div className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 flex-grow">
                                            <div className="h-5 w-3/4 rounded-lg skeleton-shimmer"></div>
                                            <div className="h-3 w-1/2 rounded skeleton-shimmer"></div>
                                        </div>
                                        <div className="h-8 w-8 rounded-full skeleton-shimmer flex-shrink-0"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-4 rounded skeleton-shimmer"></div>
                                        <div className="h-3 w-24 rounded skeleton-shimmer"></div>
                                    </div>
                                    <div className="pt-2 flex items-center justify-between">
                                        <div className="h-8 w-24 rounded-lg skeleton-shimmer"></div>
                                        <div className="h-6 w-16 rounded-full skeleton-shimmer"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Skeleton */}
                    <div className="mt-12 flex justify-center items-center gap-4">
                        <div className="h-10 w-10 rounded-lg skeleton-shimmer"></div>
                        <div className="flex gap-2">
                            <div className="h-10 w-10 rounded-lg skeleton-shimmer"></div>
                            <div className="h-10 w-10 rounded-lg bg-primary/20"></div>
                            <div className="h-10 w-10 rounded-lg skeleton-shimmer"></div>
                        </div>
                        <div className="h-10 w-10 rounded-lg skeleton-shimmer"></div>
                    </div>
                </main>
            </div>

            {/* Background Decoration Elements */}
            <div className="fixed top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="fixed bottom-10 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        </div>
    );
}
