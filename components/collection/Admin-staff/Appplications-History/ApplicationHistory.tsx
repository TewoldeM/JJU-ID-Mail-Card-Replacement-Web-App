import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ApplicationHistory = () => {
    return (
      <div className="container">
        <h2 className="mt-12 text-3xl font-bold">History</h2>
        <Card className="col-span-12 mt-2 w-full">
          <CardHeader className="gap-2">
            <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
              {/* <HistoryperiodSelector
                period={period}
                setPeriod={setPeroid}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
              /> */}
              <div className="flex h-10 gap-2">
                <Badge
                  variant={"outline"}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                  Accepted
                </Badge>
                <Badge
                  variant={"outline"}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  Rejected
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        
      </div>
    );
}

export default ApplicationHistory