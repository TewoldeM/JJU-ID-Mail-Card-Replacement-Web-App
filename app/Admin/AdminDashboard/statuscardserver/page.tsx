"use client";

import Statuscards from "@/components/collection/Admin-staff/Statuscards";
import SkeletonWrapper from "@/components/collection/SkeletonWrapper";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

interface Counts {
  pending: number;
  accepted: number;
  rejected: number;
}
const ServerStatuscards = ({ dateRange }: { dateRange: DateRange }) => {
  const [counts, setCounts] = useState<Counts>({
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const { from, to } = dateRange;
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(
          `/api/applications/ApplicationCount?from=${
            from?.toISOString() ?? ""
          }&to=${to?.toISOString() ?? ""}`
        );
        if (!response.ok) throw new Error("Failed to fetch counts");
        const data = await response.json();
        setCounts(data);
      } catch (error) {
        console.error("Error fetching application counts:", error);
        setCounts({ pending: 0, accepted: 0, rejected: 0 });
      }
    };

    if (from && to) {
      fetchCounts();
    }
  }, [from, to]);

  return (
    // you have to do the loading state by using ReactQuery
    <SkeletonWrapper isLoading={false}> 
        <Statuscards counts={counts} />
    </SkeletonWrapper>
  
  )
};

export default ServerStatuscards;
