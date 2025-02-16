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
import type { StudentGuardianWithRelations } from "@/lib/guardian/guardian.types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<StudentGuardianWithRelations>[] = [
  {
    accessorKey: "status",
    header: "Signed Up",
    // cell: ({ row }) => {
    //   const status = row.getValue("status") as InvitationStatus;
    //   return <Badge>{status}</Badge>;
    // },
  },
  {
    accessorKey: "name",
    header: "Guardian Name",
    cell: ({ row }) => {
      const guardian = row.original
        .guardian as StudentGuardianWithRelations["guardian"];
      return guardian.name;
    },
  },
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original
        .student as StudentGuardianWithRelations["student"];

      if (!student) {
        return "--";
      }

      return student.firstName + " " + student.lastName;
    },
  },
  {
    accessorKey: "relationship",
    header: "Relationship",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const guardian = row.original
        .guardian as StudentGuardianWithRelations["guardian"];
      return guardian.email;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const guardian = row.original
        .guardian as StudentGuardianWithRelations["guardian"];
      return guardian.phone || "--";
    },
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
