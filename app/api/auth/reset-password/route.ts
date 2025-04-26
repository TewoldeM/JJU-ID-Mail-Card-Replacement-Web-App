import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import mailjet from "node-mailjet";

const prisma = new PrismaClient();

const MJ_APIKEY_PUBLIC = process.env.MJ_APIKEY_PUBLIC;
const MJ_APIKEY_PRIVATE = process.env.MJ_APIKEY_PRIVATE;
const EMAIL_FROM = process.env.MJ_SENDER_EMAIL;

if (!MJ_APIKEY_PUBLIC || !MJ_APIKEY_PRIVATE || !EMAIL_FROM) {
  throw new Error(
    "Mailjet API keys and EMAIL_FROM must be set in environment variables."
  );
}

const mailjetClient = mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json(
      { error: "Token and new password are required" },
      { status: 400 }
    );
  }

  try {
    const cleanToken = token.trim();

    const user = await prisma.user.findFirst({
      where: {
        PasswordResetToken: cleanToken,
        PasswordResetExpires: { gt: new Date() }, // Ensure not expired
      },
    });

    if (!user) {
      console.error("❌ Invalid or expired token:", cleanToken);
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const hashedPassword = await argon2.hash(password);

    await prisma.user.update({
      where: { Id: user.Id },
      data: {
        Password: hashedPassword,
        PasswordResetToken: null,
        PasswordResetExpires: null,
        FailedLoginAttempts: 0,
        IsLocked: false,
        LockUntil: null,
      },
    });

    // Send the password change notification via Mailjet
    const resetLink = `${req.nextUrl.origin}/reset-password?token=${cleanToken}`;

    await mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: EMAIL_FROM,
            Name: "Your App Name",
          },
          To: [
            {
              Email: user.Email,
            },
          ],
          Subject: "Your Password Has Been Changed",
          TextPart: `Hello ${user.FirstName},\n\nYour password has been successfully changed. If you did not make this change, please contact support immediately or reset your password again.\n\nThank you!`,
          HTMLPart: `<p>Hello ${user.FirstName},</p><p>Your password has been successfully changed. If you did not make this change, please <a href="${resetLink}">reset your password</a> immediately or contact support.</p><p>Thank you!</p>`,
        },
      ],
    });

    // Create the notification record in the database
    await prisma.notification.create({
      data: {
        StudentId: user.StudentId, // Assuming your User model has a StudentId field
        message: "Your password has been successfully changed.",
        link: resetLink,
        read: false,
      },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔧 Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
//git commit -m "App-in Notification for the student when the password is changed, Submit application form, accepted, rejected, and approved there application"
