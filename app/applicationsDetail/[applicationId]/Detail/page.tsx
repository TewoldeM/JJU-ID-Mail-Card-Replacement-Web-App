
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import user from '@prisma/client';

const prisma = new PrismaClient();

export default async function ApplicationDetail({params}: { params: {  applicationId: string };}) {
  const application = await prisma.application.findUnique({
    where: { id: params.applicationId },
    include: { user: true, files: true },
  });
console.log("application detail",application?.user)
  if (!application) {
    return <div className="h-screen">Application not found</div>;
  }

  return (
    <div className="container mx-auto p-4 gap-2">
      <h1 className="text-3xl font-bold mb-6">Application Detail</h1>
      <Card className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-900 dark:bg-gray-900 text-white">
              <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                First Name
              </th>
              <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                Last Name
              </th>
              <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                Student ID
              </th>

              <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left">
                Application Type
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
            <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                {application.user.FirstName || "N/A"}
              </td>
              <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                {application.user.LastName || "N/A"}
              </td>
              <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                {application.user.StudentId || "N/A"}
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
                {application.files.length > 0 ? (
                  <ul>
                    {/* {application.files.map((file) => (
                      <li key={file.id}>{file.name || "Unnamed File"}</li>
                    ))} */}
                  </ul>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
      <Link href="/StudentDashboard">
        <Button
          variant={"outline"}
          className="mt-2 border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
        >
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}