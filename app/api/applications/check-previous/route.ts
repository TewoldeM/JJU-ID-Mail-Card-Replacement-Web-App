import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function GET(req: NextRequest) {
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
    let payload;
    try {
      const result = await jwtVerify(token, secret, { clockTolerance: 15 });
      payload = result.payload;
    } catch (jwtError: any) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!payload || typeof payload !== "object") {
      console.log("Payload is null or not an object:");
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const userId = (payload as JWTPayload & { Id: string }).Id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    let user;
    try {
      user = await prisma.user.findUnique({ where: { Id: userId } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    } catch (userError) {
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 }
      );
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let previousApplications, idCardCount, mailCardCount;
    try {
      previousApplications = await prisma.application.findMany({
        where: { StudentId: user.StudentId },
        select: {
          Collage: true,
          Department: true,
          Program: true,
        },
      });

      idCardCount = await prisma.application.count({
        where: {
          StudentId: user.StudentId,
          applicationType: "ID_CARD_REPLACEMENT",
          createdAt: {
            gte: new Date(currentYear, currentMonth, 1),
            lte: new Date(currentYear, currentMonth + 1, 0),
          },
        },
      });

      mailCardCount = await prisma.application.count({
        where: {
          StudentId: user.StudentId,
          applicationType: "MAIL_CARD_REPLACEMENT",
          createdAt: {
            gte: new Date(currentYear, currentMonth, 1),
            lte: new Date(currentYear, currentMonth + 1, 0),
          },
        },
      });

    } catch (prevAppsError) {
      return NextResponse.json(
        { error: "Failed to fetch previous applications" },
        { status: 500 }
      );
    }

    const hasPrevious = previousApplications.length > 0;
    const latestApp = previousApplications[0] || {};

    return NextResponse.json(
      {
        hasPrevious,
        collage: latestApp.Collage || "",
        department: latestApp.Department || "",
        program: latestApp.Program || "",
        monthlyApplicationCounts: {
          ID_CARD_REPLACEMENT: idCardCount,
          MAIL_CARD_REPLACEMENT: mailCardCount,
        }, // Return counts for this month
      },
      { status: 200 }
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
