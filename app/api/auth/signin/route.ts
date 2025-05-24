import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";
import argon2 from "argon2";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "tri421hlo219esdxldOIUV090FCKJHNy21knY";

export async function POST(req: NextRequest) {
  const { Email, Password } = await req.json();

  if (!Email || !Password) {
    return NextResponse.json(
      { error: "Email and Password are required" },
      { status: 400 }
    );
  }

  try {
    // Find user by Email
    const user = await prisma.user.findUnique({
      where: { Email },
      include: {
        Roles: {
          include: {
            permissions: true,
          },
        },
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid Email or Password" },
        { status: 401 }
      );
    }
    // Check if account is locked
    if (user.IsLocked && user.LockUntil && user.LockUntil > new Date()) {
      return NextResponse.json(
        { error: "Account locked. Try again later." },
        { status: 403 }
      );
    }

    // Verify Password
    const PasswordValid = await argon2.verify(user.Password, Password);

    if (!PasswordValid) {
      const updatedAttempts = user.FailedLoginAttempts + 1;
      let LockUntil = null;

      if (updatedAttempts >= 5) {
        LockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }

      await prisma.user.update({
        where: { Id: user.Id },
        data: {
          FailedLoginAttempts: updatedAttempts,
          IsLocked: updatedAttempts >= 5,
          LockUntil,
        },
      });

      return NextResponse.json(
        { error: "Invalid Email or Password" },
        { status: 401 }
      );
    }

    // Reset failed login attempts
    await prisma.user.update({
      where: { Id: user.Id },
      data: {
        FailedLoginAttempts: 0,
        IsLocked: false,
        LockUntil: null,
      },
    });

    // Generate tokens
    const tokenPayload = {
      Id: user.Id,
      FirstName: user.FirstName,
      LastName: user.LastName,
      studentId: user.StudentId,
      Email: user.Email,
      year: user.Year,
      Roles: user.Roles.map((role) => role.name), // Ensure Roles is an array of strings
    };
    const token = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(JWT_SECRET));

    const refreshToken = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(REFRESH_TOKEN_SECRET));

    // Create response
    const response = NextResponse.json(
      {
        message: "Sign-in successful",
        token,
        refreshToken,
        user: {
          Id: user.Id,
          Email: user.Email,
          Roles: tokenPayload.Roles,
        },
      },
      { status: 200 }
    );

    // Set tokens as HTTP-only cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 3600, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
