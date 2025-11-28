// components/Statuscards.tsx
"use client";

import { Card } from "@/components/ui/card";
import { LoaderPinwheel, CheckCircle, XCircle } from "lucide-react";
import React from "react";
import CountUp from "react-countup";
interface Counts {
  pending: number;
  accepted: number;
  rejected: number;
}

interface StatuscardsProps {
  counts: Counts;
}

const Statuscards = ({ counts }: StatuscardsProps) => {
  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap ">
        <div className="flex gap-8 md:gap-32 md:flex-row flex-col justify-center items-center p-2 mb-2">
          <div>
            <StatusCard
              title="Pending"
              value={counts.pending}
              icon={
                <LoaderPinwheel
                  size={50}
                  className="h-28 w-36 items-center rounded-lg p-2 text-yellow-500 bg-yellow-400/10"
                />
              }
            />
          </div>
          <div>
            <StatusCard
              title="Accepted"
              value={counts.accepted}
              icon={
                <CheckCircle
                  size={50}
                  className="h-28 w-36 items-center rounded-lg p-2 text-green-500 bg-green-400/10"
                />
              }
            />
          </div>
          <div>
            <StatusCard
              title="Rejected"
              value={counts.rejected}
              icon={
                <XCircle
                  size={50}
                  className="h-28 w-36 items-center rounded-lg p-2 text-red-500 bg-red-400/10"
                />
              }
            />
          </div>
  
      </div>
    </div>
  );
};

export default Statuscards;

function StatusCard({ title,value,icon, }: {  title: string;  value: number;  icon: React.ReactNode;}) {
  return (
      <Card className="flex items-center justify-center gap-2 py-2 px-12 lg:px-20 lg:py-8 ">
        {icon}
        <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground text-xl">{title}</p>
          <CountUp
            preserveValue
            redraw={false}
            end={value}
            decimals={0} // No decimals since we're counting applications
            className="text-2xl lg:text-4xl"
          />
        </div>
      </Card>
  );
}
