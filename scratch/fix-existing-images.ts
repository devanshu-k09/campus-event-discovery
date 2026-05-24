import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      image: true,
    }
  });

  console.log(`Found ${events.length} events in total.`);

  const placeholder = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop';

  for (const event of events) {
    if (event.image && (event.image.startsWith('data:') || event.image.startsWith('/uploads/') || event.image.includes('localhost'))) {
      console.log(`Updating event "${event.title}" (${event.id}) image...`);
      await prisma.event.update({
        where: { id: event.id },
        data: { image: placeholder }
      });
    }
  }

  console.log('Finished updating existing event images.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
