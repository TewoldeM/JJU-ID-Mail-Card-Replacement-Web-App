import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RequestBody {
  status: "ACCEPTED" | "REJECTED";
  feedback?: string; // Optional feedback for rejection
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { status, feedback } = (await req.json()) as RequestBody;

  // Validate the status
  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'ACCEPTED' or 'REJECTED'." },
      { status: 400 }
    );
  }

  try {
    // Update the application
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: status as "ACCEPTED" | "REJECTED",
        resolvedAt: new Date(),
        feedback: status === "REJECTED" ? feedback || null : null, // Add feedback if rejected
        approvalCode:
          status === "ACCEPTED"
            ? `APPROVAL-${Math.random()
                .toString(36)
                .substr(2, 9)
                .toUpperCase()}`
            : null, // Generate code if accepted
      },
      include: { user: true }, // Include user to get StudentId
    });

    // Create notification for the student
    const student = updatedApplication.user;
    if (student) {
      await prisma.notification.create({
        data: {
          StudentId: student.StudentId, // 4-digit User.StudentId
          message: `Your ${
            updatedApplication.applicationType
          } request was ${status.toLowerCase()}${
            status === "REJECTED" && feedback ? `: ${feedback}` : ""
          }`,
          link: `/applicationsDetail/${id}/Detail`, // Adjust path as per your app
          applications: { connect: { id } },
        },
      });
    }

    return NextResponse.json(
      {
        message: `Application ${status.toLowerCase()} successfully`,
        application: updatedApplication,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
