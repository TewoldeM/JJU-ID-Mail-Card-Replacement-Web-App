import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";
import IdandMailCardReplacementForm from "@/components/collection/IdandMailCardReplacmentForm";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

async function getCurrentUser() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value; // Removed unnecessary await

  if (!token) {
    console.log("No token found in cookies, redirecting to sign-in");
    redirect("/sign-in");
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 15 });
    const userId = (payload as JWTPayload & { Id: string }).Id;
    if (!userId) {
      console.log("User ID not found in token payload");
      redirect("/sign-in");
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { Id: userId },
      include: {
        Roles: true,
      },
    });

    if (!user) {
      console.log("User not found for ID:", userId);
      redirect("/sign-in");
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error verifying token or fetching user:", error);
    redirect("/sign-in");
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export default async function IdandMailCardReplacement() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  return (
    <div className="h-auto">
      <IdandMailCardReplacementForm user={user} />
    </div>
  );
}
