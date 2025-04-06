"use client";
import React from "react";
import { toast } from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";

// Skeleton Wrapper Component
const SkeletonWrapper = () => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} className="h-12 w-full" />
    ))}
  </div>
);

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
  IsLocked: boolean; // Indicates if the student is blocked/banned
}

const StudentList = () => {
  // Fetch Students Using React Query
  const {data: students,isLoading,isError,error,} = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await fetch("/api/auth/admin/Manage-Student/Students");
      if (!response.ok) {
        throw new Error("Failed to fetch students.");
      }
      return response.json();
    },
  });

  // Mutation for Deleting a Student
  const deleteStudentMutation = useMutation({
    mutationFn: async (StudentId: string) => {
      const response = await fetch("/api/auth/admin/Manage-Student/Students/${StudentId}",{  method: "DELETE"}
      );
      if (!response.ok) {
        throw new Error("Failed to delete student.");
      }
    },
    onSuccess: (_, StudentId) => {
      toast.success("Student deleted successfully.");
    },
    onError: (err: any) => {
      console.error("Error deleting student:", err);
      toast.error(err.message || "Failed to delete student.");
    },
  });

  // Mutation for Blocking/Unblocking a Student
  const blockUnblockStudentMutation = useMutation({
    mutationFn: async ({ StudentId, IsLocked }: { StudentId: string; IsLocked: boolean }) => {
      const response = await fetch(
        "/api/auth/admin/Manage-Student/Students/${StudentId}/block",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ IsLocked }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to block/unblock student.");
      }
    },
    onSuccess: (_, { StudentId, IsLocked }) => {
      toast.success(`Student ${IsLocked ? "blocked" : "unblocked"} successfully.`);
    },
    onError: (err: any) => {
      console.error("Error blocking/unblocking student:", err);
      toast.error(err.message || "Failed to block/unblock student.");
    },
  });

  // Handle Delete Action
  const handleDelete = (StudentId: string) => {
    deleteStudentMutation.mutate(StudentId);
  };

  // Handle Block/Unblock Action
  const handleBlockUnblock = (StudentId: string, currentStatus: boolean) => {
    blockUnblockStudentMutation.mutate({
      StudentId,
      IsLocked: !currentStatus,
    });
  };

  if (isLoading) {
    return <SkeletonWrapper />;
  }

  if (isError) {
    return <div className="text-center mt-10">Error: {error?.message || "Something went wrong."}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Student List</h1>
      <Table>
        <TableCaption>A list of all students in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Collage</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students && students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student.Id}>
                <TableCell>{student.FirstName}</TableCell>
                <TableCell>{student.LastName}</TableCell>
                <TableCell>{student.Email}</TableCell>
                <TableCell>{student.StudentId}</TableCell>
                <TableCell>{student.Collage}</TableCell>
                <TableCell>{student.Department || "N/A"}</TableCell>
                <TableCell>{student.Program || "N/A"}</TableCell>
                <TableCell>{student.Year}</TableCell>
                <TableCell>
                  {student.IsLocked ? (
                    <span className="text-red-500">Blocked</span>
                  ) : (
                    <span className="text-green-500">Active</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(student.Id)}
                    disabled={deleteStudentMutation.isPending}
                  >
                    Delete
                  </Button>
                  <Button
                    variant={student.IsLocked ? "outline" : "secondary"}
                    size="sm"
                    className="ml-2"
                    onClick={() => handleBlockUnblock(student.Id, student.IsLocked)}
                    disabled={blockUnblockStudentMutation.isPending}
                  >
                    {student.IsLocked ? "Unblock" : "Block"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                No students found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentList;