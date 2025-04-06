import { OverviewQuerySchema } from "@/schema/Overview";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/client";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) {
    return NextResponse.json(
      { error: queryParams.error.message },
      { status: 400 }
    );
  }

  const applicationsProgress = await getApplicationProgress(
    queryParams.data.from,
    queryParams.data.to
  );

  return NextResponse.json(applicationsProgress);
}

export type GetApplicationsProgressResponseType = Awaited<
  ReturnType<typeof getApplicationProgress>
>;

async function getApplicationProgress(from: Date, to: Date) {
  // Fetch counts for accepted, rejected, and total applications (no userId filter)
  const acceptedCount = await prisma.application.count({
    where: {
      status: "ACCEPTED",
      createdAt: {
        gte: from,
        lte: to,
      },
    },
  });

  const rejectedCount = await prisma.application.count({
    where: {
      status: "REJECTED",
      createdAt: {
        gte: from,
        lte: to,
      },
    },
  });

  const totalCount = await prisma.application.count({
    where: {
      createdAt: {
        gte: from,
        lte: to,
      },
    },
  });

  // Calculate percentages
  const acceptedPercentage =
    totalCount > 0 ? (acceptedCount / totalCount) * 100 : 0;
  const rejectedPercentage =
    totalCount > 0 ? (rejectedCount / totalCount) * 100 : 0;

  return {
    acceptedPercentage: Math.round(acceptedPercentage),
    rejectedPercentage: Math.round(rejectedPercentage),
  };
}
