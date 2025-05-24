import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import jwt from "jsonwebtoken";
// Import your email service (e.g., SendGrid, Nodemailer)

const prisma = new PrismaClient();

const responseSchema = z.object({
  message: z.string().min(1, "Response message is required"),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    const body = await request.json();
    const { message } = responseSchema.parse(body);

    const contactMessage = await prisma.contactMessage.findUnique({
      where: { id: params.id },
      select: { email: true },
    });

    if (!contactMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Find the user's StudentId based on the contact message's email
    const user = await prisma.user.findUnique({
      where: { Email: contactMessage.email },
      select: { StudentId: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found for this email" },
        { status: 404 }
      );
    }

    // Create notification for the student
    await prisma.notification.create({
      data: {
        StudentId: user.StudentId,
        message: `Response to your contact message: ${message}`,
        read: false,
        link: null, // Optional, set to null as no link is needed
      },
    });

    // Update message status to RESOLVED
    await prisma.contactMessage.update({
      where: { id: params.id },
      data: { status: "RESOLVED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error sending response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
