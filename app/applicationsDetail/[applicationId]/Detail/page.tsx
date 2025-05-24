import ApplicationDetailTable from "@/components/collection/Admin-staff/ApplicationDetailTable";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { user: true, files: true },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 px-4 pt-4">Application Detail</h1>
      <ApplicationDetailTable application={application} />
    </div>
  );
}
