import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  try {
    const pendingApp = await prisma.pendingApplication.findUnique({
      where: { verificationToken: token },
      include: { files: true },
    });

    if (!pendingApp || new Date() > pendingApp.expiresAt) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

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

    // Update File to associate with the new Application
    if (pendingApp.files.length > 0) {
      await prisma.file.update({
        where: { id: pendingApp.files[0].id },
        data: {
          applicationId: application.id,
          pendingApplicationId: null, // Clear pending association
        },
      });
    }

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

    await prisma.pendingApplication.delete({ where: { id: pendingApp.id } });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        id: application.id,
        fileId: pendingApp.files.length > 0 ? pendingApp.files[0].id : null,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
