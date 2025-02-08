"use client";

import { Button } from "@/components/ui/button";
import { Classroom } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<Classroom>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    // cell: ({ row }) => {
    //   const date = new Date(row.getValue("createdAt"));
    //   return date.toLocaleDateString();
    // },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      console.log(row);
      return (
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    },
  },
];
