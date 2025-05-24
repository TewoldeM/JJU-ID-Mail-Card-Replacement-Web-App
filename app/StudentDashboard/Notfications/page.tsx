"use client";

import Notifications from "@/components/collection/Admin-staff/Notfications/Notfications";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: string;
  StudentId: string;
}

export default function NotificationPage() {
  const { user, loading } = useAuth();

  // Show loading state while authentication is being resolved
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Handle case where user is not authenticated
  if (!user || !user.StudentId) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        Please sign in to view your Notifications.
      </div>
    );
  }

  console.log("Authenticated user:", {
    id: user.Id,
    StudentId: user.StudentId,
  }); // Enhanced logging

  return (
    <div>
      <Notifications StudentId={user.StudentId} />
    </div>
  );
}
