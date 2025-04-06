import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";
import argon2 from "argon2";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 30 });
    const userId = (payload as JWTPayload & { id: string }).id;

    // Parse request body
    const { Email, PhoneNumber, Password } = await req.json();
    if (!Email && !PhoneNumber && !Password) {
      return NextResponse.json(
        { error: "At least one field must be provided to update" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (Email) {
      const existingEmail = await prisma.user.findUnique({
        where: { Email },
      });
      if (existingEmail && existingEmail.Id !== userId) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }
      updateData.Email = Email;
    }
    if (PhoneNumber) {
      updateData.PhoneNumber = PhoneNumber;
    }
    if (Password) {
      updateData.Password = await argon2.hash(Password);
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { Id: userId },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          Id: updatedUser.Id,
          Email: updatedUser.Email,
          PhoneNumber: updatedUser.PhoneNumber || null,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile update error:", error);
    if (error.code === "ERR_JWT_EXPIRED") {
      return NextResponse.json({ error: "Token has expired" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
