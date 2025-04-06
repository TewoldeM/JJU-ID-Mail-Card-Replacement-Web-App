import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Run a raw SQL query
  const result = await prisma.$queryRaw`
    SELECT DISTINCT "StudentId"
    FROM "Application"
    WHERE "StudentId" NOT IN (SELECT "StudentId" FROM "User")
  `;

  console.log(result);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
