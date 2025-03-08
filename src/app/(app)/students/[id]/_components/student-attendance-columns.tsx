"use client";

import { format } from "date-fns";

import type { StudentAttendance } from "@/lib/attendance/attendance.types";
import { AttendanceStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { StudentAttendanceTableRowActions } from "./student-attendance-table-row-actions";

export const columns: ColumnDef<StudentAttendance>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.date), "MMM d, yyyy"),
  },
  {
    accessorKey: "checkIn",
    header: "Check in",
    cell: ({ row }) =>
      row.original.status === AttendanceStatus.ABSENT
        ? "Absent"
        : row.original.checkIn
        ? format(new Date(row.original.checkIn), "HH:mm a")
        : "-",
  },
  {
    id: "guardianIn",
    header: "Guardian",
    cell: () => "--",
  },
  {
    id: "signatureIn",
    header: "Signature",
    cell: () => "--",
  },
  {
    accessorKey: "checkOut",
    header: "Check out",
    cell: ({ row }) =>
      row.original.status === AttendanceStatus.ABSENT
        ? "-"
        : row.original.checkOut
        ? format(new Date(row.original.checkOut), "HH:mm a")
        : "-",
  },
  {
    id: "guardianOut",
    header: "Guardian",
    cell: () => "--",
  },
  {
    id: "signatureOut",
    header: "Signature",
    cell: () => "--",
  },
  {
    id: "actions",
    cell: StudentAttendanceTableRowActions,
  },
];
