'use server';

import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function trackInteraction(
    action: 'click' | 'view' | 'book' | 'search' | 'bookmark',
    eventId?: string,
    category?: string,
    metadata: Record<string, any> = {}
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

        // For views and clicks, if the event exists, increment viewCount
        if (eventId && (action === 'view' || action === 'click')) {
            // Only update if it's an internal event
            try {
                await prisma.event.update({
                    where: { id: eventId },
                    data: { viewCount: { increment: 1 } }
                });
            } catch (e) {
                // Ignore if event not found (might be external)
            }
        }

        await prisma.userInteraction.create({
            data: {
                userId: session.user.id,
                action,
                eventId,
                category,
                metadata
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Error tracking interaction:', error);
        return { success: false, error: 'Failed to track interaction' };
    }
}
