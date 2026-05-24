import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPublishedEvents } from '@/app/actions/event';
import { getCachedExternalEvents, mergeEvents } from '@/lib/external-events';
import { getUserPreferences, scoreAndRankEvents } from '@/lib/recommendation';
import { computeBadges } from '@/lib/badges';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ events: [] }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch internal and external events
        const [internalEvents, externalEvents] = await Promise.all([
            getPublishedEvents({}),
            getCachedExternalEvents()
        ]);

        // Merge them
        const mergedEvents = mergeEvents(internalEvents, externalEvents);

        // Get user preferences based on interaction history
        const preferences = await getUserPreferences(userId);

        // Score and rank events
        const rankedEvents = scoreAndRankEvents(mergedEvents, preferences);

        // Add badges
        const withBadges = rankedEvents.map(event => ({
            ...event,
            badges: computeBadges(event, true) // Pass true for isRecommended
        })).slice(0, 10); // Return top 10

        return NextResponse.json({ events: withBadges });
    } catch (error) {
        console.error('Error in recommendations API:', error);
        return NextResponse.json({ events: [] }, { status: 500 });
    }
}
