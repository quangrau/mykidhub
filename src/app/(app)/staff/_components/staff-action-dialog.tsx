"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClassroomOption } from "@/lib/classroom/classroom.types";
import { StaffWithStatus } from "@/lib/staff/staff.types";
import { StaffAddForm } from "./staff-add-form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: StaffWithStatus;
  classrooms: ClassroomOption[];
}

export function StaffActionDialog({
  open,
  onOpenChange,
  currentRow,
  classrooms,
}: Props) {
  const isEdit = !!currentRow;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit staff" : "Add new staff member"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the staff here. " : "Create new staff here. "}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <StaffAddForm
          currentRow={currentRow}
          classrooms={classrooms}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
