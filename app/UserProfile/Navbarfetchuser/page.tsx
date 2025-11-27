import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";
import { Navbar } from "@/components/collection/layouts/Navbar";

// Initialize PrismaClient (singleton for better connection management)
const prisma = new PrismaClient();

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Define expected payload structure
interface CustomJWTPayload extends JWTPayload {
  Id?: string;
  Roles?: string[];
}

async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.warn("No token found in cookies");
      return null;
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    console.debug(
      "Verifying token with secret (masked):",
      (JWT_SECRET?.slice(0, 4) ?? "undefined") + "..."
    );

    // Verify JWT token
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 15 });

    // Validate payload structure
    const customPayload = payload as CustomJWTPayload;
    const userId = customPayload.Id;

    if (!userId) {
      console.warn("User ID not found in token payload:", payload);
      return null;
    }

    // Check for token expiration
    if (customPayload.exp && customPayload.exp * 1000 < Date.now()) {
      console.warn("Token has expired:", new Date(customPayload.exp * 1000));
      return null;
    }

    const roles = customPayload.Roles || [];

    // Fetch user from Prisma
    const user = await prisma.user.findUnique({
      where: { Id: userId },
      include: { Roles: true },
    });

    if (!user) {
      console.warn("User not found in database:", userId);
      return null;
    }

    return {
      Id: userId,
      Roles: [...roles, ...(user.Roles.map((r) => r.name) || [])],
    };
  } catch (error) {
    console.error("Error verifying token or fetching user:", error);
    return null;
  } finally {
    // Disconnect Prisma to avoid connection leaks
    await prisma.$disconnect();
  }
}

const ServerNavbar = async () => {
  const user = await getCurrentUser();
  // Default to "STUDENT" if no user or no ADMIN role
  const userRole = user && user.Roles.includes("ADMIN") ? "ADMIN" : "STUDENT";

  return <Navbar userRole={userRole} />;
};

export default ServerNavbar;
