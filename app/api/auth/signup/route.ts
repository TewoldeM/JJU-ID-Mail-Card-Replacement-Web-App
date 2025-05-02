import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";
import argon2 from "argon2";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret";

export async function POST(req: NextRequest) {
  try {
    const {
      FirstName,
      LastName,
      Password,
      StudentId,
      Email,
      Year,
      PhoneNumber,
    } = await req.json();

    // Input validation
    if (
      !Password ||
      !StudentId ||
      !FirstName ||
      !LastName ||
      !Email ||
      !Year ||
      !PhoneNumber
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // Validate StudentId as a 4-digit number
    if (!/^\d{4}$/.test(StudentId)) {
      return NextResponse.json(
        { error: "Student ID must be a 4-digit number" },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!/^\d{10}$/.test(PhoneNumber)) {
      return NextResponse.json(
        { error: "Phone number must be 10 digits" },
        { status: 400 }
      );
    }

    // Check for existing users
    const [existingEmail, existingPhoneNumber, existingStudentId] =
      await Promise.all([
        prisma.user.findUnique({ where: { Email } }),
        prisma.user.findFirst({ where: { PhoneNumber } }),
        prisma.user.findUnique({ where: { StudentId } }),
      ]);

    if (existingEmail || existingPhoneNumber || existingStudentId) {
      return NextResponse.json(
        { error: "Student ID, Email, or phone number already exists" },
        { status: 400 }
      );
    }

    // Ensure 'STUDENT' Role exists
    let defaultRole = await prisma.role.findFirst({
      where: { name: "STUDENT" },
    });

    if (!defaultRole) {
      defaultRole = await prisma.role.create({
        data: {
          name: "STUDENT",
          description: "Default Role for students",
        },
      });
    }

    // Hash Password
    const hashedPassword = await argon2.hash(Password);

    // Create user with default Role and initialize UserSetting
    const newUser = await prisma.user.create({
      data: {
        FirstName,
        LastName,
        Password: hashedPassword,
        StudentId,
        Year,
        Email,
        PhoneNumber,
        Collage: "Default College",
        Department: "Default Department",
        Roles: {
          connect: [{ id: defaultRole.id }],
        },
        Settings: {
          create: {
            theme: "light",
            language: "en",
            notificationsEnabled: true,
          },
        },
      },
      include: {
        Roles: {
          include: {
            permissions: true,
          },
        },
        Settings: true,
      },
    });

    if (!newUser.Settings) {
      throw new Error("Failed to create user settings");
    }

    // Generate tokens
    const tokenPayload = {
      Id: newUser.Id,
      FirstName: newUser.FirstName,
      LastName: newUser.LastName,
      StudentId: newUser.StudentId,
      Email: newUser.Email,
      Year: newUser.Year,
      PhoneNumber: newUser.PhoneNumber,
      Roles: newUser.Roles.map((role) => ({
        id: role.id,
        name: role.name,
        permissions: role.permissions.map((p) => p.name),
      })),
      Settings: {
        id: newUser.Settings.id,
        theme: newUser.Settings.theme,
        language: newUser.Settings.language,
        notificationsEnabled: newUser.Settings.notificationsEnabled,
      },
    };

    const token = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(JWT_SECRET));

    const refreshToken = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(REFRESH_TOKEN_SECRET));

    // Set cookies in the response
    const response = NextResponse.json(
      {
        message: "Signup successful",
        token,
        refreshToken,
        user: {
          Id: newUser.Id,
          FirstName: newUser.FirstName,
          LastName: newUser.LastName,
          StudentId: newUser.StudentId,
          Email: newUser.Email,
          Year: newUser.Year,
          PhoneNumber: newUser.PhoneNumber,
          Roles: tokenPayload.Roles,
          Settings: tokenPayload.Settings,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
