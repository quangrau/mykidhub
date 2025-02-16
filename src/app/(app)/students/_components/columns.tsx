"use client";

import { Badge } from "@/components/ui/badge";
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
    accessorKey: "classroom",
    header: "Classroom",
    cell: ({ row }) => {
      const classroom = row.getValue("classroom") as {
        id: string;
        name: string;
      };

      if (!classroom) {
        return "--";
      }

      return <Badge variant="outline">{classroom.name}</Badge>;
    },
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
