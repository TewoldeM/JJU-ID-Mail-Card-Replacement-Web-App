import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function PUT( req: NextRequest,{ params }: { params: { notificationId: string } }
) {
  const { notificationId } = params;
const token = req.cookies.get("token")?.value;
if (!token) {
  console.log("No token found in cookie");
  return NextResponse.json(
    { error: "Unauthorized: No token found" },
    { status: 401 }
  );
} try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = (payload as any).Id;

    const user = await prisma.user.findUnique({ where: { Id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification || notification.StudentId !== user.StudentId) {
      return NextResponse.json(
        { error: "Forbidden: Notification not yours" },
        { status: 403 }
      );
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
    console.log("Updated notification:", updatedNotification);
    return NextResponse.json(
      { message: "Notification marked as read" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PUT /api/notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
