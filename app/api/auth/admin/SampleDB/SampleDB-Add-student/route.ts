import { NextResponse } from "next/server";
import prisma from "@/app/lib/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      FirstName,
      LastName,
      StudentId,
      PhoneNumber,
      Email,
      Year,
      Collage,
      Department,
      Program,
    } = body;

    // Log the received payload for debugging
    console.log("Received payload:", body);

    // Required fields validation
    const requiredFields = {
      FirstName,
      LastName,
      StudentId,
      Email,
      Year,
      Collage,
      Department,
      Program,
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([value]) => !value)
      .map(([key]) => key);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    // Validate StudentId as a 4-digit number
    if (!/^\d{4}$/.test(StudentId)) {
      return NextResponse.json(
        { error: "Student ID must be exactly 4 digits and numeric." },
        { status: 400 }
      );
    }

    // Optional phone number validation
    if (PhoneNumber && !/^\d{10}$/.test(PhoneNumber)) {
      return NextResponse.json(
        { error: "Phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    // Validate Year as exactly two digits
    if (!/^\d{2}$/.test(Year)) {
      return NextResponse.json(
        { error: "Year must be exactly two digits (e.g., 25)." },
        { status: 400 }
      );
    }

    // Validate Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Uniqueness check
    const existing = await prisma.validStudent.findFirst({
      where: {
        OR: [{ StudentId }, { Email }],
      },
    });
    if (existing) {
      return NextResponse.json(
        {
          error: `A student with Student ID ${StudentId} or Email ${Email} already exists.`,
        },
        { status: 409 }
      );
    }

    // Create record
    await prisma.validStudent.create({
      data: {
        FirstName,
        LastName,
        StudentId,
        Collage,
        Department,
        Program,
        PhoneNumber: PhoneNumber || "",
        Email,
        Year,
      },
    });

    return NextResponse.json(
      { message: "Student created successfully." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating student:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
