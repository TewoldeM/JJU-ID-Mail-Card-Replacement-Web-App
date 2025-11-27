import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
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
  try {
    const body = await req.json();
    const email = body.email?.trim();

    console.log("📩 Incoming password reset request for:", email);

    // Validate email presence
    if (!email) {
      console.warn("⚠️ No email provided in request.");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Optional: Regex to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn("❌ Invalid email format received:", email);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        Email: email,
      },
    });

    if (!user) {
      console.info("🔍 No user found for email:", email);
      // Always return 200 to avoid email enumeration
      return NextResponse.json(
        { message: "If the email exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to DB
    await prisma.user.update({
      where: { Email: email },
      data: {
        PasswordResetToken: resetToken,
        PasswordResetExpires: resetTokenExpires,
      },
    });

    const resetLink = `${req.nextUrl.origin}/reset-password?token=${resetToken}`;
    console.log("🔗 Reset link:", resetLink);

    // Send via Mailjet
    const response = await mailjetClient
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: EMAIL_FROM,
              Name: "Your App Name",
            },
            To: [
              {
                Email: email,
              },
            ],
            Subject: "Password Reset Request",
            TextPart: `Click the link to reset your password: ${resetLink}`,
            HTMLPart: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
          },
        ],
      });

    console.log("✅ Reset email sent:", response.body);

    return NextResponse.json(
      { message: "If the email exists, a reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❗ Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
