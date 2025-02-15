"use client";

import { Student } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => (
      <Link
        href={`/students/${row.original.id}`}
        className="hover:text-primary"
      >
        <div className="truncate">{row.getValue("firstName")}</div>
      </Link>
    ),
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "classroom.name",
    header: "Classroom",
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => (
      <div className="truncate">{row.getValue("dob") ?? "--"}</div>
    ),
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: () => "--",
  },
  {
    accessorKey: "attendance",
    header: "Attendance status",
    cell: () => "--",
  },
  {
    id: "actions",
    cell: () => <DataTableRowActions />,
  },
];
