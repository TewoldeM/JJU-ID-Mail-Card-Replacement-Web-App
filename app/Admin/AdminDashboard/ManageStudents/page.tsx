"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

interface Student {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  StudentId: string;
  Collage: string;
  Department?: string;
  Program?: string;
  Year: string;
  IsLocked: boolean;
}

interface StudentsResponse {
  students: Student[];
  totalStudents: number;
  totalBlocked: number;
  totalDeleted: number;
}

const ManageStudents = () => {
  const { data, isLoading, isError } = useQuery<StudentsResponse>({
    queryKey: ["totalStudents", "totalBlocked", "totalDeleted"],
    queryFn: async () => {
      const res = await fetch("/api/auth/admin/Manage-Student/Students");
      if (!res.ok) throw new Error("Failed to fetch students");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center text-lg text-gray-600 dark:text-white">
        Loading students...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-red-600 text-xl font-medium h-screen">
          Error loading student data.
        </h1>
      </div>
    );
  }

  // Safely destructure with defaults to ensure 0 is displayed
  const { totalStudents = 0, totalBlocked = 0, totalDeleted = 0 } = data || {};

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 space-y-12">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Manage Students
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Overview of registered and restricted students
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="border-green-300 shadow-md h-48 w-full max-w-md mx-auto">
          <CardHeader className="text-green-600 text-xl font-semibold">
            Total Students
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-500">
            {totalStudents}
          </CardContent>
        </Card>

        <Card className="border-red-500 shadow-md h-48 w-full max-w-md mx-auto">
          <CardHeader className="text-yellow-600 text-xl font-semibold">
            Blocked Students
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-500">
            {totalBlocked}
          </CardContent>
        </Card>

        <Card className="border-gray-500 shadow-md h-48 w-full max-w-md mx-auto">
          <CardHeader className="text-gray-600 text-xl font-semibold">
            Deleted Students
          </CardHeader>
          <CardContent className="text-3xl font-bold text-gray-500">
            {totalDeleted}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/Admin/AdminDashboard/ManageStudents/Add-Students">
          <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
            ➕ Add Student
          </Button>
        </Link>

        <Link href="/Admin/AdminDashboard/ManageStudents/Students">
          <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
            📋 View Students
          </Button>
        </Link>
      </div>

      {/* Additional Info */}
      <div className="text-center mt-10 py-12">
        <Card className="py-12 flex flex-col justify-center gap-8">
          <CardTitle>
            <p className="text-gray-800 dark:text-gray-200 text-3xl">
              Jigijiga University, Students List
            </p>
            <p className="text-gray-500 dark:text-gray-300 text-sm mt-4">
              This is a sample database of students at Jigijiga University. The
              data is not real and is used for demonstration purposes only.
            </p>
          </CardTitle>
          <CardContent>
            <Button className="bg-emerald-700 text-white hover:bg-emerald-800">
              <Link href="/Admin/SampleDB/Students">
                📋 View All JJU Students
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageStudents;
