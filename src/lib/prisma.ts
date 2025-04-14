import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient(/* {
  log: ['query', 'info', 'warn', 'error'], // 'query' will log raw SQL
} */);
