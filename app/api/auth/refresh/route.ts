import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function POST(req: NextRequest) {
  if (req.headers.get("content-type") !== "application/json") {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  let refreshToken;
  try {
    const body = await req.json();
    refreshToken = body.refreshToken;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }
  } catch{
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { PasswordResetToken: refreshToken },
      include: { Roles: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      Id: user.Id,
      Email: user.Email,
      StudentId: user.StudentId, // Include StudentId in token payload
      Roles: user.Roles.map((role) => role.name),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    // Generate a new refresh token (optional, depending on your strategy)
    const newRefreshToken = await new SignJWT({
      Id: user.Id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // Update the user's refresh token in the database
    await prisma.user.update({
      where: { Id: user.Id },
      data: { PasswordResetToken: newRefreshToken },
    });

    return NextResponse.json(
      {
        token,
        refreshToken: newRefreshToken,
        user: {
          Id: user.Id,
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email,
          StudentId: user.StudentId,
          Year: user.Year,
          Collage: user.Collage,
          Department: user.Department,
          Program: user.Program,
          Roles: user.Roles.map((role) => ({ name: role.name })),
        },
      },
      { status: 200 }
    );
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
