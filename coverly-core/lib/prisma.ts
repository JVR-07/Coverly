import { PrismaClient } from "../app/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const getConnection = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool as any);
  return new PrismaClient({ adapter });
};

export const prisma = getConnection();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
