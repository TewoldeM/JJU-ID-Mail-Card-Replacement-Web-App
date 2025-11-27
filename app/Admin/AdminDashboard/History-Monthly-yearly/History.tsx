"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HistoryperiodSelector from "./HistoryperiodSelector";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { download, generateCsv, mkConfig } from "export-to-csv";
import CountUp from "react-countup";
import { Period, Timeframe } from "@/app/lib/contants/HistoryType";
import SkeletonWrapper from "@/components/collection/layouts/SkeletonWrapper";

// Define the CSV configuration
const getCsvConfig = (timeframe: Timeframe, period: Period) =>
  mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
    filename: `history_report_${period.year}${
      timeframe === "month"
        ? "_" +
          new Date(period.year, period.month).toLocaleString("default", {
            month: "long",
          })
        : ""
    }`,
  });

// Define the data structure for history data
interface HistoryData {
  year: number;
  month: number;
  day?: number;
  Accepted: number;
  Rejected: number;
}

const History = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(), // 0-based (e.g., April = 3)
    year: new Date().getFullYear(),
  });

  const historyDataQuery = useQuery({
    queryKey: ["overview", "history", timeframe, period],
    queryFn: async () => {
      const response = await fetch(
        `/api/applications/History-Data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch history data: ${response.statusText}`);
      }
      const data: HistoryData[] = await response.json();
      return data;
    },
  });

  const dataAvailable =
    Array.isArray(historyDataQuery.data) && historyDataQuery.data.length > 0;

  // Function to handle CSV export
  const handleExportCSV = (data: HistoryData[]) => {
    if (!data || data.length === 0) return; // Guard against empty data
    const exportData = data.map((item) => ({
      Date: new Date(item.year, item.month, item.day || 1).toLocaleString(
        "default",
        {
          month: timeframe === "year" ? "long" : "2-digit",
          day: timeframe === "month" ? "2-digit" : undefined,
          year: "numeric",
        }
      ),
      Accepted: item.Accepted,
      Rejected: item.Rejected,
      Total: item.Accepted + item.Rejected,
    }));
    const csv = generateCsv(getCsvConfig(timeframe, period))(exportData);
    download(getCsvConfig(timeframe, period))(csv);
  };

  return (
    <div className="container ml-2">
      <h2 className="mt-12 text-3xl font-bold ml-2">History</h2>
      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryperiodSelector
              period={period}
              setPeriod={setPeriod}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8 lg:flex"
              onClick={() => historyDataQuery.data && handleExportCSV(historyDataQuery.data)}
              disabled={!dataAvailable}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download Report as CSV
            </Button>
            <div className="flex h-10 gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                Accepted
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                Rejected
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {historyDataQuery.isError ? (
              <Card className="flex h-[300px] flex-col items-center justify-center bg-background p-2">
                Error loading data
                <p className="text-sm text-muted-foreground">
                  {historyDataQuery.error?.message || "An error occurred"}
                </p>
              </Card>
            ) : dataAvailable ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  height={300}
                  data={historyDataQuery.data}
                  barCategoryGap={5}
                >
                  <defs>
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#10b981" stopOpacity="1" />
                      <stop offset="1" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ef4444" stopOpacity="1" />
                      <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="5 5"
                    strokeOpacity="0.2"
                    vertical={false}
                  />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data: HistoryData) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeframe === "year") {
                        return date.toLocaleString("default", {
                          month: "long",
                        });
                      }
                      return date.toLocaleString("default", { day: "2-digit" });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Bar
                    dataKey="Accepted"
                    label="Accepted"
                    fill="url(#incomeBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Bar
                    dataKey="Rejected"
                    label="Rejected"
                    fill="url(#expenseBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => <CustomTooltip {...props} />}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Card className="flex h-[300px] flex-col items-center justify-center bg-background p-2">
                No data for the selected period
                <p className="text-sm text-muted-foreground">
                  Try selecting a different period or there are no applications
                  in the selected time period
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: HistoryData }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  const { Accepted, Rejected } = data || { Accepted: 0, Rejected: 0 };
  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      <TooltipArrow
        label="Accepted"
        value={Accepted}
        bgColor="bg-emerald-500"
        textColor="text-emerald-500"
      />
      <TooltipArrow
        label="Rejected"
        value={Rejected}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />
      <TooltipArrow
        label="Total"
        value={Rejected + Accepted}
        bgColor="bg-gray-100"
        textColor="text-foreground"
      />
    </div>
  );
}

interface ToolTipProps {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
}

function TooltipArrow({ label, value, bgColor, textColor }: ToolTipProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
