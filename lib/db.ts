import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
    console.warn("⚠️ DATABASE_URL is not set. Prisma Client may fail to connect.");
    // Add dummy fallback for build time if needed, but warning is usually enough
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
