"use client"; // Needs to be a client component to use useQuery

import { useQuery } from "@tanstack/react-query";
import { GetApplicationsProgressResponseType } from "@/app/api/applications/GetApplicationProgress/route"; // Adjust path as needed
import AdminWorkingProgress from "../AdminWorkingProgress/page";
import { DateToUTCDate } from "@/app/lib/contants/DateToUTCDate";
import SkeletonWrapper from "@/components/collection/layouts/SkeletonWrapper";

interface AdminWorkingProgressServerProps {
  from: Date;
  to: Date;
}

const AdminWorkingProgressServer = ({
  from,
  to,
}: AdminWorkingProgressServerProps) => {
  // Fetch the data client-side using useQuery
  const statusQuery = useQuery<GetApplicationsProgressResponseType>({
    queryKey: ["overview", "status", "applications", from, to],
    queryFn: () =>
      fetch(
        `/api/applications/GetApplicationProgress?from=${DateToUTCDate(
          from
        )}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const data = statusQuery.data || {
    acceptedPercentage: 0,
    rejectedPercentage: 0,
  };

  return (
    <SkeletonWrapper isLoading={statusQuery.isFetching}>
      <AdminWorkingProgress
        acceptedPercentage={data.acceptedPercentage}
        rejectedPercentage={data.rejectedPercentage}
      />
    </SkeletonWrapper>
  );
};

export default AdminWorkingProgressServer;
