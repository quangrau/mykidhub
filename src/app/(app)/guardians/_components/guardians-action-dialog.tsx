"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GuardianWithStatus } from "@/lib/guardian/guardian.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: GuardianWithStatus;
}

export function GuardiansActionDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit guardian</DialogTitle>
          <DialogDescription>
            Update guardian info here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
