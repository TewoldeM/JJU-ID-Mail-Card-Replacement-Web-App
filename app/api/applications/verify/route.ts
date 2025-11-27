import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Import shared Prisma client

export async function GET(req: NextRequest) {
  try {
    // Extract token from query parameters
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Find pending application by verification token
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

    // Create new application
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

    // Update file to associate with the new application
    if (pendingApp.files.length > 0) {
      await prisma.file.update({
        where: { id: pendingApp.files[0].id },
        data: {
          applicationId: application.id,
          pendingApplicationId: null, // Clear pending association
        },
      });
    }

    // Create notification
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

    // Delete pending application
    await prisma.pendingApplication.delete({ where: { id: pendingApp.id } });

    // Redirect to a success page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/applications/success`
    );

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error"},
      { status: 500 }
    );
  }
}
