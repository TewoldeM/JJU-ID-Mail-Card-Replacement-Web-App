import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Access token from cookies
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }; // Assuming JWT contains user ID
    console.log("Auth API - Decoded JWT:", decoded); // Debug log

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { Id: decoded.id },
      select: {
        Id: true,
        StudentId: true, // Ensure this matches the Prisma schema
        FirstName: true,
        LastName: true,
        Email: true,
        Year: true,
        Collage: true,
        Department: true,
        Program: true,
        Roles: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("Auth API - User fetched from DB:", user); // Debug log

    return NextResponse.json({
      Id: user.Id,
      StudentId: user.StudentId,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Email: user.Email,
      Year: user.Year,
      Collage: user.Collage,
      Department: user.Department,
      Program: user.Program,
      Roles: user.Roles?.map((role) => role.name) || [],
    });
  } catch (error) {
    console.error("Error in GET /api/auth/user:", error);
    return NextResponse.json(
      { message: "Invalid token or server error" },
      { status: 401 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
