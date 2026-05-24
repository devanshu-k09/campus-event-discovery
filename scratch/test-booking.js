const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testBooking() {
  try {
    const event = await prisma.event.findFirst();
    const user = await prisma.user.findFirst();

    if (!event || !user) {
      console.log('No event or user found.');
      return;
    }

    console.log(`Booking for Event: ${event.title}`);
    console.log(`User: ${user.name} (${user.email})`);

    const registration = await prisma.registration.create({
      data: {
        eventId: event.id,
        userId: user.id,
        status: event.requiresApproval ? 'waitlist' : 'registered',
        ticketCount: 1,
        priceAtBooking: event.price,
      },
    });

    console.log('Booking successful:', registration);
  } catch (error) {
    console.error('Booking failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBooking();
