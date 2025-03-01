"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Classroom } from "@prisma/client";
import { toast } from "sonner";
import { deleteClassroomAction } from "../actions";

interface ClassroomsDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Classroom | null;
}

export function ClassroomsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ClassroomsDeleteDialogProps) {
  const name = currentRow?.name;

  const onConfirm = async () => {
    const result = await deleteClassroomAction(currentRow?.id as string);

    if (result.success) {
      onOpenChange(false);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove {name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this class?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm}>
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
