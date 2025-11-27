import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with your actual secret

export async function PUT(req: NextRequest, { params }: { params: { id: string } }){
  try {
    // Get the JWT token from the cookie
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token" }, { status: 401 });
    }

    // Verify the token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    // Find the user to get their StudentId
    const user = await prisma.user.findUnique({
      where: { Id: userId },
      select: { StudentId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = params; // Get notificationId from URL
    // Find the notification
    const notification = await prisma.notification.findFirst({
      where: { id, StudentId: user.StudentId },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found or not authorized" },
        { status: 404 }
      );
    }

    // Update the notification to mark as read
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/notifications/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      ( { status: 500 })
    );
  } finally {
    await prisma.$disconnect();
  }
}