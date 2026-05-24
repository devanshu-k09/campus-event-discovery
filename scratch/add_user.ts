import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Sanika@123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'sanikajirapure98@gmail.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      name: 'Sanika',
      email: 'sanikajirapure98@gmail.com',
      password: hashedPassword,
      collegeName: 'Mumbai University',
      role: 'student',
      interests: [],
    },
  });

  console.log('✅ User created/updated:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
