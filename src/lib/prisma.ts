// src/lib/prisma.ts
// Use the generated Prisma client from the installed package
// (fall back to the local generated output is possible, but importing
// from '@prisma/client' is the standard approach and works with the
// default generator output)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
