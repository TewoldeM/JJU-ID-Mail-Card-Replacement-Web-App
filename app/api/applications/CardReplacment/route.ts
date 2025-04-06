import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ApplicationType } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function POST(req: NextRequest) {
  console.log("Received POST request to /api/applications/CardReplacment");

  const authHeader = req.headers.get("Authorization");
  console.log("Authorization Header:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No valid Authorization header found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extracted:", token);
  if (!token || token.trim() === "") {
    console.log("Token is empty or invalid");
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    let payload;
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
    console.log("Request body:", body);
    if (!body || typeof body !== "object") {
      console.log("Invalid request body:", body);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    let { Reason, applicationType, Collage, Department, Program } = body;
    if (!Reason || !applicationType) {
      console.log("Missing required fields: Reason or applicationType");
      return NextResponse.json(
        { error: "Reason and application type are required" },
        { status: 400 }
      );
    }

    let user;
    try {
      user = await prisma.user.findUnique({ where: { Id: userId } });
      if (!user) {
        console.log("User not found for ID:", userId);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      console.log("Authenticated user:", user);
    } catch (userError) {
      console.error("Error fetching user:", userError);
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
      console.error("Error validating student:", studentError);
      return NextResponse.json(
        { error: "Failed to validate student" },
        { status: 500 }
      );
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Check application limits per type
    let existingIdApplications, existingMailApplications;
    try {
      console.log("Checking application limits...");
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
      console.log(
        "Existing ID applications this month:",
        existingIdApplications
      );
      console.log(
        "Existing Mail applications this month:",
        existingMailApplications
      );
    } catch (countError) {
      console.error("Error checking application limits:", countError);
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
      console.log(
        `Student already submitted a ${applicationType} application this month`
      );
      return NextResponse.json(
        {
          error: `You can only submit one ${applicationType
            .replace("_", " ")
            .toLowerCase()} application per month.`,
        },
        { status: 403 }
      );
    }

    // Check if user has previous applications and auto-fill if applicable
    let hasPreviousApplications;
    try {
      console.log("Checking previous applications...");
      hasPreviousApplications =
        (await prisma.application.count({
          where: { StudentId: user.StudentId },
        })) > 0;
      console.log("Has previous applications:", hasPreviousApplications);
    } catch (prevAppsError) {
      console.error("Error checking previous applications:", prevAppsError);
      return NextResponse.json(
        { error: "Failed to check previous applications" },
        { status: 500 }
      );
    }

    if (hasPreviousApplications) {
      // If user has previous applications, enforce consistency with user data
      if (user.Collage && user.Department && user.Program) {
        Collage = user.Collage;
        Department = user.Department;
        Program = user.Program;
        console.log("Auto-filled from user data:", {
          Collage,
          Department,
          Program,
        });
      } else {
        // Fetch from the first application if user data isn’t updated yet
        const firstApplication = await prisma.application.findFirst({
          where: { StudentId: user.StudentId },
          select: { Collage: true, Department: true, Program: true },
        });
        if (firstApplication) {
          Collage = firstApplication.Collage;
          Department = firstApplication.Department;
          Program = firstApplication.Program;
          console.log("Auto-filled from previous application:", {
            Collage,
            Department,
            Program,
          });
        }
      }
    }

    // Validate required fields after potential auto-fill
    if (!Collage || !Department || !Program) {
      console.log("Missing required fields after auto-fill attempt");
      return NextResponse.json(
        { error: "Collage, Department, and Program are required" },
        { status: 400 }
      );
    }

    let application;
    try {
      console.log("Creating application...");
      application = await prisma.application.create({
        data: {
          StudentId: user.StudentId,
          applicationType: applicationType as ApplicationType,
          status: "PENDING",
          reason: Reason,
          Collage,
          Department,
          Program,
        },
      });
      console.log("Application created with ID:", application.id);
    } catch (createError: any) {
      console.error("Error creating application:", {
        message: createError.message,
        stack: createError.stack,
        code: createError.code,
        meta: createError.meta,
      });
      return NextResponse.json(
        {
          error: "Failed to create application",
          details: createError.message || "Unknown error",
        },
        { status: 500 }
      );
    }

    // Update user with Collage, Department, Program on first submission
    if (!hasPreviousApplications) {
      try {
        console.log("Updating user with Collage, Department, Program...");
        await prisma.user.update({
          where: { Id: userId },
          data: {
            Collage,
            Department,
            Program,
          },
        });
        console.log("User updated successfully");
      } catch (updateError) {
        console.error("Error updating user:", updateError);
        return NextResponse.json(
          { error: "Failed to update user data" },
          { status: 500 }
        );
      }
    }

    let notification;
    try {
      console.log("Creating notification...");
      notification = await prisma.notification.create({
        data: {
          StudentId: user.StudentId,
          message: `Your ${applicationType
            .replace("_", " ")
            .toLowerCase()} application has been submitted successfully.`,
          link: `/applicationsDetail/${application.id}/Detail`,
          read: false,
        },
      });
      console.log("Notification created with ID:", notification.id);
    } catch (notifyError: any) {
      console.error("Error creating notification:", {
        message: notifyError.message,
        stack: notifyError.stack,
        code: notifyError.code,
        meta: notifyError.meta,
      });
      return NextResponse.json(
        {
          error: "Failed to create notification",
          details: notifyError.message || "Unknown error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Application submitted successfully", id: application.id },
      { status: 201 }
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
