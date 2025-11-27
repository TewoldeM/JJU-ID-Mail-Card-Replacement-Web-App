import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ StudentId: string }> }
) {
  const resolvedParams = await params;
  const { StudentId } = resolvedParams;

  if (!StudentId) {
    return NextResponse.json(
      { error: "StudentId is required" },
      { status: 400 }
    );
  }

  console.log("Notifications API - Fetching for StudentId:", StudentId);

  try {
    const notifications = await prisma.notification.findMany({
      where: { StudentId, read: false },
      orderBy: { createdAt: "desc" },
      include: { applications: true },
    });

    console.log("Notifications API - Fetched notifications:", notifications);

    return NextResponse.json(notifications, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
