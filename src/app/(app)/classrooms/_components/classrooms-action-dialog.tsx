"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Classroom } from "@prisma/client";
import { ClassroomsAddForm } from "./classrooms-add-form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Classroom;
}

export function ClassroomsActionDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isEdit = !!currentRow;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Classroom</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit classroom details"
              : "Add a new classroom for your school"}
          </DialogDescription>
        </DialogHeader>
        <ClassroomsAddForm onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
