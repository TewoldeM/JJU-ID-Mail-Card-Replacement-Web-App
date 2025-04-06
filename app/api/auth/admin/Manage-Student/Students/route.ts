import { NextResponse } from "next/server";
import prisma from "@/app/lib/client";// Ensure you have Prisma configured
import { toast } from "sonner";

// Fetch all students
export async function GET() {
  try {
    const students = await prisma.user.findMany({
      select: {
        Id: true,
        FirstName: true,
        LastName: true,
        Email: true,
        StudentId: true,
        Collage: true,
        Department: true,
        Program: true,
        Year: true,
        IsLocked: true,
      },
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

// Delete a student
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const StudentId = searchParams.get("StudentId");

    if (!StudentId) {
      return NextResponse.json(
        { message: "Student ID is required." },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { Id: StudentId },
    });

    return NextResponse.json(
      { message: "Student deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting student:", error);
    toast.error("Error When Delete a user");
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
