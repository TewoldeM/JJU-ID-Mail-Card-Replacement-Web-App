import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (!token || token.trim() === "") {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 15 });
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

    const user = await prisma.user.findUnique({ where: { Id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasPrevious =
      (await prisma.application.count({
        where: { StudentId: user.StudentId },
      })) > 0;

    let collage = null;
    let department = null;
    let program = null;

    if (hasPrevious) {
      const firstApplication = await prisma.application.findFirst({
        where: { StudentId: user.StudentId },
        orderBy: { createdAt: "asc" },
        select: { Collage: true, Department: true, Program: true },
      });
      if (firstApplication) {
        collage = firstApplication.Collage;
        department = firstApplication.Department;
        program = firstApplication.Program;
      }
    }

    return NextResponse.json(
      { hasPrevious, collage, department, program },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error checking previous applications:", error);
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
