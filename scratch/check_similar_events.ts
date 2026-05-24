import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany({
    where: { status: 'published' }
  });
  console.log('All Published Events:');
  console.log(events.map(e => ({ id: e.id, title: e.title, category: e.category })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
