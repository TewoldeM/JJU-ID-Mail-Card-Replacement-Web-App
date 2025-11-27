import { NextResponse } from "next/server";
import prisma from "@/app/lib/client";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { Id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

      if (user.deletedAt) {
          return NextResponse.json({ message: "User is already deleted" }, { status: 400 });
      }
    await prisma.user.update({
      where: { Id: userId },
      data: { deletedAt: new Date() },
    });

    // Create notification (optional, since user may not see it)
    await prisma.notification.create({
      data: {
        StudentId: user.StudentId,
        message: "Your account has been deleted.By admin",
        read: false,
      },
    });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch{
    return NextResponse.json({error: "Internal server error"},{ status: 500 });}   
}
