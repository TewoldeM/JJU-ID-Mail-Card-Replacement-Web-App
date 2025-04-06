import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const ManageStudents = () => {
  return (
    <div className="flex flex-col gap-16 justify-center items-center py-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl">Manage Student's</h1>
        <h2 className="text-xl">Students Signedup in the website</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-12">
        <Card className="p-6 border-emerald-300">
          <CardHeader className="text-2xl font-semibold text-green-500">
            Total User Found
          </CardHeader>
          <CardContent className="text-green-400 text-2xl font-semibold">
            1000
          </CardContent>
        </Card>
        <Card className="p-6 border-red-700">
          <CardHeader className="text-2xl font-semibold text-red-600">
            Total Deleted user
          </CardHeader>
          <CardContent className="text-red-500 text-2xl font-semibold">
            50
          </CardContent>
        </Card>
        <Card className="p-6 text-red-400 border-red-400">
          <CardHeader className="text-2xl font-semibold">
            Total Blocked user
          </CardHeader>
          <CardContent className="text-red-300 text-2xl font-semibold">
            25
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-row gap-12">
        <Link href={"./ManageStudents/Add-Students"}>
          <Button
            variant={"outline"}
            className="border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-900 dark:hover:bg-emerald-700 hover:text-white"
          >
            Add Student for the App
          </Button>
        </Link>
        <Link href={"./ManageStudents/Students"}>
          <Button
            variant={"outline"}
            className="border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-900 dark:hover:bg-emerald-700 hover:text-white"
          >
            Student-List
          </Button>
        </Link>{" "}
        <Link href={"Admin/SampleDB/add-student"}>
          <Button
            variant={"outline"}
            className="border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-900 dark:hover:bg-emerald-700 hover:text-white"
          >
            Add-student-for-Sample-DB
          </Button>
        </Link>{" "}
        <Link href={".Admin/SampleDB/Students"}>
          <Button
            variant={"outline"}
            className="border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-900 dark:hover:bg-emerald-700 hover:text-white"          >
            StudentList-of-Sample-DB
          </Button>
        </Link>{" "}
      </div>
    </div>
  );
};

export default ManageStudents;
