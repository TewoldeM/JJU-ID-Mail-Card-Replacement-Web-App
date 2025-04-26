// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 30,});
    console.log("Token payload:", payload); // Log payload for debugging
    const userId = (payload as JWTPayload & { Id?: string })?.Id;
    if (!userId) {
      console.log("User ID not found or invalid in token payload in /api/auth/me:", payload);
      return NextResponse.json( { error: "Invalid token: Missing or invalid user ID" },{ status: 401 } );
    }

    const user = await prisma.user.findUnique({
      where: { Id: userId },
      select: {
        Id: true,
        FirstName: true,
        LastName: true,
        Email: true,
        StudentId: true,
        Year: true,
        Collage: true,
        Department: true,
        Program: true,
        Roles: {
          select: { name: true },
        },
      },
    });

    if (!user) {
      console.log("User not found for ID:", userId, "in /api/auth/me");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("User data retrieved in /api/auth/me:", user);
    return NextResponse.json(user, { status: 200 });
  } catch (error:any) {
    console.error("Error verifying token in /api/auth/me:", error);
    if (error instanceof Error) {
      if (error.name === "JWTExpired") {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      } else if (error.name === "JWTInvalid") {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      } else {
        return NextResponse.json( { error: "Internal server error", details: error.message },{ status: 500 });  
      }
    }
    return NextResponse.json( { error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
