const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const events = await prisma.externalEventCache.findMany();
  console.log(JSON.stringify(events.map(e => ({id: e.id, title: e.title, category: e.category})), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
