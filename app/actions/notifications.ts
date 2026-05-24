'use server';

import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        const notifications = await prisma.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return { success: true, notifications };
    } catch (error) {
        console.error('Get Notifications Error:', error);
        return { error: 'Failed to fetch notifications' };
    }
}

export async function markAsRead(notificationId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        await prisma.notification.update({
            where: { 
                id: notificationId,
                userId: session.user.id 
            },
            data: { isRead: true }
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Mark Read Error:', error);
        return { error: 'Failed to update notification' };
    }
}

export async function markAllAsRead() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        await prisma.notification.updateMany({
            where: { userId: session.user.id, isRead: false },
            data: { isRead: true }
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Mark All Read Error:', error);
        return { error: 'Failed to update notifications' };
    }
}

export async function createNotification(userId: string, data: {
    type: 'INVITATION' | 'EVENT_UPDATE' | 'REGISTRATION' | 'MESSAGE' | 'SYSTEM';
    title: string;
    message: string;
    link?: string;
}) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                ...data
            }
        });

        return { success: true, notification };
    } catch (error) {
        console.error('Create Notification Error:', error);
        return { error: 'Failed to create notification' };
    }
}
