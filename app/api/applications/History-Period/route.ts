import prisma from "@/app/lib/client";

export async function GET() {

  const period = await getHistoryPeriods();
  return Response.json(period);
}
export type GetHistoryPeriodResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods() {
  const result = await prisma.monthlyHistory.findMany({
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: [
      {
        year: "asc",
      },
    ],
  });
  const years = result.map((el) => el.year);
  if (years.length === 0) {
    return [new Date().getFullYear()];
  }
  return years;
}
//? The general logic behind select and distinct is to optimize the query and reduce the amount of data that needs to be transferred between the database and the application.

// Here are some general guidelines for using select and distinct:

// Use select to specify which fields should be included in the query results.
// Use distinct to remove duplicate values from the query results.
// Use select and distinct together to optimize the query and reduce the amount of data that needs to be transferred.
