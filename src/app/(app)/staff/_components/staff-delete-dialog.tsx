"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StaffWithStatus } from "@/lib/staff/staff.types";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteStaffAction, deleteStaffInvitationAction } from "../actions";

interface StaffDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: StaffWithStatus | null;
}

export function StaffDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: StaffDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!currentRow) return null;

  const name = currentRow.name || currentRow.email;
  const isMember = currentRow.type === "member";

  const onConfirm = async () => {
    startTransition(async () => {
      let result;
      if (!isMember) {
        result = await deleteStaffInvitationAction(currentRow.id);
      } else {
        result = await deleteStaffAction(currentRow.id);
      }

      if (result.success) {
        onOpenChange(false);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove {name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this staff?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            aria-disabled={isPending}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Removing..." : "Remove"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
