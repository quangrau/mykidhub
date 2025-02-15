"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ClassroomOption } from "@/lib/classroom/classroom.types";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { AddStaffForm } from "./add-staff-form";

interface Props {
  classrooms: ClassroomOption[];
}

export function AddStaffModal({ classrooms }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Staff
          <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add staff member</DialogTitle>
          <DialogDescription>
            Add a new staff member to your school. Fill in the required
            information below.
          </DialogDescription>
        </DialogHeader>
        <AddStaffForm classrooms={classrooms} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
