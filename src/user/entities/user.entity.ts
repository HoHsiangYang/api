import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class User {
  id: number;
  email: string;
  password: string;
}