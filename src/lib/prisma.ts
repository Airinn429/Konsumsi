import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // kalau mau tambah config bisa di sini
  });

if (process.env.DATABASE_URL !== 'production') globalForPrisma.prisma = prisma;
