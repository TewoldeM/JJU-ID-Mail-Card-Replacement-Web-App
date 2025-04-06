import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
interface notifactionsType {
  StudentId: string;
  message: string;
  link?: string;
  applicationId?: string;
}
export async function POST(req: Request) {
  const { StudentId, message, link, applicationId } =
    (await req.json()) as notifactionsType;

  const notification = await prisma.notification.create({
    data: {
      StudentId, // 4-digit User.StudentId
      message,
      link: link || null,
      applications: applicationId
        ? { connect: { id: applicationId } }
        : undefined,
    },
  });

  return NextResponse.json(notification, { status: 201 });
}
