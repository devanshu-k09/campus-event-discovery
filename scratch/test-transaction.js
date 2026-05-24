require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTransaction(userIdToTerminate) {
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
            console.log("User not found");
            return;
        }

        await prisma.$transaction(async (tx) => {
            await tx.registration.updateMany({
                where: { userId: userIdToTerminate },
                data: { status: "cancelled" }
            });

            for (const event of user.events) {
                if (event.registrations.length === 0) {
                    await tx.event.delete({ where: { id: event.id } });
                } else {
                    await tx.event.update({
                        where: { id: event.id },
                        data: {
                            title: `[Host Deleted] ${event.title}`,
                            status: "cancelled"
                        }
                    });
                }
            }

            await tx.session.deleteMany({ where: { userId: userIdToTerminate } });
            await tx.account.deleteMany({ where: { userId: userIdToTerminate } });
            
            await tx.event.deleteMany({ 
                where: { 
                    organizerId: userIdToTerminate,
                    status: "draft"
                } 
            });

            await tx.eventCollaborator.deleteMany({ where: { userId: userIdToTerminate } });
            
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
        console.log("Transaction succeeded!");
    } catch (e) {
        console.error("Transaction failed:", e);
    }
}

testTransaction('cmoqrudjf0000jsmfm7vkpwh3').finally(() => prisma.$disconnect());
