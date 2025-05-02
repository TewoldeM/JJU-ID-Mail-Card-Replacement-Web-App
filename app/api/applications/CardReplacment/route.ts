import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ApplicationType, FileCategory } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function POST(req: NextRequest) {
  console.log("Received POST request to /api/applications/CardReplacment");

  const token = req.cookies.get("token")?.value;
  if (!token) {
    console.log("No token found in cookie");
    return NextResponse.json(
      { error: "Unauthorized: No token found" },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    let payload: JWTPayload | undefined;
    try {
      const result = await jwtVerify(token, secret, { clockTolerance: 15 });
      payload = result.payload;
      console.log("Verified payload:", payload);
    } catch (jwtError: any) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!payload || typeof payload !== "object") {
      console.log("Payload is null or not an object:", payload);
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const userId = (payload as JWTPayload & { Id: string }).Id;
    if (!userId) {
      console.log("No userId in payload:", payload);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    let { Reason, applicationType, Collage, Department, Program, file } = body;
    if (!Reason || !applicationType || !file) {
      return NextResponse.json(
        { error: "Reason, application type, and file are required" },
        { status: 400 }
      );
    }

    if (
      !file.fileName ||
      !file.fileType ||
      !file.fileSize ||
      !file.fileData ||
      !file.fileType.startsWith("image/")
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid file data: must include name, type, size, and be an image",
        },
        { status: 400 }
      );
    }

    let user;
    try {
      user = await prisma.user.findUnique({ where: { Id: userId } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      console.log("Authenticated user:", user);
    } catch (userError) {
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 }
      );
    }

    let validStudent;
    try {
      validStudent = await prisma.validStudent.findFirst({
        where: {
          OR: [
            { StudentId: user.StudentId || "" },
            { FirstName: user.FirstName },
            { LastName: user.LastName },
            { Year: user.Year },
          ],
        },
      });
      if (!validStudent) {
        console.log("User is not a valid student at JJU");
        return NextResponse.json(
          { error: "You are not a valid student at JJU. Access denied." },
          { status: 403 }
        );
      }
      console.log("Validated student:", validStudent);
    } catch (studentError) {
      return NextResponse.json(
        { error: "Failed to validate student" },
        { status: 500 }
      );
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();

    let existingIdApplications, existingMailApplications;
    try {
      existingIdApplications = await prisma.application.count({
        where: {
          StudentId: user.StudentId,
          applicationType: "ID_CARD_REPLACEMENT",
          createdAt: {
            gte: new Date(currentYear, currentMonth, 1),
            lte: new Date(currentYear, currentMonth + 1, 0),
          },
        },
      });
      existingMailApplications = await prisma.application.count({
        where: {
          StudentId: user.StudentId,
          applicationType: "MAIL_CARD_REPLACEMENT",
          createdAt: {
            gte: new Date(currentYear, currentMonth, 1),
            lte: new Date(currentYear, currentMonth + 1, 0),
          },
        },
      });
    } catch (countError) {
      return NextResponse.json(
        { error: "Failed to check application limits" },
        { status: 500 }
      );
    }

    if (
      (applicationType === "ID_CARD_REPLACEMENT" &&
        existingIdApplications > 0) ||
      (applicationType === "MAIL_CARD_REPLACEMENT" &&
        existingMailApplications > 0)
    ) {
      return NextResponse.json(
        {
          error: `You can only submit one ${applicationType
            .replace("_", " ")
            .toLowerCase()} application per month.`,
        },
        { status: 403 }
      );
    }

    let hasPreviousApplications;
    try {
      hasPreviousApplications =
        (await prisma.application.count({
          where: { StudentId: user.StudentId },
        })) > 0;
    } catch (prevAppsError) {
      return NextResponse.json(
        { error: "Failed to check previous applications" },
        { status: 500 }
      );
    }

    if (hasPreviousApplications) {
      if (user.Collage && user.Department && user.Program) {
        Collage = user.Collage;
        Department = user.Department;
        Program = user.Program;
      } else {
        const firstApplication = await prisma.application.findFirst({
          where: { StudentId: user.StudentId },
          select: { Collage: true, Department: true, Program: true },
        });
        if (firstApplication) {
          Collage = firstApplication.Collage;
          Department = firstApplication.Department;
          Program = firstApplication.Program;
        }
      }
    }

    if (!Collage || !Department || !Program) {
      return NextResponse.json(
        { error: "Collage, Department, and Program are required" },
        { status: 400 }
      );
    }

    const verificationToken = randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // First transaction: Create PendingApplication and Application
    const [pendingApplication, application] = await prisma.$transaction([
      prisma.pendingApplication.create({
        data: {
          StudentId: user.StudentId,
          applicationType: applicationType as ApplicationType,
          reason: Reason,
          Collage,
          Department,
          Program,
          verificationToken,
          expiresAt,
        },
      }),
      prisma.application.create({
        data: {
          StudentId: user.StudentId,
          applicationType: applicationType as ApplicationType,
          status: "PENDING",
          reason: Reason,
          Collage,
          Department,
          Program,
        },
      }),
    ]);

    // Second transaction: Create File and update histories
    const [fileRecord] = await prisma.$transaction([
      prisma.file.create({
        data: {
          fileName: file.fileName,
          fileType: file.fileType,
          fileSize: file.fileSize,
          fileData: file.fileData,
          fileCategory: FileCategory.PHOTOGRAPH,
          applicationId: application.id,
          pendingApplicationId: pendingApplication.id,
        },
      }),
      prisma.monthlyHistory.upsert({
        where: {
          day_month_year: {
            day: currentDay,
            month: currentMonth,
            year: currentYear,
          },
        },
        update: {
          Total: { increment: 1 },
          Pending: { increment: 1 },
        },
        create: {
          year: currentYear,
          month: currentMonth,
          day: currentDay,
          Total: 1,
          Pending: 1,
          Accepted: 0,
          Rejected: 0,
          createdAt: now,
        },
      }),
      prisma.yearlyHistory.upsert({
        where: {
          month_year: {
            year: currentYear,
            month: currentMonth,
          },
        },
        update: {
          Total: { increment: 1 },
          Pending: { increment: 1 },
        },
        create: {
          year: currentYear,
          month: currentMonth,
          Total: 1,
          Pending: 1,
          Accepted: 0,
          Rejected: 0,
          createdAt: now,
        },
      }),
    ]);

    console.log(
      "Application created with ID:",
      application.id,
      "File ID:",
      fileRecord.id
    );

    const verificationLink = `${process.env.NEXT_PUBLIC_URL}/applications/Verify-application?token=${verificationToken}`;
    const emailResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/mail`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: validStudent.Email,
          FirstName: validStudent.FirstName,
          verificationLink,
        }),
      }
    );

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Failed to send email:", errorText);
      return NextResponse.json(
        { error: "Failed to send verification email", details: errorText },
        { status: 500 }
      );
    }

    if (!hasPreviousApplications) {
      try {
        console.log(
          "First application detected. Updating user with Collage, Department, Program..."
        );
        await prisma.user.update({
          where: { Id: userId },
          data: {
            Collage,
            Department,
            Program,
          },
        });
        console.log("User updated successfully with:", {
          Collage,
          Department,
          Program,
        });
      } catch (updateError) {
        console.error("Failed to update user:", updateError);
        return NextResponse.json(
          { error: "Failed to update user data" },
          { status: 500 }
        );
      }
    }

    try {
      console.log("Creating notification...");
      await prisma.notification.create({
        data: {
          StudentId: user.StudentId,
          message: `Your ${applicationType
            .replace("_", " ")
            .toLowerCase()} application has been submitted successfully. Please check your email to verify.`,
          link: `/applicationsDetail/${application.id}/Detail`,
          read: false,
        },
      });
      console.log("Notification created");
    } catch (notifyError: any) {
      return NextResponse.json(
        {
          error: "Failed to create notification",
          details: notifyError.message || "Unknown error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Application submitted, verification email sent",
        id: application.id,
        fileId: fileRecord.id,
      },
      { status: 202 }
    );
  } catch (error: any) {
    console.error("Unexpected error in API route:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
