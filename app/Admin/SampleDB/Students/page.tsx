"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery,} from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/collection/Admin-staff/SampleDB/data-table";
import { columns } from "@/components/collection/Admin-staff/SampleDB/column";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ValidStudent {
  Id: string;
  FirstName: string;
  LastName: string;
  StudentId: string;
  Year: string;
  PhoneNumber: string | null;
  Email: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  Collage: string;
  Department: string;
  Program: string;
}

interface StudentsResponse {
  students: ValidStudent[];
}

const SkeletonWrapper = () => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} className="h-12 w-full" />
    ))}
  </div>
);

const StudentList = () => {
  const { data, isLoading, isError, error } = useQuery<StudentsResponse>({
    queryKey: ["valid-students"],
    queryFn: async () => {
      const response = await fetch(
        "/api/auth/admin/SampleDB/SampleDB-Students",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please sign in as an admin.");
        }
        throw new Error("Failed to fetch students.");
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-full mx-auto mt-10 px-6">
        <SkeletonWrapper />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-full mx-auto mt-10 px-6 text-center">
        <p className="text-red-500">
          {error?.message || "Something went wrong."}
        </p>
        <Link href="/sign-in">
          <Button className="mt-4 bg-gray-700 hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-950 text-white">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8 px-12">
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-bold">JJU Students List</p>
            <p className="text-muted-foreground">
             This is Sample DataBase of JJU
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-full mx-auto mt-10 px-6">
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>
              <h1 className="text-3xl font-bold">You can Manage students</h1>
            </CardTitle>
            <CardDescription>
              <h3>This is the list of student from the JJU main Database, you can add students</h3>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <DataTable
              columns={columns}
              data={(data?.students || []).map((student) => ({
                ...student,
                CreatedAt: new Date(student.CreatedAt).toISOString(),
                UpdatedAt: new Date(student.UpdatedAt).toISOString(),
              }))}
            />
          </CardContent>
        </Card>
        <div className="mb-6">
          <Link href="/Admin/SampleDB/Add-student">
            <Button className="bg-green-600 text-white hover:bg-green-700">
              🧪 Add Student (JJU DB)
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default StudentList;
