import { SmartEvent, EventBadge } from '@/types';
import { differenceInHours } from 'date-fns';

export function computeBadges(event: Partial<SmartEvent>, isRecommended: boolean = false): EventBadge[] {
    const badges: Set<EventBadge> = new Set();

    // 1. Live Event (External API sourced)
    if (event.eventSource === 'external') {
        badges.add('Live Event');
    }

    // 2. AI Pick
    if (isRecommended) {
        badges.add('AI Pick');
    }

    // 3. Trending
    if ((event.popularityScore || 0) > 80 || (event.viewCount || 0) > 500) {
        badges.add('Trending');
    }

    // 4. Featured
    if ((event as any).isFeatured) {
        badges.add('Featured');
    }

    // 5. New
    if (event.createdAt) {
        const hoursSinceCreation = differenceInHours(new Date(), new Date(event.createdAt));
        if (hoursSinceCreation <= 48) {
            badges.add('New');
        }
    }

    // 6. Selling Fast
    if (event.capacity && event.registeredCount) {
        const fillPercentage = event.registeredCount / event.capacity;
        if (fillPercentage > 0.8 && fillPercentage < 1.0) {
            badges.add('Selling Fast');
        }
    }

    return Array.from(badges);
}
