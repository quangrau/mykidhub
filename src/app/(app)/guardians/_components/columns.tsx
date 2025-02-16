"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GuardianWithStudents } from "@/lib/guardian/guardian.types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<GuardianWithStudents>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/guardians/${row.original?.id}`}
        className="hover:text-primary"
      >
        <div className="truncate">{row.getValue("name")}</div>
      </Link>
    ),
  },
  {
    accessorKey: "students",
    header: "Students",
    cell: ({ row }) => {
      const rows = row.original
        .guardianOf as GuardianWithStudents["guardianOf"];

      console.log(rows);

      if (!rows.length) {
        return "--";
      }

      return rows.map((item) => item.student.firstName).join(", ");
    },
  },
  {
    accessorKey: "relationship",
    header: "Relationship",
    cell: ({ row }) => {
      const rows = row.original
        .guardianOf as GuardianWithStudents["guardianOf"];

      if (!rows.length) {
        return "--";
      }

      return rows.map((item) => item.relationship).join(", ");
    },
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
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
