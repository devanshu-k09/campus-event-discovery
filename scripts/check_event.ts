import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const event = await prisma.event.findUnique({
        where: { id: 'cmopcyke3000bx1xzb0r4t0vx' }
    });
    console.log(JSON.stringify(event, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
