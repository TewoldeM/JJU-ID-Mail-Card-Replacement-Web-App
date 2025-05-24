import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";
import StudentDashboard from "@/components/collection/StudentDashboard";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

const StudentDashboardPage = async () => {
  async function getCurrentUser() {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;
    if (!token) {
      return null; // Return null to handle redirection in the component
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret, {
        clockTolerance: 15,
      });
      const userId = (payload as JWTPayload & { Id: string }).Id;

      if (!userId) {
        console.error("User ID not found in token payload:", payload);
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { Id: userId },
        include: {
          Applications: {
            orderBy: { createdAt: "desc" }, // Sort applications by creation date (newest first)
          },
          Notifications: true, // Fetch notifications for the user
          Roles: true, // Fetch roles to check if user is a student
        },
      });

      if (!user) {
        console.error("User not found for ID:", userId);
        return null;
      }

      return user; // Return the user object with applications and roles
    } catch (error) {
      console.error("Error verifying token or fetching user:", error);
      return null;
    }
  }

  // Fetch the current user and their applications
  const user = await getCurrentUser();

  // Handle case where user is not found or not authenticated
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Unauthorized. Please sign in.</p>
      </div>
    );
  }

  // Ensure the user is a student (optional check)
  const isStudent = user.Roles.some((role) => role.name === "STUDENT");
  if (!isStudent) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Access denied. Students only.</p>
      </div>
    );
  }

  return (
    <div>
      <StudentDashboard
        user={{
          Id: user.Id,
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email,
          PhoneNumber: user.PhoneNumber,
          StudentId: user.StudentId,
          Applications: user.Applications.map((app) => ({
            id: app.id,
            applicationType: app.applicationType,
            status: app.status,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
          })),
          Roles: user.Roles.map((role) => ({
            Id: role.id,
            Name: role.name,
          })),
          Notifications: user.Notifications.map((notification) => ({
            id: notification.id,
            message: notification.message,
            read: notification.read, // Include the 'read' property
            createdAt: notification.createdAt,
          })),
        }}
      />
    </div>
  );
};

export default StudentDashboardPage;
