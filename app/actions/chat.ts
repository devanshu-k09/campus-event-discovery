'use server';

import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher-server';

export async function sendChatMessage(eventId: string, message: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        // 1. Check if user is registered or is part of the team
        const registration = await prisma.registration.findUnique({
            where: {
                userId_eventId: {
                    userId: session.user.id,
                    eventId
                }
            }
        });

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { collaborators: true }
        });

        const isCollaborator = event?.collaborators.some(c => c.userId === session.user.id) || event?.organizerId === session.user.id;

        if (!registration && !isCollaborator) {
            return { error: 'You must be registered for this event to chat.' };
        }

        // 2. Create message in DB
        const chatMessage = await prisma.chatMessage.create({
            data: {
                eventId,
                userId: session.user.id,
                message,
                type: 'TEXT'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        email: true
                    }
                }
            }
        });

        // 3. Trigger Pusher event
        if (pusherServer) {
            try {
                await pusherServer.trigger(`event-chat-${eventId}`, 'new-message', {
                    ...chatMessage,
                    createdAt: chatMessage.createdAt.toISOString()
                });
            } catch (pusherError) {
                console.error('Pusher trigger failed:', pusherError);
                // Do not fail the whole request if only real-time broadcast fails
            }
        }

        return { success: true, message: chatMessage };
    } catch (error: any) {
        console.error('Send Chat Message Error:', error);
        return { error: error.message || 'Failed to send message' };
    }
}

export async function getChatMessages(eventId: string) {
    try {
        const messages = await prisma.chatMessage.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' },
            take: 50 // Limit to last 50 messages for initial load
        });

        return { success: true, messages };
    } catch (error) {
        console.error('Get Chat Messages Error:', error);
        return { error: 'Failed to fetch chat history' };
    }
}

export async function deleteChatMessage(messageId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        const message = await prisma.chatMessage.findUnique({
            where: { id: messageId },
            include: { event: true }
        });

        if (!message) return { error: 'Message not found' };

        // Only host or message sender can delete
        const isOwner = message.event.organizerId === session.user.id;
        if (!isOwner && message.userId !== session.user.id) {
            return { error: 'Unauthorized to delete this message' };
        }

        await prisma.chatMessage.delete({
            where: { id: messageId }
        });

        // Trigger Pusher event for deletion
        if (pusherServer) {
            try {
                await pusherServer.trigger(`event-chat-${message.eventId}`, 'delete-message', {
                    messageId
                });
            } catch (pusherError) {
                console.error('Pusher delete trigger failed:', pusherError);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error('Delete Chat Message Error:', error);
        return { error: error.message || 'Failed to delete message' };
    }
}
