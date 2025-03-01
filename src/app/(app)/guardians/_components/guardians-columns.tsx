"use client";

import { DataTableRowActions } from "./data-table-row-actions";

export const columns = [
  {
    accessorKey: "name",
    header: "Guardian Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "studentId",
    header: "Student",
  },
  // {
  //   accessorKey: "relationship",
  //   header: "Relationship",
  // },
  {
    accessorKey: "status",
    header: "Signed Up",
  },
  {
    id: "actions",
    cell: DataTableRowActions,
  },
];
