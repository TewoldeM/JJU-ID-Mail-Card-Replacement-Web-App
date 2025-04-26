import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token)
    return NextResponse.json({ error: "Token required" }, { status: 400 });

  const pendingApp = await prisma.pendingApplication.findUnique({
    where: { verificationToken: token },
  });

  if (!pendingApp || new Date() > pendingApp.expiresAt) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  // Submit the application
  const application = await prisma.application.create({
    data: {
      StudentId: pendingApp.StudentId,
      applicationType: pendingApp.applicationType,
      status: "PENDING",
      reason: pendingApp.reason,
      Collage: pendingApp.Collage,
      Department: pendingApp.Department,
      Program: pendingApp.Program,
    },
  });

  // Send notification
  await prisma.notification.create({
    data: {
      StudentId: pendingApp.StudentId,
      message: `Your ${pendingApp.applicationType
        .replace("_", " ")
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(
          " "
        )} application has been successfully submitted. It is currently pending review by an administrator. Please wait for further updates.`,
      link: `/applicationsDetail/${application.id}/Detail`,
      read: false,
    },
  });

  // Clean up pending application
  await prisma.pendingApplication.delete({ where: { id: pendingApp.id } });

  return NextResponse.json(
    { message: "Application submitted successfully", id: application.id },
    { status: 201 }
  );
}
