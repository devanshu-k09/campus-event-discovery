const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const externalEvents = await prisma.externalEventCache.findMany({
    select: {
      id: true,
      title: true,
      category: true,
    }
  });
  console.log(JSON.stringify(externalEvents, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
