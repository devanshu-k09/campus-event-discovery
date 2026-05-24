import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'devanshukukade694@gmail.com';
  const password = 'devanshu@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: {
        password: hashedPassword,
        role: 'student'
      },
      create: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: 'Devanshu Kukade',
        role: 'student',
        interests: []
      },
    });
    console.log('User created/updated:', user.email);
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
