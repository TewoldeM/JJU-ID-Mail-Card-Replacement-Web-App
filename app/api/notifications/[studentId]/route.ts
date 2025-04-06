import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request,
  { params }: { params: { StudentId: string } }
) {
  const { StudentId } = params;

  const notifications = await prisma.notification.findMany({
    where: { StudentId, read: false },
    orderBy: { createdAt: "desc" },
    include: { applications: true },
  });

  return NextResponse.json(notifications, { status: 200 });
}
