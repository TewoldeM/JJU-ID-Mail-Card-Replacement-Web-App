import { NextResponse } from "next/server";
import prisma from "@/app/lib/client";

export async function POST(request: Request) {
  try {
    const { FirstName, LastName, StudentId, PhoneNumber, Email, Year } =
      await request.json();

    // required fields
    if (!FirstName || !LastName || !StudentId || !Email || !Year) {
      return NextResponse.json(
        {
          error: "FirstName, LastName, StudentId, Email and Year are required.",
        },
        { status: 400 }
      );
    }
    // Validate StudentId as a 4-digit number
    if (!/^\d{4}$/.test(StudentId)) {
      return NextResponse.json(
        { error: "Student ID must be a 4-digit number" },

        { status: 400 }
      );
    }

    // Optional phone number validation
    if (PhoneNumber && !/^\d{10}$/.test(PhoneNumber)) {
      return NextResponse.json(
        { error: "Phone number must be 10 digits" },
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
    // uniqueness check
    const existing = await prisma.validStudent.findFirst({
      where: {
        OR: [{ StudentId }, { Email }],
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A student with that StudentId or Email already exists." },
        { status: 409 }
      );
    }

    // create record
    await prisma.validStudent.create({
      data: {
        FirstName,
        LastName,
        StudentId,
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
