"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// Match the Student interface from StudentList
export type StudentsList = {
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
};

// Factory function to generate columns with action handlers
export const columns = (
 
  handleBlockUnblock: (StudentId: string, currentStatus: boolean) => void
): ColumnDef<StudentsList>[] => [
  {
    accessorKey: "StudentId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const StudentId = row.getValue("StudentId") as string;
      return StudentId.padStart(4, "0"); // Ensure 4-digit display
    },
  },
  {
    accessorKey: "FirstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        First Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "LastName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Collage",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Collage
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Department",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Department
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.getValue("Department") || "N/A",
  },
  {
    accessorKey: "Program",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Program
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.getValue("Program") || "N/A",
  },
  {
    accessorKey: "Year",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Year
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "IsBlocked",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={
          row.getValue("IsBlocked") ? "text-red-500" : "text-green-500"
        }
      >
        {row.getValue("IsBlocked") ? "Blocked" : "Active"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex space-x-2">
          <Button
            variant={student.IsBlocked ? "outline" : "secondary"}
            size="sm"
            onClick={() =>
              handleBlockUnblock(student.StudentId, student.IsBlocked)
            }
          >
            {student.IsBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      );
    },
  },
];
