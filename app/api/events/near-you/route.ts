import { NextRequest, NextResponse } from 'next/server';
import { getPublishedEvents } from '@/app/actions/event';
import { getCachedExternalEvents, mergeEvents } from '@/lib/external-events';
import { computeBadges } from '@/lib/badges';

export async function GET(request: NextRequest) {
    console.log('--- GET /api/events/near-you started ---');
    try {
        const searchParams = request.nextUrl.searchParams;
        const city = searchParams.get('city') || process.env.DEFAULT_CITY || 'Mumbai';
        console.log('Fetching events for city:', city);

        const [internalEvents, externalEvents] = await Promise.all([
            getPublishedEvents({}).catch(err => {
                console.error('Error fetching internal events in near-you:', err);
                return [];
            }),
            getCachedExternalEvents(city).catch(err => {
                console.error('Error fetching external events in near-you:', err);
                return [];
            })
        ]);

        console.log(`Found ${internalEvents.length} internal and ${externalEvents.length} external events`);

        // Simple memory filter for internal events (fallback)
        const filteredInternal = internalEvents.filter(e => 
            !e.city || e.city.toLowerCase() === city.toLowerCase() || e.location?.toLowerCase().includes(city.toLowerCase())
        );

        // Merge them
        const mergedEvents = mergeEvents(filteredInternal, externalEvents);

        // Add badges
        const withBadges = mergedEvents.map(event => ({
            ...event,
            badges: computeBadges(event)
        })).slice(0, 15);

        console.log('--- GET /api/events/near-you finished successfully ---');
        return NextResponse.json({ events: withBadges });
    } catch (error) {
        console.error('CRITICAL ERROR in near-you API:', error);
        return NextResponse.json({ events: [], error: 'Internal Server Error' }, { status: 500 });
    }
}
