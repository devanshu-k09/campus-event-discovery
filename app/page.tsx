import { Suspense } from 'react';
import { Hero } from '@/components/landing/Hero';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { CategoryFilter } from '@/components/landing/CategoryFilter';
import { EventSection } from '@/components/landing/EventSection';
import { RecommendedSection } from '@/components/landing/RecommendedSection';
import { getPublishedEvents } from '@/app/actions/event';
import { getCachedExternalEvents, mergeEvents } from '@/lib/external-events';
import { computeBadges } from '@/lib/badges';
import { getTrendingEventIds, getPopularThisWeekEventIds, scoreAndRankEvents } from '@/lib/recommendation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const revalidate = 60; // Revalidate every minute

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const isLoggedIn = !!session?.user;
    const resolvedParams = await searchParams;
    const category = resolvedParams.category || 'all';

    // Fetch data in parallel
    const [
        internalEventsData,
        externalEvents,
        trendingIds,
        popularIds
    ] = await Promise.all([
        getPublishedEvents({ category: category !== 'all' ? category : undefined }),
        getCachedExternalEvents(undefined, category),
        getTrendingEventIds(10),
        getPopularThisWeekEventIds(10)
    ]);

    // Merge and map badges
    const allEvents = mergeEvents(internalEventsData, externalEvents).map(event => ({
        ...event,
        badges: computeBadges(event)
    }));

    // 1. Trending Events (Based on interactions + AI score)
    // For trending, we filter by IDs if we have them, else fallback to top view counts
    let trendingEvents = allEvents.filter(e => trendingIds.includes(e.id));
    if (trendingEvents.length < 4) {
        trendingEvents = [...allEvents].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 10);
    }
    
    // Make sure they have the Trending badge if they are actually trending
    trendingEvents = trendingEvents.map(e => ({
        ...e,
        badges: Array.from(new Set([...e.badges, 'Trending' as const]))
    }));

    // 2. Popular This Week
    let popularEvents = allEvents.filter(e => popularIds.includes(e.id));
    if (popularEvents.length < 4) {
        popularEvents = [...allEvents].sort((a, b) => (b.registeredCount || 0) - (a.registeredCount || 0)).slice(0, 10);
    }

    // Initial popular picks for Recommended Section (fallback for logged out)
    const initialRecommended = [...allEvents]
        .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
        .slice(0, 10);

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <Hero />
            
            <div className="container mx-auto px-4 md:px-6 py-8 space-y-12">
                <Suspense fallback={<div className="h-20 animate-pulse bg-muted rounded-xl" />}>
                    <CategoryFilter />
                </Suspense>

                <div className="space-y-16 pb-20">
                    <EventSection
                        title="🔥 Trending Now"
                        subtitle="Events with the most activity in the last 48 hours"
                        events={trendingEvents}
                        hideIfEmpty={true}
                    />

                    <RecommendedSection 
                        initialEvents={initialRecommended} 
                        isLoggedIn={isLoggedIn} 
                        excludeEventIds={trendingEvents.map(e => e.id)}
                    />

                    <EventSection
                        title="⭐ Popular This Week"
                        subtitle="Events with the most registrations"
                        events={popularEvents}
                        hideIfEmpty={true}
                    />
                </div>
            </div>
            <Footer />
        </main>
    );
}
