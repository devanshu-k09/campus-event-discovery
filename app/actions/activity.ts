'use server';

import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function logEventActivity(eventId: string, action: string, details?: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        await prisma.eventActivity.create({
            data: {
                eventId,
                userId: session.user.id,
                action,
                details
            }
        });

        revalidatePath(`/team-dashboard/events/${eventId}`);
        return { success: true };
    } catch (error) {
        console.error('Log Activity Error:', error);
        return { error: 'Failed to log activity' };
    }
}

export async function getEventActivity(eventId: string) {
    try {
        const activities = await prisma.eventActivity.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return { success: true, activities };
    } catch (error) {
        console.error('Get Activity Error:', error);
        return { error: 'Failed to fetch activity' };
    }
}

export async function getTeamActivity() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        // Get activities for all events where user is a collaborator or owner
        const activities = await prisma.eventActivity.findMany({
            where: {
                event: {
                    OR: [
                        { organizerId: session.user.id },
                        { collaborators: { some: { userId: session.user.id } } }
                    ]
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                },
                event: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 30
        });

        return { success: true, activities };
    } catch (error) {
        console.error('Get Team Activity Error:', error);
        return { error: 'Failed to fetch team activity' };
    }
}
