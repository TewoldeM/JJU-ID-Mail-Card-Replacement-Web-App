// components/collection/Admin-staff/columns.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationType } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

// Renamed to avoid confusion with the Prisma model
export type ApplicationData = {
  id: string;
  StudentId: string; // Will be formatted as 4-digit number
  applicationType: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
  email: string;
  Collage: string;
  Department: string;
  Program: string;
  createdAt: string;
  Year: string; // Add the Year attribute from the user
  applicationDetail: string; // Add a field for the detail link or identifier
};

export const columns: ColumnDef<ApplicationData>[] = [
  {
    accessorKey: "StudentId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const studentId = row.getValue("StudentId") as string;
      return studentId.padStart(4, "0"); // Ensure 4-digit display with leading zeros
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "pending"
        | "accepted"
        | "rejected";
      return (
        <Badge
          className={`${
            status === "accepted"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : status === "rejected"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-800 hover:bg-gray-900 text-white"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reason
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "Collage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Collage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "Department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "Program",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Program
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "applicationType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
         ApplicationType
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "Year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Button variant="ghost" className="ml-4">
        {row.getValue("Year")}
      </Button>
    ),
  },
  {
    accessorKey: "applicationDetail",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Application Detail
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const router = useRouter();
      const id = row.original.id; // Use the application ID for the detail link
      return (
        <Button
          variant="outline"
          size="sm"
          className="ml-8"
          onClick={() =>
            router.push(`/Admin/ApplicationDetailfortheadmin/${id}`)
          } // Dynamic route with id
        >
          <Eye className="h-4 w-4 mr-2" /> View
        </Button>
      );
    },
  },
];

  
