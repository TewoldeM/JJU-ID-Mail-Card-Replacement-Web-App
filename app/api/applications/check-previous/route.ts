import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function GET(req: NextRequest) {
  console.log("Received GET request to /api/applications/check-previous");

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

      console.log("Previous applications:", previousApplications);
      console.log("ID Card applications this month:", idCardCount);
      console.log("Mail Card applications this month:", mailCardCount);
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
