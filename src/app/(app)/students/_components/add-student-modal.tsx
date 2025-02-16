"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClassroomOption } from "@/lib/classroom/classroom.types";
import { GuardianOption } from "@/lib/guardian/guardian.types";
import { PlusIcon } from "lucide-react";
import { AddStudentForm } from "./add-student-form";

interface Props {
  classrooms: ClassroomOption[];
  guardians: GuardianOption[];
}

export function AddStudentModal({ classrooms, guardians }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Student
          <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Add a new student to your school. Fill in the required information
            below.
          </DialogDescription>
        </DialogHeader>
        <AddStudentForm
          classrooms={classrooms}
          guardians={guardians}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
