"use client";

import Notifications from "@/components/collection/Admin-staff/Notfications/Notfications";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/app/lib/contants/User";

export default function NotificationPage() {
  const { user, loading, isAuthenticated } = useAuth();

  // Explicitly type user to satisfy linter
  const typedUser: User | null = user;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  console.log("NotificationPage - User:", typedUser);
  console.log("NotificationPage - isAuthenticated:", isAuthenticated);

  if (!isAuthenticated || !typedUser) {
    console.log("NotificationPage - Redirecting to sign-in due to:", {
      isAuthenticated,
      userExists: !!typedUser,
    });
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        Please sign in to view your Notifications.
      </div>
    );
  }

  if (!typedUser.StudentId) {
    console.log("NotificationPage - Missing StudentId for user:", typedUser);
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        Error: Student ID not found. Please contact support.
      </div>
    );
  }

  console.log("Authenticated user:", {
    id: typedUser.Id,
    StudentId: typedUser.StudentId,
  });

  return (
    <div>
      <Notifications StudentId={typedUser.StudentId!} />
    </div>
  );
}
