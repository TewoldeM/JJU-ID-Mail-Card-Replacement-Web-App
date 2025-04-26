import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  // Seed MonthlyHistory for March 2025
  await prisma.monthlyHistory.createMany({
    data: [
      {
        year: 2025,
        month: 3,
        day: 1,
        Total: 15, // Accepted + Rejected
        Pending: 0,
        Accepted: 10,
        Rejected: 5,
        createdAt: new Date(),
      },
      {
        year: 2025,
        month: 3,
        day: 2,
        Total: 11,
        Pending: 0,
        Accepted: 8,
        Rejected: 3,
        createdAt: new Date(),
      },
      {
        year: 2025,
        month: 3,
        day: 3,
        Total: 22,
        Pending: 0,
        Accepted: 15,
        Rejected: 7,
        createdAt: new Date(),
      },
    ],
  });

  // Seed YearlyHistory for 2025
  await prisma.yearlyHistory.createMany({
    data: [
      {
        year: 2025,
        month: 2, // February
        Total: 30,
        Pending: 0,
        Accepted: 20,
        Rejected: 10,
        createdAt: new Date(),
      },
      {
        year: 2025,
        month: 3, // March
        Total: 48,
        Pending: 0,
        Accepted: 33,
        Rejected: 15,
        createdAt: new Date(),
      },
    ],
  });

  console.log("Seeded history data");
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
