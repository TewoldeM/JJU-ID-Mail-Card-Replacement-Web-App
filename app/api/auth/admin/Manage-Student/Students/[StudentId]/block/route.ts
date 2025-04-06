import { NextResponse } from "next/server";
import prisma from "@/app/lib/client";

export async function PATCH(
  request: Request,
  { params }: { params: { StudentId: string } }
) {
  try {
    // Ensure params.StudentId is accessed asynchronously
    const studentId = params.StudentId;

    if (!studentId) {
      return NextResponse.json(
        { message: "Invalid Student ID." },
        { status: 400 }
      );
    }

    // Parse the request body
    const { IsLocked } = await request.json();

    if (typeof IsLocked !== "boolean") {
      return NextResponse.json(
        { message: "Invalid IsLocked value." },
        { status: 400 }
      );
    }

    // Update the student's IsLocked status in the database
    const updatedStudent = await prisma.user.update({
      where: { Id: studentId },
      data: { IsLocked },
    });

    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error:any) {
    console.error("Error blocking/unblocking student:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}