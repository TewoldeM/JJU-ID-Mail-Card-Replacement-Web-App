"use client";
import React from "react";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/collection/Admin-staff/StudentsList/data-table";
import { columns } from "@/components/collection/Admin-staff/StudentsList/columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SkeletonWrapper = () => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} className="h-12 w-full" />
    ))}
  </div>
);

interface StudentsList {
  PhoneNumber: string;
  Card: string;
  Roles: string[];
  CreatedAt: string;
  Applications: string[];
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
  IsBlocked: boolean;
}

interface StudentsResponse {
  students: StudentsList[];
  totalStudents: number;
  totalBlocked: number;
}

const StudentList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<StudentsResponse>({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await fetch("/api/auth/admin/Manage-Student/Students");
      if (!response.ok) {
        throw new Error("Failed to fetch students.");
      }
      return response.json();
    },
  });


  const blockUnblockStudentMutation = useMutation({
    mutationFn: async ({
      StudentId,
      IsBlocked,
    }: {
      StudentId: string;
      IsBlocked: boolean;
    }) => {
      const response = await fetch("/api/auth/admin/Manage-Student/Students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ StudentId, IsBlocked }), // Use IsBlocked for permanent blocking
      });
      if (!response.ok) {
        throw new Error("Failed to block/unblock student.");
      }
    },
    onSuccess: (_, { IsBlocked }) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(
        `Student ${IsBlocked ? "blocked" : "unblocked"} successfully.`
      );
    },
    onError: (err) => {
      console.error("Error blocking/unblocking student:", err);
      toast.error(err.message || "Failed to block/unblock student.");
    },
  });


  const handleBlockUnblock = (StudentId: string, currentStatus: boolean) => {
    blockUnblockStudentMutation.mutate({
      StudentId,
      IsBlocked: !currentStatus,
    });
  };

  if (isLoading) {
    return <SkeletonWrapper />;
  }

  if (isError) {
    return (
      <div className="text-center mt-10">
        Error: {error?.message || "Something went wrong."}
      </div>
    );
  }

  // Pass handleDelete and handleBlockUnblock to columns via a factory function if needed
  const columnsWithActions = columns(handleBlockUnblock).map((column) => ({
    ...column,
    // Add actions or modify columns here if needed
  }));

  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8 px-12">
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-bold">Students Found in the System</p>
            <p className="text-muted-foreground">
              List of the student who are signed up
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-full mx-auto mt-10 px-6">
        <h1 className="text-3xl font-bold mb-6">Student List</h1>
        <DataTable
          columns={columnsWithActions}
          data={(data?.students || []).map((student) => ({
            ...student,
          }))}
        />
        <div className="mb-6">
          <Link href="/Admin/AdminDashboard/ManageStudents/Add-Students">
            <Button className="bg-green-600 text-white hover:bg-green-700">
              🧪 Add Student
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default StudentList;
