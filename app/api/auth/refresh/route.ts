import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token is required" },
      { status: 400 }
    );
  }

  try {
    // Validate refresh token (example: check if it matches a stored token in the database)
    const user = await prisma.user.findFirst({
      where: { PasswordResetToken: refreshToken }, // Example: Store refresh tokens in PasswordResetToken field
      include: { Roles: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Generate a new access token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      Id: user.Id,
      Email: user.Email,
      Roles: user.Roles.map((role) => role.name),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
