"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/lib/const";
import { StaffStatus, StaffWithStatus } from "@/lib/staff/staff.types";
import { ColumnDef } from "@tanstack/react-table";
import { userTypes } from "../_data/data";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<StaffWithStatus>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link href={`/staff/${row.original?.id}`} className="hover:text-primary">
        <div className="truncate">{row.getValue("name")}</div>
      </Link>
    ),
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as UserRole;
      const userType = userTypes.find(({ value }) => value === role);

      if (!userType) {
        return "--";
      }

      return (
        <div className="flex items-center gap-x-2">
          {userType.icon && (
            <userType.icon size={16} className="text-muted-foreground" />
          )}
          <span className="text-sm capitalize">{role}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Signed up",
    cell: ({ row }) => {
      const status = row.getValue("status") as StaffStatus;

      if (!status) {
        return "--";
      }

      return (
        <Badge variant={status === "signed_up" ? "outline" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: DataTableRowActions,
  },
];
