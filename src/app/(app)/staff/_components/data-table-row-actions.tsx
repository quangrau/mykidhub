"use client";
import { Copy, MoreHorizontal, Send, UserPen, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StaffWithStatus } from "@/lib/staff/staff.types";
import { Row } from "@tanstack/react-table";
import { useStaff } from "../_context/staff-context";

interface DataTableRowActionsProps {
  row: Row<StaffWithStatus>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useStaff();
  const isMember = row.original.type === "member";

  async function handleSendInvitation() {
    setCurrentRow(row.original);
    setOpen("invite");
  }

  function handleEdit() {
    setCurrentRow(row.original);
    setOpen("edit");
  }

  function handleDelete() {
    setCurrentRow(row.original);
    setOpen("delete");
  }

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
        <DropdownMenuItem disabled={!isMember} onClick={handleEdit}>
          Edit
          <DropdownMenuShortcut>
            <UserPen size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isMember} onClick={handleSendInvitation}>
          Send invite
          <DropdownMenuShortcut>
            <Send size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isMember}>
          Copy invite
          <DropdownMenuShortcut>
            <Copy size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="!text-red-500">
          Delete
          <DropdownMenuShortcut>
            <UserX size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
