// app/admin/admin-applications/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import { DataTable } from "@/components/collection/Admin-staff/data-table";
import {
  columns,
  ApplicationData,
} from "@/components/collection/Admin-staff/columns";

const prisma = new PrismaClient();

async function getApplications(): Promise<ApplicationData[]> {
  const applications = await prisma.application.findMany({
    include: {
      user: true, // Include user data for each application
    },
  });

  // Transform the data to match the ApplicationData type
  return applications.map((app) => ({
    id: app.id,
    StudentId: app.user.StudentId.padStart(4, "0"), // Use User.StudentId and format as 4 digits
    applicationType: app.applicationType, // Map to string (e.g., "ID_CARD_REPLACEMENT")
    reason: app.reason,
    status: app.status.toLowerCase() as "pending" | "accepted" | "rejected", // Convert to lowercase to match the type
    email: app.user.Email || "N/A",
    Collage: app.Collage,
    Department: app.Department || "N/A",
    Program: app.Program || "N/A",
    createdAt: new Date(app.createdAt).toLocaleDateString(),
    Year: app.user.Year || "N/A", // Add the Year attribute from the user
    applicationDetail: app.id, // Use the application ID as a placeholder for the detail link
  }));
}

const AdminApplicationsPage = async () => {
  const data = await getApplications();

  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8 px-12">
          <div>
            <p className="text-3xl font-bold">Manage Applications</p>
            <p className="text-muted-foreground">
              Manage Student's Applications
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Applications with Corresponding Student Data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={data} />5
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminApplicationsPage;
