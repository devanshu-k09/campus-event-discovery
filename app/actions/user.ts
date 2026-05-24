'use server';

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function getUserProfile(includeStats = true) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    try {
        return await prisma.user.findUnique({
            where: { id: session.user.id },
            include: includeStats ? {
                _count: {
                    select: {
                        events: true,
                        registrations: true,
                        reviews: true,
                    }
                }
            } : undefined
        });
    } catch (error) {
        console.error("Database error in getUserProfile:", error);
        // Fallback: return basic info if stats fail, or return null to trigger error UI
        return null;
    }
}

export async function updateUserProfile(data: {
    name?: string;
    bio?: string;
    location?: string;
    collegeName?: string;
    department?: string;
    year?: number;
    interests?: string[];
    image?: string | null;
    userType?: string;
    studentId?: string | null;
    organizationName?: string | null;
    designation?: string | null;
    employeeId?: string | null;
    graduationYear?: number | null;
    currentProfession?: string | null;
    organizerType?: string | null;
    officialEmail?: string | null;
    websiteOrInstagram?: string | null;
    companyName?: string | null;
    jobRole?: string | null;
    preferredCity?: string | null;
    interestedCategories?: string[];
    purpose?: string[];
    preferredEventTypes?: string[];
    profilePhoto?: string | null;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    const updatedData: any = { ...data };

    if (typeof updatedData.year === 'string') {
        const parsed = parseInt(updatedData.year);
        updatedData.year = isNaN(parsed) ? undefined : parsed;
    }
    if (typeof updatedData.graduationYear === 'string') {
        const parsed = parseInt(updatedData.graduationYear);
        updatedData.graduationYear = isNaN(parsed) ? null : parsed;
    }

    if (updatedData.interestedCategories) {
        updatedData.interests = updatedData.interestedCategories;
    } else if (updatedData.interests) {
        updatedData.interestedCategories = updatedData.interests;
    }

    if (updatedData.profilePhoto) {
        updatedData.image = updatedData.profilePhoto;
    } else if (updatedData.image) {
        updatedData.profilePhoto = updatedData.image;
    }

    // Role mapping: if userType changes to 'Event Organizer', update role to 'organizer', else 'student' (or leave admin alone)
    let roleUpdate = undefined;
    if (updatedData.userType) {
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });
        if (currentUser && currentUser.role !== 'admin') {
            roleUpdate = updatedData.userType === 'Event Organizer' ? 'organizer' : 'student';
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            ...updatedData,
            role: roleUpdate || undefined,
            interests: updatedData.interests || undefined,
            interestedCategories: updatedData.interestedCategories || undefined,
            purpose: updatedData.purpose || undefined,
            preferredEventTypes: updatedData.preferredEventTypes || undefined,
        }
    });

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return updatedUser;
}

export async function getUserDashboardData() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const [organizedEventsRaw, registrationsRaw, likedEventsRaw] = await Promise.all([
        prisma.event.findMany({
            where: { organizerId: session.user.id },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.registration.findMany({
            where: { userId: session.user.id },
            include: { event: true },
            orderBy: { registeredAt: 'desc' }
        }),
        prisma.like.findMany({
            where: { userId: session.user.id },
            include: {
                event: {
                    include: {
                        organizer: {
                            select: { id: true, name: true, image: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    const organizedEvents = organizedEventsRaw.map(event => ({
        ...event,
        price: Number(event.price),
        minPrice: event.minPrice ? Number(event.minPrice) : null,
        maxPrice: event.maxPrice ? Number(event.maxPrice) : null,
    }));

    const registrations = registrationsRaw.map(reg => ({
        ...reg,
        priceAtBooking: Number(reg.priceAtBooking),
        event: {
            ...reg.event,
            price: Number(reg.event.price),
            minPrice: reg.event.minPrice ? Number(reg.event.minPrice) : null,
            maxPrice: reg.event.maxPrice ? Number(reg.event.maxPrice) : null,
        }
    }));

    const likedEvents = likedEventsRaw.map(like => ({
        ...like.event,
        price: Number(like.event.price),
        minPrice: like.event.minPrice ? Number(like.event.minPrice) : null,
        maxPrice: like.event.maxPrice ? Number(like.event.maxPrice) : null,
        isLiked: true
    }));

    return {
        organizedEvents,
        registrations,
        likedEvents,
    };
}

export async function adminTerminateUser(userIdToTerminate: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Verify the caller is an admin
    const caller = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (caller?.role !== "admin") {
        return { success: false, error: "Forbidden: Admin access required" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userIdToTerminate },
            include: {
                events: {
                    include: {
                        registrations: true
                    }
                }
            }
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // Use a transaction to ensure all related data is safely handled
        await prisma.$transaction(async (tx) => {
            // Cancel all the user's tickets
            await tx.registration.updateMany({
                where: { userId: userIdToTerminate },
                data: { status: "cancelled" }
            });

            // Handle Hosted Events
            for (const event of user.events) {
                if (event.registrations.length === 0) {
                    // Fully delete event if no attendees
                    await tx.event.delete({ where: { id: event.id } });
                } else {
                    // Mark event as Host account deleted and cancel it
                    await tx.event.update({
                        where: { id: event.id },
                        data: {
                            title: `[Host Deleted] ${event.title}`,
                            status: "cancelled"
                        }
                    });
                }
            }

            // Delete sessions and OAuth accounts
            await tx.session.deleteMany({ where: { userId: userIdToTerminate } });
            await tx.account.deleteMany({ where: { userId: userIdToTerminate } });
            
            // Delete drafts
            await tx.event.deleteMany({ 
                where: { 
                    organizerId: userIdToTerminate,
                    status: "draft"
                } 
            });

            // Delete collaborator access
            await tx.eventCollaborator.deleteMany({ where: { userId: userIdToTerminate } });
            
            // Anonymize user instead of physical deletion to keep event history
            await tx.user.update({
                where: { id: userIdToTerminate },
                data: {
                    name: "Deleted User",
                    email: `deleted_${Date.now()}_${userIdToTerminate}@deleted.local`,
                    password: null,
                    image: null,
                    bio: null,
                    collegeName: null,
                    department: null,
                    year: null,
                    location: null,
                    interests: "[]",
                    role: "student"
                }
            });
        });

        revalidatePath('/admin/users');
        revalidatePath('/');
        return { success: true, message: "User successfully terminated" };
    } catch (error: any) {
        console.error("Admin user termination error:", error);
        return { success: false, error: error.message || "Failed to terminate user" };
    }
}

export async function toggleFollow(followingId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    if (session.user.id === followingId) return { success: false, error: "You cannot follow yourself" };

    try {
        // Validate that the follower user exists in the database
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true }
        });

        if (!currentUser) {
            return { success: false, error: "Stale session. Please log out and log in again." };
        }

        // Validate that the target organizer user exists in the database
        const targetUser = await prisma.user.findUnique({
            where: { id: followingId },
            select: { id: true }
        });

        if (!targetUser) {
            return { success: false, error: "Organizer not found" };
        }

        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId
                }
            }
        });

        if (existingFollow) {
            await prisma.follow.delete({
                where: { id: existingFollow.id }
            });
            return { success: true, isFollowing: false };
        } else {
            await prisma.follow.create({
                data: {
                    followerId: session.user.id,
                    followingId
                }
            });

            // Send notification
            try {
                await prisma.notification.create({
                    data: {
                        userId: followingId,
                        type: 'SYSTEM',
                        title: "New Follower! 🚀",
                        message: `${session.user.name || 'Someone'} started following you.`,
                        link: `/organizers/${session.user.id}`
                    }
                });
            } catch (notifyError) {
                console.error("Failed to send follow notification:", notifyError);
            }

            return { success: true, isFollowing: true };
        }
    } catch (error: any) {
        console.error("Toggle follow error:", error);
        if (error.code === 'P2003') {
            return { success: false, error: "Stale session. Please log out and log in again." };
        }
        return { success: false, error: "Failed to update follow status" };
    }
}

export async function getFollowStatus(followingId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { isFollowing: false };

    try {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId
                }
            }
        });
        return { isFollowing: !!follow };
    } catch (error) {
        return { isFollowing: false };
    }
}

export async function changePassword(data: { current: string, new: string }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user || !user.password) throw new Error("User not found");

    const isCorrect = await bcrypt.compare(data.current, user.password);
    if (!isCorrect) throw new Error("Incorrect current password");

    const hashed = await bcrypt.hash(data.new, 10);
    await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashed }
    });

    return { success: true };
}

export async function getActiveSessions() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    return await prisma.session.findMany({
        where: { userId: session.user.id },
        orderBy: { expires: 'desc' }
    });
}

export async function clearOtherSessions() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Get current session token from cookies
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('next-auth.session-token')?.value || 
                         cookieStore.get('__Secure-next-auth.session-token')?.value;

    if (!sessionToken) {
        // Fallback: clear all except the most recent one if token is not found in cookies
        const sessions = await prisma.session.findMany({
            where: { userId: session.user.id },
            orderBy: { expires: 'desc' }
        });
        
        if (sessions.length > 1) {
            await prisma.session.deleteMany({
                where: {
                    userId: session.user.id,
                    id: { not: sessions[0].id }
                }
            });
        }
    } else {
        await prisma.session.deleteMany({
            where: {
                userId: session.user.id,
                sessionToken: { not: sessionToken }
            }
        });
    }

    revalidatePath('/profile/edit');
    return { success: true };
}

