// HistoryperiodSelector.tsx
"use client";
import { Period, Timeframe } from "@/app/lib/contants/HistoryType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface HistoryperiodSelectorProps {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}

const HistoryperiodSelector = ({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: HistoryperiodSelectorProps) => {
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  return (
    <div className="flex gap-2">
      <Select
        value={timeframe}
        onValueChange={(value: Timeframe) => setTimeframe(value)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={period.year.toString()}
        onValueChange={(value) =>
          setPeriod({ ...period, year: parseInt(value) })
        }
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {timeframe === "month" && (
        <Select
          value={period.month.toString()}
          onValueChange={(value) =>
            setPeriod({ ...period, month: parseInt(value) })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default HistoryperiodSelector;
