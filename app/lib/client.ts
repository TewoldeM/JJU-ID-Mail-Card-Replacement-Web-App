import { PrismaClient } from "@prisma/client";

const globalFoPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalFoPrisma.prisma || new PrismaClient();
export default prisma;
if (process.env.NODE_ENV !== "production") globalFoPrisma.prisma = prisma;
