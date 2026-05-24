import { prisma } from './db';
import { searchTicketmasterEvents } from './ticketmaster';
import { SmartEvent } from '@/types';

const CACHE_TTL_HOURS = parseInt(process.env.EXTERNAL_CACHE_TTL || '6', 10);

export async function fetchAndCacheExternalEvents(city?: string, category?: string) {
    const tmEvents = await searchTicketmasterEvents({ city, classificationName: category });
    
    if (!tmEvents || tmEvents.length === 0) return [];

    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000);

    // Save to cache
    for (const tmEvent of tmEvents) {
        try {
            await prisma.externalEventCache.upsert({
                where: { externalId: tmEvent.externalId },
                update: {
                    title: tmEvent.title,
                    description: tmEvent.description,
                    image: tmEvent.image,
                    date: new Date(tmEvent.date),
                    time: tmEvent.time,
                    location: tmEvent.location,
                    city: tmEvent.city,
                    price: tmEvent.price,
                    externalLink: tmEvent.externalLink,
                    expiresAt,
                    fetchedAt: now,
                },
                create: {
                    externalId: tmEvent.externalId,
                    source: 'ticketmaster',
                    title: tmEvent.title,
                    description: tmEvent.description,
                    image: tmEvent.image,
                    category: tmEvent.category,
                    date: new Date(tmEvent.date),
                    time: tmEvent.time,
                    location: tmEvent.location,
                    city: tmEvent.city,
                    price: tmEvent.price,
                    externalLink: tmEvent.externalLink,
                    rawData: tmEvent.rawData,
                    expiresAt,
                }
            });
        } catch (error) {
            console.error('Failed to cache external event:', error);
        }
    }

    return tmEvents;
}

export async function getCachedExternalEvents(city?: string, category?: string) {
    const now = new Date();
    
    const where: any = {
        expiresAt: { gt: now }
    };

    if (city) {
        where.city = { contains: city };
    }

    if (category && category !== 'all') {
        where.category = { equals: category };
    }

    const cachedEvents = await prisma.externalEventCache.findMany({
        where,
        orderBy: { date: 'asc' },
        take: 50
    });

    if (cachedEvents.length === 0) {
        // Cache miss or expired, fetch new
        await fetchAndCacheExternalEvents(city, category);
        return await prisma.externalEventCache.findMany({
            where,
            orderBy: { date: 'asc' },
            take: 50
        });
    }

    return cachedEvents;
}

export function mergeEvents(internalEvents: any[], cachedExternalEvents: any[]): SmartEvent[] {
    const smartInternal: SmartEvent[] = internalEvents.map(e => ({
        ...e,
        eventSource: 'internal',
        badges: [],
    }));

    const smartExternal: SmartEvent[] = cachedExternalEvents.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        image: e.image,
        category: e.category as any,
        date: e.date,
        time: e.time,
        duration: 'TBD',
        location: e.location,
        price: Number(e.price),
        capacity: 10000,
        registeredCount: Math.floor(Math.random() * 500) + 100, // mock count
        organizerId: 'ticketmaster',
        organizer: {
            id: 'ticketmaster',
            name: 'Ticketmaster',
            email: 'support@ticketmaster.com',
            role: 'organizer',
            points: 0,
            badges: [],
            interests: [],
            createdAt: new Date(),
        },
        status: 'published',
        tags: [],
        popularityScore: Math.floor(Math.random() * 100),
        viewCount: Math.floor(Math.random() * 1000),
        eventSource: 'external',
        externalId: e.externalId,
        externalLink: e.externalLink,
        city: e.city,
        createdAt: e.fetchedAt,
        updatedAt: e.fetchedAt,
        badges: [],
    }));

    // Deduplication using a Map for O(N+M) performance
    const mergedMap = new Map<string, SmartEvent>();
    
    // Add internal events first (priority)
    smartInternal.forEach(event => {
        const key = `${event.title.toLowerCase()}-${new Date(event.date).toDateString()}`;
        mergedMap.set(key, event);
    });

    // Add external events only if not duplicate
    smartExternal.forEach(event => {
        const key = `${event.title.toLowerCase()}-${new Date(event.date).toDateString()}`;
        if (!mergedMap.has(key)) {
            mergedMap.set(key, event);
        }
    });

    return Array.from(mergedMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
