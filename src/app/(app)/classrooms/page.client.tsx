"use client";

import { Classroom } from "@prisma/client";
import { columns } from "./_components/classrooms-columns";
import { ClassroomsDialogs } from "./_components/classrooms-dialogs";
import { ClassroomsPrimaryButtons } from "./_components/classrooms-primary-buttons";
import { ClassroomsTable } from "./_components/classrooms-table";
import ClassroomsProvider from "./_context/classrooms-context";

interface ClassroomsClientPageProps {
  classrooms: Classroom[];
}

export default function ClassroomsClientPage({
  classrooms,
}: ClassroomsClientPageProps) {
  return (
    <ClassroomsProvider>
      <div className="flex items-center justify-between pb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Classrooms</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all classrooms in your school.
          </p>
        </div>
        <ClassroomsPrimaryButtons />
      </div>

      <ClassroomsTable data={classrooms} columns={columns} />
      <ClassroomsDialogs />
    </ClassroomsProvider>
  );
}
