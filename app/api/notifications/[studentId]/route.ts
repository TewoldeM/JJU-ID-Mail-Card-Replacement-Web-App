import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ StudentId: string }> } // Change to Promise
) {
  const resolvedParams = await params; // Await params
  const { StudentId } = resolvedParams;

  console.log("API called with StudentId:", StudentId);

  try {
    const notifications = await prisma.notification.findMany({
      where: { StudentId, read: false },
      orderBy: { createdAt: "desc" },
      include: { applications: true },
    });

    console.log("Notifications found:", notifications);
    return NextResponse.json(notifications, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
