"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClassroomOption } from "@/lib/classroom/classroom.types";
import { GuardianOption } from "@/lib/guardian/guardian.types";
import { Student } from "@prisma/client";
import { StudentsAddForm } from "./students-add-form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classrooms: ClassroomOption[];
  guardians: GuardianOption[];
  currentRow?: Student;
}

export function StudentsActionDialog({
  open,
  onOpenChange,
  classrooms,
  guardians,
  currentRow,
}: Props) {
  const isEdit = !!currentRow;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Student" : "Add Student"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the student's information"
              : " Add a new student to your school. Fill in the required information below."}
          </DialogDescription>
        </DialogHeader>
        <StudentsAddForm
          classrooms={classrooms}
          guardians={guardians}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
