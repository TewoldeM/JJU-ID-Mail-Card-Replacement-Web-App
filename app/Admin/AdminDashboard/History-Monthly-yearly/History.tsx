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
import CountUp from "react-countup";
import { Period, Timeframe } from "@/app/lib/contants/HistoryType";
import SkeletonWrapper from "@/components/collection/SkeletonWrapper";

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
      const data = await response.json();
      console.log("History data:", data); // Debug: Log the API response
      return data;
    },
  });

  const dataAvailable =
    Array.isArray(historyDataQuery.data) && historyDataQuery.data.length > 0;
  const hasNonZeroData =
    dataAvailable &&
    historyDataQuery.data.some(
      (item: { Accepted: number; Rejected: number }) =>
        item.Accepted > 0 || item.Rejected > 0
    );

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
                    dataKey={(data) => {
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

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  const { Accepted, Rejected } = data;
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

{
  /* Here's a breakdown of the chart components: 
         > BarChart: This is the main
          component that renders the chart. 
         >CartesianGrid: This component
          renders the grid lines on the chart. 
        
        > XAxis and YAxis: These components
          render the x-axis and y-axis labels and lines. 
         > Bar: This component
          renders the bars for the income and expense data. Tooltip: This
          component renders a tooltip that displays additional information when
          a bar is hovered. */
}

//?The toLocaleString() method is used to format a date object into
//a string according to the locale and options provided.
//? In this case, month:"long" means that the month should be displayed
// in its full name (e.g., "January", "February", etc.).
//?So, when timeframe === "year", this statement returns the month name
// in its full form, without the day or year.
//Example Output:
//If the date is January 1, 2022, the output would be "January".
//?So, when timeframe !== "year", this statement returns the day of the month as a two-digit number, without the month or year.

// Example Output:

// If the date is January 1, 2022, the output would be "01".
// If the date is January 12, 2022, the output would be "12".
// If the date is February 1, 2022, the output would be "01".
//?The dataAvailable variable is a boolean that checks if the historyDataQuery.data array exists and has a length greater than 0.
// If the data array exists and has at least one item, dataAvailable is set to true; otherwise, it is set to false.
//?The dataAvailable variable is used to conditionally render the chart based on whether data is available for the selected period.
// If data is available, the chart is rendered; otherwise, a message is displayed indicating that no data is available for the selected period.
//?The ResponsiveContainer component is used to make the chart responsive to the size of its container.
// The width and height props are set to "100%" and 300, respectively, to ensure that the chart fills the entire width of the container and has a fixed height of 300 pixels.
//?The BarChart component is the main component that renders the bar chart.
// The height prop is set to 300 to specify the height of the chart.
// The data prop is set to historyDataQuery.data to provide the data for the chart.
// The barCategoryGap prop is set to 5 to specify the gap between the bars in the chart.
//?The CartesianGrid component is used to render the grid lines on the chart.
// The strokeDasharray prop is set to "5 5" to specify the pattern of the grid lines.
// The strokeOpacity prop is set to "0.2" to specify the opacity of the grid lines.
// The vertical prop is set to false to render only horizontal grid lines.
//?The XAxis component is used to render the x-axis labels and lines on the chart.
// The stroke prop is set to "#888888" to specify the color of the x-axis lines.
// The fontSize prop is set to 12 to specify the font size of the x-axis labels.
// The tickLine prop is set to false to hide the tick lines on the x-axis.
// The axisLine prop is set to false to hide the x-axis line.
// The padding prop is set to { left: 5, right: 5 } to add padding to the left and right of the x-axis labels.
// The dataKey prop is set to a function that formats the date based on the timeframe selected.
//?The YAxis component is used to render the y-axis labels and lines on the chart.
// The stroke prop is set to "#888888" to specify the color of the y-axis lines.
// The fontSize prop is set to 12 to specify the font size of the y-axis labels.
// The tickLine prop is set to false to hide the tick lines on the y-axis.
// The axisLine prop is set to false to hide the y-axis line.
//?The Bar component is used to render the bars for the income and expense data.
// The dataKey prop is set to "income" to specify the key for the income data.
// The label prop is set to "Income" to specify the label for the income bars.
// The fill prop is set to "url(#incomeBar)" to specify the fill color for the income bars using a linear gradient.
// The radius prop is set to 4 to specify the radius of the bars.
// The className prop is set to "cursor-pointer" to specify the cursor style for the bars.
//?The Tooltip component is used to render a tooltip that displays additional information when a bar is hovered.
// The cursor prop is set to { opacity: 0.1 } to specify the opacity of the cursor when hovering over the bars.
// The content prop is set to a function that renders the custom tooltip component and passes the formatter function to it.
//?The CustomTooltip function is a custom tooltip component that renders the tooltip content.
// The function receives the active, payload, and formatter props as arguments.
// The active prop indicates whether the tooltip is active, and the payload prop contains the data for the tooltip.
// The formatter prop is a function that formats the tooltip values.
//?The CustomTooltip function checks if the tooltip is active and if there is payload data available.
// If the tooltip is not active or there is no payload data, the function returns null.
// Otherwise, the function extracts the data object from the payload and retrieves the expense and income values from the data.
//?The CustomTooltip function returns a div element that contains the tooltip content.
// The tooltip displays the expense and income values with corresponding labels.
// The values are formatted using the CountUp component to animate the number count.
//?The TooltipArrow function is a helper component that renders a single line of the tooltip content.
// The function receives the label, value, bgColor, textColor, and formatter props as arguments.
// The label prop specifies the label for the tooltip content.
// The value prop specifies the value to be displayed.
// The bgColor prop specifies the background color of the tooltip arrow.
// The textColor prop specifies the text color of the tooltip content.
// The formatter prop is a function that formats the tooltip values.
