"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GuardianWithStatus } from "@/lib/guardian/guardian.types";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  deleteGuardianAction,
  deleteGuardianInvitationAction,
} from "../actions";

interface GuardiansDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: GuardianWithStatus | null;
}

export function GuardiansDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: GuardiansDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!currentRow) return null;

  const name = currentRow.name || currentRow.email;
  const isMember = currentRow.type === "member";

  const onConfirm = async () => {
    startTransition(async () => {
      let result;
      if (!isMember) {
        result = await deleteGuardianInvitationAction(currentRow.id);
      } else {
        result = await deleteGuardianAction(currentRow.id);
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
            Are you sure you want to remove this guardian?
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
