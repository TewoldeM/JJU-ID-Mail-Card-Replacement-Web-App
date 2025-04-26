import { generateEmailTemplate } from "@/components/collection/email-template";
import { NextResponse } from "next/server";
import Mailjet from "node-mailjet";

interface UserData {
  email: string;
  FirstName: string;
  verificationLink?: string;
}

export async function POST(request: Request) {
  try {
    // Validate environment variables
    const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE, MJ_SENDER_EMAIL } =
      process.env;
    if (!MJ_APIKEY_PUBLIC || !MJ_APIKEY_PRIVATE || !MJ_SENDER_EMAIL) {
      console.error("Missing Mailjet configuration");
      return NextResponse.json(
        { error: "Server configuration error: Missing Mailjet settings" },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, FirstName, verificationLink } = body as UserData;

    if (!email || !FirstName) {
      return NextResponse.json(
        { error: "Email and FirstName are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Initialize Mailjet client
    const mailjet = new Mailjet({
      apiKey: MJ_APIKEY_PUBLIC,
      apiSecret: MJ_APIKEY_PRIVATE,
    });

    // Prepare email content
    const htmlContent = generateEmailTemplate({ FirstName, verificationLink });
    const textContent = `Dear ${FirstName},\n\nThank you for submitting your application for an ID or Mail Card replacement.\n\n${
      verificationLink
        ? `Please verify your application by clicking the link below:\n${verificationLink}\n\nThis link will expire in 10 minutes.\n\n`
        : ""
    }If you did not submit this application, please ignore this email or contact support.\n\nBest regards,\nThe JJU Support Team\n\nJimma University, Jimma, Ethiopia\nEmail: support@jju.edu.et`;

    // Send email
    const response = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: MJ_SENDER_EMAIL,
            Name: "JJU Support Team",
          },
          To: [
            {
              Email:email,
              Name: FirstName,
            },
          ],
          Subject: "Verify Your ID/Mail Card Replacement Application",
          TextPart: textContent,
          HTMLPart: htmlContent,
        },
      ],
    });

    // Assert the response body type
    const responseBody = response.body as {
      Messages: { To: { MessageID: string }[] }[];
    };
    return NextResponse.json({
      message: "Email sent successfully",
      messageId: responseBody.Messages[0].To[0].MessageID,
    });
  } catch (error:any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
