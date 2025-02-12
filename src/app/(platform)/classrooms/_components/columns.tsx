"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Classroom } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Classroom>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/classrooms/${row.original.id}`}
        className="hover:text-primary"
      >
        <div className="truncate">{row.getValue("name")}</div>
      </Link>
    ),
  },
  {
    accessorKey: "_count.students",
    header: "Students",
  },
  {
    accessorKey: "_count.checkins",
    header: "Checked-in",
    cell: () => 0,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as number;
      return (
        <Badge variant={status ? "default" : "destructive"}>
          {status ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="text-right">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
