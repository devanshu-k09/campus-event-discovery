const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      image: true,
    }
  });
  const formatted = events.map(e => ({
    id: e.id,
    title: e.title,
    category: e.category,
    status: e.status,
    image: e.image ? (e.image.substring(0, 100) + '...') : null
  }));
  console.log(JSON.stringify(formatted, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
