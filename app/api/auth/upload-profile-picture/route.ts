import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function POST(req: NextRequest) {
  try {
    // Verify JWT token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 15 });
    const userId = (payload as JWTPayload & { Id?: string })?.Id;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type and size (e.g., image only, max 4MB)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, or GIF allowed" },
        { status: 400 }
      );
    }
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 4MB" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const base64DataUrl = `data:${file.type};base64,${base64}`;

    // Update user with profile picture
    await prisma.user.update({
      where: { Id: userId },
      data: { ProfilePicture: base64DataUrl },
    });

    return NextResponse.json({
      message: "Profile picture uploaded successfully",
    });
  } catch (error:unknown) {
    console.error("Error uploading profile picture:", error);
    return NextResponse.json(
      { error: "Internal server error", },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
