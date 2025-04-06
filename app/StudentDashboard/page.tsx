
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, JWTPayload } from "jose";

// Initialize Prisma client
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

// Fetch the current user based on the JWT token
async function getCurrentUser() {
  const cookiesStore = cookies();
  const token = (await cookiesStore).get("token")?.value;

  if (!token) {
    return null; // Return null to handle redirection in the component
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 15 });
    const userId = (payload as JWTPayload & { Id: string }).Id;

    if (!userId) {
      console.error("User ID not found in token payload:", payload);
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { Id: userId },
      include: {
        Applications: true, // Fetch all applications for the user
        Roles: true,       // Optional, included for completeness
      },
    });

    if (!user) {
      console.error("User not found for ID:", userId);
      return null;
    }

    return user; // Return the user object with applications
  } catch (error) {
    console.error("Error verifying token or fetching user:", error);
    return null;
  }
}

export default async function StudentDashboard() {
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

  // Extract applications for the current user
  const applications = user.Applications || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard - My Applications</h1>
      {applications.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          No applications found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-900 dark:bg-gray-900 text-white">
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                  Application ID
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                  Type
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                  Reason
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                  Collage
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                  Department
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                  Program
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                  Status
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                  Created At
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                  Attached Files
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td
className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {application.id || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {application.applicationType || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {application.reason || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {application.Collage || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {application.Department || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {application.Program || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {application.status || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {new Date(application.createdAt).toLocaleDateString() || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {/* {application.files && application.files.length > 0 ? (
                      <ul>
                        {application.files.map((file) => (
                          <li key={file.id}>{file.name || "Unnamed File"}</li>
                        ))}
                      </ul>
                    ) : (
                      "No files attached"
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}