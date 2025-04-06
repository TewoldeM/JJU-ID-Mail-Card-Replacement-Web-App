// /api/admin/add-student/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  console.log("Token from cookies in /api/admin/add-student:", token); // Debugging log

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized. Admins only." },
      { status: 401 }
    );
  }

  try {
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


    const { FirstName, LastName, StudentId, PhoneNumber, Email } = await req.json();

    // Validate required fields
    if (!FirstName || !LastName || !StudentId) {
      return NextResponse.json(
        { error: "First name, last name, and student ID are required" },
        { status: 400 }
      );
    }


    // Check if StudentId or email already exists
    const existingStudent = await prisma.validStudent.findFirst({
      where: {

        OR: [{ StudentId }, { Email }],
      },
    });

    if (existingStudent) {
      return NextResponse.json(

        { error: "Student ID or email already exists" },
        { status: 400 }
      );
    }

    // Create the new student in the ValidStudent table
    const newStudent = await prisma.validStudent.create({
      data: {
        FirstName,
        LastName,
        StudentId,
        PhoneNumber: PhoneNumber, // Use PhoneNumber to match Prisma schema
        Email,
      },
    });

    return NextResponse.json(
      { message: "Student added successfully", student: newStudent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

}