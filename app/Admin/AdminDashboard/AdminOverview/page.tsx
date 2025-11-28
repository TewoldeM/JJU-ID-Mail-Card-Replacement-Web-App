"use client"; // Required for useState and interactivity
import { useState } from "react";
import { startOfMonth } from "date-fns";
import ServerStatuscards from "../statuscardserver/page";
import AdminWorkingProgressServer from "../GetApplicationProgress/page"; // Adjust path if needed
import { differenceInDays } from "date-fns";
import { toast } from "sonner";
import { DateRangePicker } from "@/components/ui/DateRangerPicker";
import { MAX_DATE_RANGE_DAYS } from "@/app/lib/contants/MAX_DATE_RANGE_DAYS";

interface AdminOverviewProps {
  searchParams?: { from: Date; to: Date }; // Optional initial date range from server
}

const AdminOverview = ({ searchParams }: AdminOverviewProps) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: searchParams?.from || startOfMonth(new Date()),
    to: searchParams?.to || new Date(),
  });

  return (
    <div className="px-8">
      <div className="container flex flex-col lg:flex-row md:flex-row flex-wrap gap-0 py-0 lg:items-end lg:justify-between lg:gap-2 lg:py-2 ">
        <h2 className="text-3xl font-bold ml-6 mt-2">Overview</h2>
        <div className="flex items-center gap-3 mt-12 mb-1 ml-4">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            onUpdate={(value) => {
              const { from, to } = value.range || {};
              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <ServerStatuscards dateRange={dateRange} />
      <AdminWorkingProgressServer from={dateRange.from} to={dateRange.to} />
    </div>
  );
};

export default AdminOverview;
