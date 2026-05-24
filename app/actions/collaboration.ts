'use server';

import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function inviteCollaborator(eventId: string, email: string, role: 'CO_HOST' | 'MANAGER') {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        // Check if event exists and user is owner/organizer
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { organizerId: true }
        });

        if (!event) return { error: 'Event not found' };
        if (event.organizerId !== session.user.id) return { error: 'Only the event owner can invite collaborators' };

        // Find user by email
        const userToInvite = await prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });

        if (!userToInvite) return { error: 'User not found with this email' };
        if (userToInvite.id === session.user.id) return { error: 'You cannot invite yourself' };

        // Check if already a collaborator
        const existing = await prisma.eventCollaborator.findUnique({
            where: {
                eventId_userId: {
                    eventId,
                    userId: userToInvite.id
                }
            }
        });

        if (existing) return { error: 'User is already a collaborator or invited' };

        // Create invitation
        await prisma.eventCollaborator.create({
            data: {
                eventId,
                userId: userToInvite.id,
                role,
                status: 'INVITED'
            }
        });

        revalidatePath(`/edit-event/${eventId}`);
        
        // Log Activity
        await prisma.eventActivity.create({
            data: {
                eventId,
                userId: session.user.id,
                action: 'invited collaborator',
                details: `Invited ${email} as ${role}`
            }
        });

        // Notify invited user
        await prisma.notification.create({
            data: {
                userId: userToInvite.id,
                type: 'INVITATION',
                title: 'New Event Invitation',
                message: `You have been invited to collaborate on an event by ${session.user.name || session.user.email}.`,
                link: `/dashboard/invitations`
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Invite Error:', error);
        return { error: 'Failed to send invitation' };
    }
}

export async function updateCollaboratorRole(collaborationId: string, role: 'CO_HOST' | 'MANAGER') {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        const collab = await prisma.eventCollaborator.findUnique({
            where: { id: collaborationId },
            include: { event: true, user: true }
        });

        if (!collab) return { error: 'Collaborator not found' };
        if (collab.event.organizerId !== session.user.id) return { error: 'Unauthorized' };

        await prisma.eventCollaborator.update({
            where: { id: collaborationId },
            data: { role }
        });

        // Log Activity
        await prisma.eventActivity.create({
            data: {
                eventId: collab.eventId,
                userId: session.user.id,
                action: 'updated role',
                details: `Updated ${collab.user.email}'s role to ${role}`
            }
        });

        revalidatePath(`/edit-event/${collab.eventId}`);
        return { success: true };
    } catch (error) {
        console.error('Update Role Error:', error);
        return { error: 'Failed to update collaborator role' };
    }
}

export async function getTeamEvents() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        // Fetch events where user is owner OR collaborator
        const events = await prisma.event.findMany({
            where: {
                OR: [
                    { organizerId: session.user.id },
                    { 
                        collaborators: { 
                            some: { 
                                userId: session.user.id,
                                status: 'ACCEPTED'
                            } 
                        } 
                    }
                ]
            },
            include: {
                collaborators: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                                email: true
                            }
                        }
                    }
                },
                organizer: {
                    select: {
                        name: true,
                        image: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        registrations: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, events };
    } catch (error) {
        console.error('Get Team Events Error:', error);
        return { error: 'Failed to fetch team events' };
    }
}

export async function getCollaborators(eventId: string) {
    try {
        const collaborators = await prisma.eventCollaborator.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        });
        return { success: true, collaborators };
    } catch (error) {
        console.error('Get Collaborators Error:', error);
        return { error: 'Failed to fetch collaborators' };
    }
}

export async function respondToInvitation(collaborationId: string, status: 'ACCEPTED' | 'REJECTED') {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        const collab = await prisma.eventCollaborator.findUnique({
            where: { id: collaborationId }
        });

        if (!collab) return { error: 'Invitation not found' };
        if (collab.userId !== session.user.id) return { error: 'Unauthorized' };

        await prisma.eventCollaborator.update({
            where: { id: collaborationId },
            data: { status }
        });

        revalidatePath('/dashboard/invitations');
        return { success: true };
    } catch (error) {
        console.error('Respond Error:', error);
        return { error: 'Failed to respond to invitation' };
    }
}

export async function removeCollaborator(collaborationId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        const collab = await prisma.eventCollaborator.findUnique({
            where: { id: collaborationId },
            include: { event: true }
        });

        if (!collab) return { error: 'Collaborator not found' };

        // Only owner can remove others
        if (collab.event.organizerId !== session.user.id && collab.userId !== session.user.id) {
            return { error: 'Unauthorized' };
        }

        await prisma.eventCollaborator.delete({
            where: { id: collaborationId }
        });

        revalidatePath(`/edit-event/${collab.eventId}`);
        return { success: true };
    } catch (error) {
        console.error('Remove Error:', error);
        return { error: 'Failed to remove collaborator' };
    }
}

export async function getMyInvitations() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: 'Unauthorized' };

        const invitations = await prisma.eventCollaborator.findMany({
            where: {
                userId: session.user.id,
                status: 'INVITED'
            },
            include: {
                event: {
                    select: {
                        title: true,
                        image: true,
                        date: true,
                        location: true
                    }
                }
            }
        });

        return { success: true, invitations };
    } catch (error) {
        console.error('Get Invitations Error:', error);
        return { error: 'Failed to fetch invitations' };
    }
}
