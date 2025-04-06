// components/ServerNavbar.tsx
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";
import Navbar from "@/components/collection/layouts/Navbar";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

async function getCurrentUser() {
  const cookieStore = cookies();
  const token =( await cookieStore).get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 15 });
    const userId = (payload as JWTPayload & { Id: string }).Id;
    const Roles = (payload as JWTPayload & { Roles: string[] }).Roles || [];

    if (!userId) {
      console.error("User ID not found in token payload:", payload);
      return null;
    }

    // Fetch user from Prisma to get roles
    const user = await prisma.user.findUnique({
      where: { Id: userId },
      include: { Roles: true },
    });

    if (!user) {
      console.error("User not found in database:", userId);
      return null;
    }

    return {
      Id: userId,
      Roles: [...Roles, ...(user?.Roles.map((r) => r.name) || [])],
    };
  } catch (error) {
    console.error("Error verifying token or fetching user:", error);
    return null;
  }
}

const ServerNavbar = async () => {
  const user = await getCurrentUser();
  const userRole = user && user.Roles.includes("ADMIN") ? "ADMIN" : "STUDENT";

  return <Navbar userRole={userRole} />;
};

export default ServerNavbar;
