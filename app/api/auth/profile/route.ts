import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 15 });
    const userId = (payload as JWTPayload & { Id?: string })?.Id;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { Email, PhoneNumber, Password } = await req.json();
    const updateData: any = { Email, PhoneNumber };
    if (Password) {
      updateData.Password = await require("argon2").hash(Password);
    }

    const user = await prisma.user.update({
      where: { Id: userId },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
