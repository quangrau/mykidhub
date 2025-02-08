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
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { AddClassroomForm } from "./add-classroom-form";

export function AddClassroomModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Classroom
          <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Classroom</DialogTitle>
          <DialogDescription>
            Add a new classroom to your school. Fill in the required information
            below.
          </DialogDescription>
        </DialogHeader>
        <AddClassroomForm onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
