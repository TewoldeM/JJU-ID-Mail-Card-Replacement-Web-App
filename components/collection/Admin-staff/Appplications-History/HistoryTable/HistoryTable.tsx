// // components/collection/Admin-staff/Appplications-History.tsx
// "use client";

// import {
//   ColumnDef,
//   ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   SortingState,
//   useReactTable,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import { DateToUTCDate } from "@/lib/helpers";
// import { useQuery } from "@tanstack/react-query";
// import React, { useMemo, useState } from "react";
// import SkeletonWrapper from "@/components/SkeletonWrapper";
// import { DataTableColumnHeader } from "@/components/datatable/DataTableColumnHeader";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { DownloadIcon } from "lucide-react";
// import { mkConfig, generateCsv, download } from "export-to-csv";

// interface ApplicationHistoryRow {
//   id: string;
//   StudentId: string;
//   applicationType: string;
//   status: string;
//   reason: string;
//   createdAt: Date;
//   Collage: string;
//   Department: string;
//   Program: string;
// }

// interface Props {
//   from: Date;
//   to: Date;
// }

// const emptyData: any[] = [];

// export const columns: ColumnDef<ApplicationHistoryRow>[] = [
//   {
//     accessorKey: "StudentId",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Student ID" />
//     ),
//     cell: ({ row }) => row.original.StudentId.padStart(4, "0"),
//   },
//   {
//     accessorKey: "applicationType",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Application Type" />
//     ),
//     cell: ({ row }) => row.original.applicationType,
//   },
//   {
//     accessorKey: "status",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Status" />
//     ),
//     cell: ({ row }) => row.original.status.toLowerCase(),
//   },
//   {
//     accessorKey: "reason",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Reason" />
//     ),
//     cell: ({ row }) => row.original.reason,
//   },
//   {
//     accessorKey: "createdAt",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Created At" />
//     ),
//     cell: ({ row }) => {
//       const date = new Date(row.original.createdAt);
//       return date.toLocaleDateString("default", {
//         timeZone: "UTC",
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//       });
//     },
//   },
//   {
//     accessorKey: "Collage",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Collage" />
//     ),
//     cell: ({ row }) => row.original.Collage,
//   },
//   {
//     accessorKey: "Department",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Department" />
//     ),
//     cell: ({ row }) => row.original.Department || "N/A",
//   },
//   {
//     accessorKey: "Program",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Program" />
//     ),
//     cell: ({ row }) => row.original.Program || "N/A",
//   },
// ];

// const csvConfig = mkConfig({
//   fieldSeparator: ",",
//   decimalSeparator: ".",
//   useKeysAsHeaders: true,
// });

// function ApplicationHistory({ from, to }: Props) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const appHistoryQuery = useQuery<ApplicationHistoryRow[]>({
//     queryKey: ["applications", "history", from, to],
//     queryFn: () =>
//       fetch(
//         `/api/applications/history?from=${DateToUTCDate(
//           from
//         )}&to=${DateToUTCDate(to)}`
//       ).then((res) => res.json()),
//   });

//   const handleExportCSV = (data: any[]) => {
//     if (!data) return;
//     const csv = generateCsv(csvConfig)(data);
//     download(csvConfig)(csv);
//   };

//   const table = useReactTable({
//     data: appHistoryQuery.data || emptyData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     initialState: {
//       pagination: {
//         pageSize: 10,
//       },
//     },
//     state: {
//       sorting,
//       columnFilters,
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <div className="w-full mt-4">
//       <div className="flex items-end justify-between gap-2 py-4">
//         <div className="flex gap-2">
//           {table.getColumn("status") && (
//             <DataTableFacetedFilter
//               title="Status"
//               column={table.getColumn("status")}
//               options={[
//                 { label: "Pending", value: "pending" },
//                 { label: "Accepted", value: "accepted" },
//                 { label: "Rejected", value: "rejected" },
//               ]}
//             />
//           )}
//           {table.getColumn("applicationType") && (
//             <DataTableFacetedFilter
//               title="Application Type"
//               column={table.getColumn("applicationType")}
//               options={[
//                 { label: "ID Card Replacement", value: "ID_CARD_REPLACEMENT" },
//                 {
//                   label: "Mail Card Replacement",
//                   value: "MAIL_CARD_REPLACEMENT",
//                 },
//               ]}
//             />
//           )}
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             className="h-8 lg:flex"
//             onClick={() => {
//               const data = table.getFilteredRowModel().rows.map((row) => ({
//                 StudentId: row.original.StudentId,
//                 applicationType: row.original.applicationType,
//                 status: row.original.status,
//                 reason: row.original.reason,
//                 createdAt: row.original.createdAt,
//                 Collage: row.original.Collage,
//                 Department: row.original.Department,
//                 Program: row.original.Program,
//               }));
//               handleExportCSV(data);
//             }}
//           >
//             <DownloadIcon className="mr-2 h-4 w-4" />
//             Export to CSV
//           </Button>
//         </div>
//       </div>
//       <SkeletonWrapper isLoading={appHistoryQuery.isLoading}>
//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     data-state={row.getIsSelected() && "selected"}
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext()
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns.length}
//                     className="h-24 text-center"
//                   >
//                     No results.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//         <div className="flex items-center justify-end space-x-2 py-4">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </SkeletonWrapper>
//     </div>
//   );
// }

// export default ApplicationHistory;
