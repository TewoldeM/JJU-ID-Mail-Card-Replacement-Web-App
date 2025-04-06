import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AdminWorkingProgressProps {
  acceptedPercentage: number;
  rejectedPercentage: number;
}

const AdminWorkingProgress = ({acceptedPercentage,rejectedPercentage,}: AdminWorkingProgressProps) => {
  return (
    <div className="flex w-full flex-wrap gap-8 md:flex-nowrap py-4 px-2">
      <Card className="h-70 w-full col-span-6">
        <CardHeader>
          <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col text-2xl ">
            <h1 className="text-green-500 ml-4">
              Accepted: {acceptedPercentage}%
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col gap-4 p-4">
            <Progress
              value={acceptedPercentage}
              className="bg-green-400 h-3"
              style={{ backgroundColor: "rgba(0, 255, 0, 0.3)" }}
            >
              <div
                className="h-full bg-green-700 transition-all"
                style={{ width: `${acceptedPercentage}%` }}
              />
            </Progress>
          </div>
        </CardContent>
      </Card>
      <Card className="h-80 w-full col-span-6">
        <CardHeader>
          <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col text-2xl ">
            <h1 className="text-red-500 ml-4">Rejected: {rejectedPercentage}%</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col gap-4 p-4">
            <Progress
              value={rejectedPercentage}
              className="bg-red-500 h-3"
              style={{ backgroundColor: "rgba(255, 0, 0, 0.3)" }}
            >
              <div
                className="h-full bg-red-700 transition-all"
                style={{ width: `${rejectedPercentage}%` }}
              />
            </Progress>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWorkingProgress;
