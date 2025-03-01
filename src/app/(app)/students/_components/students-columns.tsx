"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { StudentWithClassroom } from "@/lib/student/student.types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<StudentWithClassroom>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/students/${row.original.id}`}
        className="hover:text-primary"
      >
        <div className="truncate">{row.getValue("name")}</div>
      </Link>
    ),
  },
  {
    accessorKey: "classroomId",
    header: "Classroom",
    cell: ({ row }) => {
      const classroom = row.original.classroom as {
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
    accessorKey: "birthDate",
    header: "Date of Birth",
    cell: ({ row }) => (
      <div className="truncate">{row.getValue("birthDate") ?? "--"}</div>
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
    cell: DataTableRowActions,
  },
];
