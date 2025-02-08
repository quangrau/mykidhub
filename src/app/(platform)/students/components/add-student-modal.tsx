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
import { classroomService } from "@/services/classroom";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { AddStudentForm } from "./add-student-form";

export function AddStudentModal() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const schoolId = session?.user?.school?.id as string;

  const { data: classrooms = [] } = useQuery({
    queryKey: ["classrooms", schoolId],
    queryFn: () => classroomService.findClassroomsBySchoolId(schoolId),
    enabled: Boolean(open && schoolId),
  });

  console.log({ classrooms });

  function onSubmit(values: any) {
    console.log(values);
    setOpen(false);
  }

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
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
