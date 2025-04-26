import { NextResponse } from "next/server";
import prisma from "@/app/lib/client";

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { deletedAt: null }, // Exclude deleted users
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
        IsBlocked: true,
      },
    });

    const totalStudents = await prisma.user.count({
      where: { deletedAt: null }, // Only count non-deleted users
    });

    const totalBlocked = await prisma.user.count({
      where: { IsBlocked: true, deletedAt: null }, // Only count non-deleted blocked users
    });

    const totalDeleted = await prisma.user.count({
      where: { deletedAt: { not: null } }, // Count soft-deleted users
    });

    return NextResponse.json(
      { students, totalStudents, totalBlocked, totalDeleted },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { StudentId } = await request.json();
    if (!StudentId) {
      return NextResponse.json(
        { message: "StudentId is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { StudentId } });
    if (!user) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { StudentId },
      data: { deletedAt: new Date() }, // Soft delete
    });

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { StudentId, IsBlocked } = await request.json();
    if (!StudentId || typeof IsBlocked !== "boolean") {
      return NextResponse.json(
        { message: "StudentId and IsBlocked are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { StudentId } });
    if (!user) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { StudentId },
      data: { IsBlocked }, // Toggle block status
    });

    return NextResponse.json({
      message: `Student ${IsBlocked ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error: any) {
    console.error("Error blocking/unblocking student:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
