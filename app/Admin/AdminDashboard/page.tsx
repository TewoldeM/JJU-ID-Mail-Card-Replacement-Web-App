import { Button } from "@/components/ui/button";
import { startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import Link from "next/link";
import AdminOverview from "./AdminOverview/page";
import History from "./History-Monthly-yearly/History";

const Adminpage = async () => {
  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8 px-4">
          <p className="text-3xl font-bold ml-2">Hello, Admin 🙋‍♂️</p>
          <div className="flex items-center gap-3">
            {/* Link for View Applications */}
            <Link href="/Admin/Applications-Data-Table">
              <Button
                variant={"outline"}
                className="border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-900 dark:hover:bg-emerald-700 hover:text-white"
              >
                View Applications
              </Button>
            </Link>

            {/* Link for Manage Students */}
            <Link href="/Admin/AdminDashboard/ManageStudents">
              <Button
                variant={"outline"}
                className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
              >
                Manage Student
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <AdminOverview />
      <History />
    </div>
  );
};

export default Adminpage;
