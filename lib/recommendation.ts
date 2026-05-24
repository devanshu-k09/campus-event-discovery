import { prisma } from './db';
import { SmartEvent } from '@/types';
import { subHours, subDays } from 'date-fns';

const WEIGHTS = {
    CATEGORY_MATCH: 40,
    POPULARITY: 30,
    RECENCY: 20,
    PROXIMITY: 10,
};

// Aggregate user interactions into category preferences
export async function getUserPreferences(userId: string): Promise<Record<string, number>> {
    const interactions = await prisma.userInteraction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100 // Look at last 100 interactions
    });

    const categoryScores: Record<string, number> = {};

    interactions.forEach(interaction => {
        if (!interaction.category) return;
        
        const cat = interaction.category;
        const weight = getActionWeight(interaction.action);
        
        // Decay factor based on time (older interactions count less)
        const ageInDays = (new Date().getTime() - interaction.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        const decay = Math.max(0.1, 1 - (ageInDays * 0.05)); // Decay over 20 days
        
        categoryScores[cat] = (categoryScores[cat] || 0) + (weight * decay);
    });

    // Normalize scores
    const maxScore = Math.max(...Object.values(categoryScores), 1);
    const normalized: Record<string, number> = {};
    for (const [cat, score] of Object.entries(categoryScores)) {
        normalized[cat] = score / maxScore;
    }

    return normalized;
}

function getActionWeight(action: string): number {
    switch (action) {
        case 'book': return 10;
        case 'bookmark': return 5;
        case 'search': return 3;
        case 'click': return 2;
        case 'view': return 1;
        default: return 1;
    }
}

// Main recommendation scoring
export function scoreAndRankEvents(events: SmartEvent[], userPreferences: Record<string, number>, userCity?: string): SmartEvent[] {
    const scoredEvents = events.map(event => {
        let score = 0;

        // 1. Category Match (0-40)
        const catAffinity = userPreferences[event.category] || 0;
        score += catAffinity * WEIGHTS.CATEGORY_MATCH;

        // 2. Popularity (0-30)
        // Normalize popularity based on an assumed max of 1000 views
        const normalizedPopularity = Math.min((event.viewCount || 0) / 1000, 1);
        score += normalizedPopularity * WEIGHTS.POPULARITY;

        // 3. Recency (0-20)
        // Events created recently get higher score
        const ageInDays = (new Date().getTime() - new Date(event.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        const recencyFactor = Math.max(0, 1 - (ageInDays / 30)); // 30 day window
        score += recencyFactor * WEIGHTS.RECENCY;

        // 4. Proximity (0-10)
        if (userCity && event.city && userCity.toLowerCase() === event.city.toLowerCase()) {
            score += WEIGHTS.PROXIMITY;
        }

        return {
            ...event,
            relevanceScore: score
        };
    });

    return scoredEvents.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}

// Get global trending events (based on interactions in last 48 hours)
export async function getTrendingEventIds(limit: number = 10): Promise<string[]> {
    const fortyEightHoursAgo = subHours(new Date(), 48);

    const interactions = await prisma.userInteraction.groupBy({
        by: ['eventId'],
        where: {
            createdAt: { gte: fortyEightHoursAgo },
            eventId: { not: null }
        },
        _count: {
            action: true
        },
        orderBy: {
            _count: { action: 'desc' }
        },
        take: limit
    });

    return interactions
        .map(i => i.eventId)
        .filter((id): id is string => id !== null);
}

// Get popular this week
export async function getPopularThisWeekEventIds(limit: number = 10): Promise<string[]> {
    const oneWeekAgo = subDays(new Date(), 7);

    const interactions = await prisma.userInteraction.groupBy({
        by: ['eventId'],
        where: {
            createdAt: { gte: oneWeekAgo },
            action: { in: ['book', 'bookmark'] },
            eventId: { not: null }
        },
        _count: {
            action: true
        },
        orderBy: {
            _count: { action: 'desc' }
        },
        take: limit
    });

    return interactions
        .map(i => i.eventId)
        .filter((id): id is string => id !== null);
}
