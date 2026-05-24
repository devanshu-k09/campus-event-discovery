import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail, getAccountDeletionEmailTemplate } from "@/lib/mail";
import { revalidatePath } from "next/cache";

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                events: {
                    include: {
                        registrations: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Send email before scrambling the email address
        await sendEmail({
            to: user.email,
            subject: "Account Successfully Deleted",
            html: getAccountDeletionEmailTemplate({ userName: user.name || "User" })
        });

        // Use a transaction to ensure all related data is safely handled
        await prisma.$transaction(async (tx) => {
            // Cancel all the user's tickets
            await tx.registration.updateMany({
                where: { userId: userId },
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
            await tx.session.deleteMany({ where: { userId: userId } });
            await tx.account.deleteMany({ where: { userId: userId } });
            
            // Delete drafts
            await tx.event.deleteMany({ 
                where: { 
                    organizerId: userId,
                    status: "draft"
                } 
            });

            // Delete collaborator access
            await tx.eventCollaborator.deleteMany({ where: { userId: userId } });
            
            // Anonymize user instead of physical deletion to keep event history
            await tx.user.update({
                where: { id: userId },
                data: {
                    name: "Deleted User",
                    email: `deleted_${Date.now()}_${userId}@deleted.local`,
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

        revalidatePath('/');
        revalidatePath('/events');
        revalidatePath('/dashboard');

        return NextResponse.json({ message: "Account permanently deleted" }, { status: 200 });
    } catch (error) {
        console.error("Account deletion error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
