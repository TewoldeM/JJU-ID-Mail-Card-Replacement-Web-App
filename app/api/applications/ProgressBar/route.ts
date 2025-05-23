import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { error: "From and to dates are required" },
      { status: 400 }
    );
  }

  try {
    // Fetch counts for accepted, rejected, and total applications
    const acceptedCount = await prisma.application.count({
      where: {
        status: "ACCEPTED",
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
    });

    const rejectedCount = await prisma.application.count({
      where: {
        status: "REJECTED",
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
    });

    const totalCount = await prisma.application.count({
      where: {
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
    });

    return NextResponse.json(
      { accepted: acceptedCount, rejected: rejectedCount, total: totalCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching application progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch application progress" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
