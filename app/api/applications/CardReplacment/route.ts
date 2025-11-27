
//allow 5 per month for ID_CARD_REPLACEMENT and MAIL_CARD_REPLACEMENT
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ApplicationType, FileCategory } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";
import { randomBytes } from "crypto";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
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
    } catch (errors) {
      return NextResponse.json(
        { error: "Invalid or expired token",errors},
        { status: 401 }
      );
    }

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const userId = (payload as JWTPayload & { Id: string }).Id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    let {Collage, Department, Program,} = body;
    const { Reason,applicationType,file } = body;
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
    } catch (errors) {
      return NextResponse.json(
        { error: "Failed to fetch user", errors },
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
        return NextResponse.json(
          { error: "Your data was not found in the JJU student list." },
          { status: 403 }
        );
      }
    } catch (errors) {
      return NextResponse.json(
        { error: "Failed to validate student", errors },
        { status: 500 }
      );
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

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
    } catch (errors) {
      return NextResponse.json(
        { error: "Failed to check application limits", errors },
        { status: 500 }
      );
    }

    if (
      (applicationType === "ID_CARD_REPLACEMENT" &&
        existingIdApplications >= 5) ||
      (applicationType === "MAIL_CARD_REPLACEMENT" &&
        existingMailApplications >= 5)
    ) {
      return NextResponse.json(
        {
          error: `You can only submit up to 5 ${applicationType
            .replace("_", " ")
            .toLowerCase()} applications per month.`,
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
    } catch (errors) {
      return NextResponse.json(
        { error: "Failed to check previous applications", errors },
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

    const verificationToken = randomBytes(8).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const pendingApplication = await prisma.pendingApplication.create({
      data: {
        StudentId: user.StudentId,
        applicationType: applicationType as ApplicationType,
        reason: Reason,
        Collage,
        Department,
        Program,
        verificationToken,
        expiresAt,
        fileName: file.fileName,
        fileType: file.fileType,
        fileSize: file.fileSize,
        fileData: file.fileData,
      },
    });

    const verificationLink = `${process.env.NEXT_PUBLIC_URL}/api/applications/verify?token=${verificationToken}`;
    const emailResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/mail`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.Email,
          FirstName: user.FirstName,
          verificationLink,
        }),
      }
    );

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      return NextResponse.json(
        { error: "Failed to send verification email", details: errorText },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Verification email sent",
        pendingApplicationId: pendingApplication.id,
      },
      { status: 202 }
    );
  } catch (errors) {
    return NextResponse.json(
      {
        error: "Internal server error",errors
       
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json(
      { error: "Verification token is required" },
      { status: 400 }
    );
  }

  try {
    const pendingApplication = await prisma.pendingApplication.findFirst({
      where: { verificationToken: token },
    });

    if (!pendingApplication) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    if (pendingApplication.expiresAt < new Date()) {
      await prisma.pendingApplication.delete({
        where: { id: pendingApplication.id },
      });
      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();

    const [application, fileRecord] = await prisma.$transaction([
      prisma.application.create({
        data: {
          StudentId: pendingApplication.StudentId,
          applicationType: pendingApplication.applicationType,
          status: "PENDING",
          reason: pendingApplication.reason,
          Collage: pendingApplication.Collage,
          Department: pendingApplication.Department,
          Program: pendingApplication.Program,
        },
      }),
      prisma.file.create({
        data: {
          fileName: pendingApplication.fileName!,
          fileType: pendingApplication.fileType!,
          fileSize: pendingApplication.fileSize!,
          fileData: pendingApplication.fileData!,
          fileCategory: FileCategory.PHOTOGRAPH,
          applicationId: undefined,
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

    await prisma.file.update({
      where: { id: fileRecord.id },
      data: { applicationId: application.id },
    });

    const hasPreviousApplications =
      (await prisma.application.count({
        where: { StudentId: pendingApplication.StudentId },
      })) > 0;

    if (!hasPreviousApplications) {
      try {
        await prisma.user.update({
          where: { StudentId: pendingApplication.StudentId },
          data: {
            Collage: pendingApplication.Collage,
            Department: pendingApplication.Department,
            Program: pendingApplication.Program,
          },
        });
      } catch (errors) {
        return NextResponse.json(
          { error: "Failed to update user data", errors },
          { status: 500 }
        );
      }
    }

    try {
      await prisma.notification.create({
        data: {
          StudentId: pendingApplication.StudentId,
          message: `Your ${pendingApplication.applicationType
            .replace("_", " ")
            .toLowerCase()} application has been submitted successfully.`,
          link: `/applicationsDetail/${application.id}/Detail`,
          read: false,
        },
      });
    } catch (errors) {
      return NextResponse.json(
        {
          error: "Failed to create notification",
          errors,
        },
        { status: 500 }
      );
    }

    await prisma.pendingApplication.delete({
      where: { id: pendingApplication.id },
    });

    return NextResponse.json(
      {
        message: "Application verified and submitted successfully",
        id: application.id,
        fileId: fileRecord.id,
      },
      { status: 200 }
    );
  } catch{
    return NextResponse.json(
      {
        error: "Internal server error during verification",
        details:"Unknown error(verification Error message)",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}