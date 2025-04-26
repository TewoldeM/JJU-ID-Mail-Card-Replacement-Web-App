import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RequestBody {
  status: "ACCEPTED" | "REJECTED";
  feedback?: string;
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

  // Require feedback for rejection
  if (status === "REJECTED" && (!feedback || !feedback.trim())) {
    return NextResponse.json(
      { error: "Feedback is required for rejection." },
      { status: 400 }
    );
  }

  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    // Get the current application to check its previous status
    const currentApplication = await prisma.application.findUnique({
      where: { id },
    });

    if (!currentApplication) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    if (currentApplication.status === status) {
      return NextResponse.json(
        { message: "Application status unchanged" },
        { status: 200 }
      );
    }

    // Generate approvalCode for accepted applications
    const approvalCode =
      status === "ACCEPTED"
        ? `APPROVAL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        : null;

    // Determine history updates based on status transition
    const historyUpdates: {
      Pending?: { increment: number };
      Accepted?: { increment: number };
      Rejected?: { increment: number };
    } = {};

    if (currentApplication.status === "PENDING") {
      historyUpdates.Pending = { increment: -1 };
    }
    if (status === "ACCEPTED") {
      historyUpdates.Accepted = { increment: 1 };
    } else if (status === "REJECTED") {
      historyUpdates.Rejected = { increment: 1 };
    }

    // Update application and history in a transaction
    const [updatedApplication] = await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: {
          status: status as "ACCEPTED" | "REJECTED",
          resolvedAt: now,
          feedback: feedback || null,
          approvalCode,
        },
        include: { user: true },
      }),
      prisma.monthlyHistory.upsert({
        where: { day_month_year: { day, month, year } }, // Fixed to use day_month_year
        update: historyUpdates,
        create: {
          year,
          month,
          day,
          Total: 0,
          Pending: 0,
          Accepted: status === "ACCEPTED" ? 1 : 0,
          Rejected: status === "REJECTED" ? 1 : 0,
          createdAt: now,
        },
      }),
      prisma.yearlyHistory.upsert({
        where: { month_year: { month, year } }, // Fixed to use month_year
        update: historyUpdates,
        create: {
          year,
          month,
          Total: 0,
          Pending: 0,
          Accepted: status === "ACCEPTED" ? 1 : 0,
          Rejected: status === "REJECTED" ? 1 : 0,
          createdAt: now,
        },
      }),
    ]);

    // Create notification for the student
    const student = updatedApplication.user;
    if (student) {
      const notificationMessage =
        status === "ACCEPTED"
          ? `Your ${updatedApplication.applicationType} request was accepted${
              feedback ? `: ${feedback}` : ""
            }${approvalCode ? `. Approval Code: ${approvalCode}` : ""}`
          : `Your ${updatedApplication.applicationType} request was rejected: ${feedback}`;

      await prisma.notification.create({
        data: {
          StudentId: student.StudentId,
          message: notificationMessage,
          link: `/applicationsDetail/${id}/Detail`,
          read: false,
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
