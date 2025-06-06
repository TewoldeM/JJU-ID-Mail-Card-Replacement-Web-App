import UserInfoTable from "@/components/collection/Admin-staff/ApplicationDetailfortheadmin/page";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PrismaClient, FileCategory } from "@prisma/client";

const prisma = new PrismaClient();

interface ApplicationDetailfortheadminProps {
  params: { id: string };
}

const ApplicationDetailfortheadmin = async ({
  params,
}: ApplicationDetailfortheadminProps) => {
  const id = params.id; // This is fine; params is not a Promise
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      user: true, // Include user data
      files: {
        where: {
          fileCategory: FileCategory.PHOTOGRAPH, // Only include files categorized as PHOTOGRAPH
        },
        take: 1, // Limit to one photo per application
      },
    },
  });

  if (!application) {
    return (
      <div className="h-screen text-2xl text-red-400">
        Application not found
      </div>
    );
  }

  // Prepare data for the table
  const userData = {
    FirstName: application.user.FirstName,
    LastName: application.user.LastName,
    Email: application.user.Email,
    PhoneNumber: application.user.PhoneNumber || "N/A",
    StudentId: application.user.StudentId.padStart(4, "0"),
    Year: application.user.Year || "N/A",
    Collage: application.Collage,
    Department: application.Department || "N/A",
  };

  const applicationContext = {
    id: application.id,
    applicationType: application.applicationType,
    reason: application.reason,
    createdAt: new Date(application.createdAt).toLocaleDateString(),
    status: application.status.toLowerCase() as
      | "pending"
      | "accepted"
      | "rejected",
  };

  const photo = application.files[0]?.fileData || null; // Base64-encoded photo data or null

  const handleAccept = async () => {
    // Handle accept logic here
  };

  const handleReject = async () => {
    // Handle reject logic here
  };

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader>
          <h1 className="text-2xl font-bold mb-4">Application Details</h1>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Application Type:</strong>
            <span className="text-gray-200">
              {applicationContext.applicationType}
            </span>
          </p>
          <p>
            <strong>Reason:</strong> {applicationContext.reason}
          </p>
          <p>
            <strong>Created At:</strong> {applicationContext.createdAt}
          </p>
          <p>
            <strong>Status:</strong> {applicationContext.status}
          </p>
          <div className="mt-4">
            <strong>Submitted Photo:</strong>
            {photo ? (
              <img
                src={photo}
                alt="Student submitted photo"
                className="mt-2 h-32 w-32 object-cover rounded"
              />
            ) : (
              <span className="mt-2 block text-gray-400">
                No photo submitted
              </span>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="mt-8">
        <UserInfoTable userData={userData} application={applicationContext} />
      </div>
      <div className="flex flex-col md:flex-row mt-8 gap-12 ml-6">
        <Button className="bg-gray-800 hover:bg-gray-900 text-white">
          Back to Dashboard
        </Button>
        <Button className="bg-gray-800 hover:bg-gray-900 text-white">
          Back to Applications
        </Button>
      </div>
    </div>
  );
};

export default ApplicationDetailfortheadmin;
