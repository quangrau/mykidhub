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
import { authClient } from "@/lib/auth/auth.client";
import { GuardianWithStatus } from "@/lib/guardian/guardian.types";
import { Row } from "@tanstack/react-table";
import { useGuardians } from "../_context/guardians-context";

interface DataTableRowActionsProps {
  row: Row<GuardianWithStatus>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useGuardians();
  const { type, email } = row.original;
  const isMember = type === "member";

  async function handleSendInvitation() {
    await authClient.organization.inviteMember({
      email,
      role: "guardian",
    });
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
