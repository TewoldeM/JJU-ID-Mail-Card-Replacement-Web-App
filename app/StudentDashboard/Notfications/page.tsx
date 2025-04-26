"use client";

import Notifications from "@/components/collection/Admin-staff/Notfications/Notfications";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: string;
  StudentId: string;
}

export default function StudentDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="h-screen">Please sign in to view your dashboard.</div>
    );
  }

  console.log("Authenticated StudentId:", user.StudentId); // Log to verify

  return (
    <div>
      <Notifications StudentId={user.StudentId} />
    </div>
  );
}
