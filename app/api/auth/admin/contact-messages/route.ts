import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, MessageStatus } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Verify token using jwtVerify
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 15 });
    console.log("Decoded token:", payload); // Debug
    const userId = (payload as JWTPayload & { Id?: string; Roles?: string[] })
      ?.Id;
    const roles = (payload as JWTPayload & { Roles?: string[] })?.Roles;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token: User ID missing" },
        { status: 401 }
      );
    }

    // Check for ADMIN role
    if (!roles || !roles.includes("ADMIN")) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const status = url.searchParams.get("status") || undefined;

    // Validate and cast status to MessageStatus enum
    const validStatuses = Object.values(MessageStatus); // e.g., ["PENDING", "READ", "RESOLVED"]
    const where =
      status &&
      status !== "all" &&
      validStatuses.includes(status as MessageStatus)
        ? { status: { equals: status as MessageStatus } }
        : {};

    // Fetch messages
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactMessage.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      messages,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: any) {
    console.error("Error in /api/auth/admin/contact-messages:", error);
    if (error.code === "ERR_JWT_EXPIRED" || error.code === "ERR_JWS_INVALID") {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
