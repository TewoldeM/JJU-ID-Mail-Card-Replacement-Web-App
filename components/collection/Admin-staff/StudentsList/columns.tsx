// components/collection/Admin-staff/columns.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationType, CardType, Role } from "@prisma/client";
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
export type UsersList = {
  Id: string;                       
  FirstName:string           
  LastName:  string                   
  PhoneNumber: number             
  Year:   number             
  StudentId:  number               
  Email:  string                   
  Collage:string             
  Department:string          
  Program :string            
  Card: CardType            
  Roles:Role           
  CreatedAt: Date           
  Applications: ApplicationType
}
export const columns: ColumnDef<UsersList>[] = [
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
    accessorKey: "firstname",
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
  // {
  //   accessorKey: "applicationDetail",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost">
  //         Application Detail
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const router = useRouter();
  //     const id = row.original.id; // Use the application ID for the detail link
  //     return (
  //       <Button
  //         variant="outline"
  //         size="sm"
  //         className="ml-8"
  //         onClick={() =>
  //           router.push(`/Admin/ApplicationDetailfortheadmin/${id}`)
  //         } // Dynamic route with id
  //       >
  //         <Eye className="h-4 w-4 mr-2" /> View
  //       </Button>
  //     );
  //   },
  // },
];

  
