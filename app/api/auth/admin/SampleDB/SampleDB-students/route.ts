// /api/admin/Students/route.ts
import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function GET(req: NextRequest) {
 const token= req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized. Admins only." },
      { status: 401 }
    );
  }

  try {
    // chuck the admin role for the token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 1 });
    const userRoles = (payload as JWTPayload & { Roles: string[] }).Roles || [];

    // Check if the user has the ADMIN role
    if (!userRoles.includes("ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized. Admins only." },
        { status: 401 }
      );
    }

    // Fetch all Students from ValidStudent
    const students = await prisma.validStudent.findMany({
      orderBy: { CreatedAt: "desc" }, // Optional: Sort by creation date (newest first)
    });

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
