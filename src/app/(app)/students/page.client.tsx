"use client";

import { ClassroomOption } from "@/lib/classroom/classroom.types";
import { GuardianOption } from "@/lib/guardian/guardian.types";
import { Student } from "@prisma/client";
import { columns } from "./_components/students-columns";
import { StudentsDialogs } from "./_components/students-dialogs";
import { StudentsPrimaryButtons } from "./_components/students-primary-buttons";
import { StudentsTable } from "./_components/students-table";
import StudentsProvider from "./_context/students-context";

interface Props {
  students: Student[];
  classrooms: ClassroomOption[];
  guardians: GuardianOption[];
}

export default function StudentsClientPage({
  students,
  classrooms,
  guardians,
}: Props) {
  return (
    <StudentsProvider>
      <div className="flex flex-wrap items-center justify-between pb-8 gap-x-4 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all students in your school.
          </p>
        </div>
        <StudentsPrimaryButtons />
      </div>
      <StudentsTable data={students} columns={columns} />
      <StudentsDialogs classrooms={classrooms} guardians={guardians} />
    </StudentsProvider>
  );
}
