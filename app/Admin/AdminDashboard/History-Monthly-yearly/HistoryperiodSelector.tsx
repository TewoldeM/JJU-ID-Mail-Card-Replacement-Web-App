import { Period, Timeframe } from "@/app/lib/contants/HistoryType";
import SkeletonWrapper from "@/components/collection/SkeletonWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { GetHistoryDateResponseType } from "@/app/api/applications/History-Data/route";
interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}
function HistoryperiodSelector({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: Props) {
  const historyperiods = useQuery<GetHistoryDateResponseType>({
    queryKey: ["overview", "history", "period"],
    queryFn: () =>
      fetch(`/api/applications/History-Period`).then((res) => res.json()),
  });
  return (
    <div className="flex flex-row items-center gap-4">
      <SkeletonWrapper isLoading={historyperiods.isFetching} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-row items-center gap-2">
        <SkeletonWrapper isLoading={historyperiods.isFetching}>
          {/* <h1>we are waiting the year Selector</h1> */}
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyperiods.data || []}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper
            isLoading={historyperiods.isFetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} years={[]} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}
export default HistoryperiodSelector;
interface YearPeriodSelector {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryDateResponseType;
}
function YearSelector({ period, years, setPeriod }: YearPeriodSelector) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({ month: period.month, year: parseInt(value) });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year:any) => (
          // const year = yearData.year; // Assuming yearData has a 'year' property
          <SelectItem key={year} value={year.toString()}>
            {year.toString()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MonthSelector({ period, setPeriod }: YearPeriodSelector) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({ year: period.year, month: parseInt(value) });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString(
            "default",
            { month: "long" }
          );
          return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
