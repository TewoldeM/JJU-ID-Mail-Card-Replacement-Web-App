"use client";

import Notifications from "@/components/collection/Admin-staff/Notfications/Notfications";
import { useState } from "react";
interface User {
  id: string; // User.Id (UUID)
  StudentId: string; // User.StudentId (4-digit)
}

export default function StudentDashboard() {
  const [user] = useState<User>({ id: "student-uuid-1", StudentId: "1234" }); // Replace with auth
  return (
    <div>
      <Notifications studentId={user.StudentId} />
    </div>
  );
}
